import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { hashOTP, canVerifyOTP, recordFailedAttempt } from '@/server/services/otp';

const VerifyOtpSchema = z.object({
  phoneNumber: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  otpCode: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, otpCode } = VerifyOtpSchema.parse(body);

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('active_session_id')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session expired.' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: 'Invalid session state.' }, { status: 400 });
    }

    try {
      await canVerifyOTP(sessionId);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 429 });
    }

    if (session.otpExpiresAt && new Date() > session.otpExpiresAt) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    if (session.otpHash !== hashOTP(phoneNumber, otpCode)) {
      await recordFailedAttempt(sessionId);
      return NextResponse.json({ error: 'Invalid OTP code.' }, { status: 400 });
    }

    const customer = await prisma.customer.upsert({
      where: {
        phoneNumber_hotelId: {
          phoneNumber: phoneNumber,
          hotelId: session.hotelId,
        }
      },
      update: {},
      create: {
        phoneNumber: phoneNumber,
        hotelId: session.hotelId,
        visitCount: 0,
      }
    });

    await prisma.session.update({
      where: { id: sessionId },
      data: {
        isVerified: true,
        otpHash: null,
        customerId: customer.id,
      }
    });

    return NextResponse.json({
      ok: true,
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
