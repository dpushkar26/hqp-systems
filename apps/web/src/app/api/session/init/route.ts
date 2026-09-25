import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { z } from 'zod';

const InitSessionSchema = z.object({
  tableId: z.string().min(1),
  hotelId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableId, hotelId } = InitSessionSchema.parse(body);

    // 1. Verify the table exists for this hotel
    const table = await prisma.table.findFirst({
      where: {
        id: tableId,
        hotelId: hotelId,
      },
    });

    if (!table) {
      return NextResponse.json({ error: 'Invalid Table QR Code' }, { status: 400 });
    }

    // 2. Create a new Anonymous Session
    const session = await prisma.session.create({
      data: {
        tableId: table.id,
        hotelId: hotelId,
        isVerified: false,
      },
    });

    // 3. Set the Secure HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set('active_session_id', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 12, // 12 hours
      path: '/',
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      message: 'Anonymous session established',
    });

  } catch (error) {
    console.error('Session Init Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
