import { prisma } from '@/server/db/prisma';
import { Redis } from '@upstash/redis';
import crypto from 'crypto';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export const OTP_EXPIRY_MS = 5 * 60 * 1000;
export const MAX_ATTEMPTS = 5;
export const SEND_COOLDOWN_MS = 30 * 1000; // 30 seconds cooldown between sends

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashOTP(phoneNumber: string, otp: string): string {
  return crypto.createHash('sha256').update(`${phoneNumber}:${otp}`).digest('hex');
}

export async function canSendOTP(sessionId: string): Promise<boolean> {
  const rateLimitKey = `rate-limit:otp-send:${sessionId}`;
  const attempts = await redis.incr(rateLimitKey);
  if (attempts === 1) {
    await redis.expire(rateLimitKey, 3600); // Max 10 sends per hour
  }
  if (attempts > 10) {
    throw new Error('Too many OTP requests. Please try again later.');
  }

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (session?.otpSentAt) {
    const timeSinceLastSend = Date.now() - session.otpSentAt.getTime();
    if (timeSinceLastSend < SEND_COOLDOWN_MS) {
      throw new Error(`Please wait before requesting another OTP.`);
    }
  }
  return true;
}

export async function canVerifyOTP(sessionId: string): Promise<boolean> {
  const rateLimitKey = `rate-limit:otp-verify:${sessionId}`;
  const attempts = await redis.incr(rateLimitKey);
  if (attempts === 1) {
    await redis.expire(rateLimitKey, 300); // Expire in 5 mins
  }
  
  if (attempts > 20) { // High threshold for brute force protection over 5 mins
      throw new Error('Too many verification attempts. Please try again later.');
  }

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (session && session.otpAttempts >= MAX_ATTEMPTS) {
    throw new Error('Maximum OTP verification attempts exceeded. Please request a new OTP.');
  }
  return true;
}

export async function recordFailedAttempt(sessionId: string): Promise<void> {
  await prisma.session.update({
    where: { id: sessionId },
    data: { otpAttempts: { increment: 1 } },
  });
}
