import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ hotelId: string; tableId: string }> }
) {
  const { hotelId, tableId } = await params;
  
  // 1. Verify the table exists for this hotel
  const table = await prisma.table.findFirst({
    where: { id: tableId, hotelId: hotelId },
  });

  if (!table) {
    return new NextResponse('Invalid QR Code: This table does not exist or is not registered to this hotel.', { status: 400 });
  }

  // 2. Create a new Anonymous Session
  const session = await prisma.session.create({
    data: {
      tableId: table.id,
      hotelId: hotelId,
      isVerified: false,
    },
  });

  // 3. Create redirect response and set cookie
  const url = new URL(`/${hotelId}/menu`, request.url);
  const response = NextResponse.redirect(url);

  response.cookies.set('active_session_id', session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 12, // 12 hours session
    path: '/',
  });

  return response;
}
