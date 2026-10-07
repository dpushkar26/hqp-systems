'use server';

import { z } from 'zod';
import { prisma } from '@/server/db/prisma';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

// Setup Nodemailer transporter (you will need to provide SMTP credentials in .env)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || 'user',
    pass: process.env.SMTP_PASS || 'pass',
  },
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerOwner(payload: z.infer<typeof registerSchema>) {
  const result = registerSchema.safeParse(payload);
  if (!result.success) return { error: 'Invalid payload' };
  const { email, password } = result.data;

  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return { error: 'User already exists' };

  // 2. Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // 3. Create unverified user
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: 'OWNER',
    }
  });

  // 4. Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // 5. Save OTP to DB
  await prisma.ownerOTP.create({
    data: {
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    }
  });

  // 6. Send OTP via Email (Non-blocking)
  transporter.sendMail({
    from: '"Venu Support" <support@venu.com>',
    to: email,
    subject: 'Your Registration OTP',
    text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
  }).catch(console.error);

  return { success: true, message: 'OTP sent to email' };
}

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export async function verifyOwnerOTP(payload: z.infer<typeof verifyOtpSchema>) {
  const result = verifyOtpSchema.safeParse(payload);
  if (!result.success) return { error: 'Invalid payload' };
  const { email, otp } = result.data;

  // 1. Find valid OTP
  const record = await prisma.ownerOTP.findFirst({
    where: {
      email,
      otp,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' }
  });

  if (!record) return { error: 'Invalid or expired OTP' };

  // 2. Mark User as verified
  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() }
  });

  // 3. Delete OTP record
  await prisma.ownerOTP.delete({ where: { id: record.id } });

  return { success: true, message: 'Email verified successfully! You can now log in.' };
}
