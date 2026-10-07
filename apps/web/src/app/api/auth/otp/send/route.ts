import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { generateOTP, hashOTP, canSendOTP, OTP_EXPIRY_MS, SEND_COOLDOWN_MS } from '@/server/services/otp';
import { sms } from '@/server/integrations/sms';

// Indian mobile canonical, starting with +91 followed by 10 digits
const SendOtpSchema = z.object({
  phoneNumber: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian mobile number'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { phoneNumber } = SendOtpSchema.parse(body);

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('active_session_id')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: 'No active session found. Please scan the QR code again.' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });
    }

    try {
      await canSendOTP(sessionId);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 429 });
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
    const sentAt = new Date();

    await prisma.session.update({
      where: { id: sessionId },
      data: {
        otpHash: hashOTP(phoneNumber, otpCode),
        otpExpiresAt: expiresAt,
        otpSentAt: sentAt,
        otpAttempts: 0,
      }
    });

    try {
      await sms.send({
        to: phoneNumber,
        variables: { otp: otpCode }
      });
    } catch (smsError) {
      console.error('[PROD] SMS Request Failed:', smsError);
    }

    return NextResponse.json({
      ok: true,
      resendAvailableAt: new Date(Date.now() + SEND_COOLDOWN_MS).toISOString(),
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
