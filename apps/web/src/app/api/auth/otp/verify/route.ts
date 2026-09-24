import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { z } from 'zod';



const VerifyOtpSchema = z.object({
  otpCode: z.string().length(4),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { otpCode } = VerifyOtpSchema.parse(body);

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('active_session_id')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session expired.' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { customer: true }
    });

    if (!session || !session.customerId) {
      return NextResponse.json({ error: 'Invalid session state.' }, { status: 400 });
    }

    // Check expiry
    if (session.otpExpiresAt && new Date() > session.otpExpiresAt) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    // Verify OTP
    if (session.otpCode !== otpCode) {
      return NextResponse.json({ error: 'Invalid OTP code.' }, { status: 400 });
    }

    // Success! Upgrade session to verified and increment visit count for loyalty
    await prisma.$transaction([
      prisma.session.update({
        where: { id: sessionId },
        data: {
          isVerified: true,
          otpCode: null, // Clear OTP after use
        }
      }),
      // Assuming this is their first order of the visit, increment visit count
      // In a real app, we'd ensure we only increment once per calendar day
      prisma.customer.update({
        where: { id: session.customerId },
        data: {
          visitCount: { increment: 1 },
          lastVisitDate: new Date(),
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      message: 'Session verified successfully',
      visitCount: (session.customer?.visitCount ?? 0) + 1
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
