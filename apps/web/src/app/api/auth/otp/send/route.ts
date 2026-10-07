import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';
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

    // 5. Send the SMS via Fast2SMS (Cost-effective for Indian numbers)
    if (process.env.FAST2SMS_API_KEY) {
      try {
        const toPhone = phoneNumber.replace('+91', ''); // Fast2SMS expects 10 digit number
        
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'otp',
            variables_values: otpCode,
            numbers: toPhone
          })
        });

        const data = await response.json();
        
        if (data.return) {
          console.log(`[PROD] Fast2SMS sent successfully to ${toPhone}`);
        } else {
          console.error('[PROD] Fast2SMS Error:', data.message);
          console.log(`[DEV FALLBACK] OTP for ${phoneNumber} is ${otpCode}`);
        }
      } catch (smsError) {
        console.error('[PROD] SMS Request Failed:', smsError);
        console.log(`[DEV FALLBACK] OTP for ${phoneNumber} is ${otpCode}`);
      }
    } else {
      console.log(`[DEV MODE] OTP for ${phoneNumber} is ${otpCode}`);
    }

    return NextResponse.json({
      success: true,
      message: 'OTP Sent successfully',
      // In a real production app you would remove this line
      // But we leave it here so your dev testing isn't blocked if Fast2SMS isn't set up yet!
      devOtpCode: otpCode, 
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
