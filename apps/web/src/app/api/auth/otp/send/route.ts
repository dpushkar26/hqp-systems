import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { z } from 'zod';

const SendOtpSchema = z.object({
  phoneNumber: z.string().min(10).max(15),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber } = SendOtpSchema.parse(body);

    // 1. Get the current active session from cookies
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

    // 2. Generate a 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // 3. Find or Create the Customer
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

    // 4. Update the Session with the OTP and tie it to the Customer
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        customerId: customer.id,
        otpCode: otpCode,
        otpExpiresAt: expiresAt,
      }
    });

    // 5. TODO: Integrate Twilio or SNS here to actually send the SMS
    console.log(`[DEV MODE] OTP for ${phoneNumber} is ${otpCode}`);

    return NextResponse.json({
      success: true,
      message: 'OTP Sent successfully',
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
