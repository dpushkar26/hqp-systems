import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('active_session_id')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (!session || !session.customerId) {
       return NextResponse.json({ orders: [] });
    }

    const orders = await prisma.order.findMany({
      where: { 
        customerId: session.customerId,
        hotelId: session.hotelId,
        paymentStatus: 'UNPAID' // Only active orders
      },
      include: {
        items: { include: { menuItem: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
