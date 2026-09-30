import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json();
    
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    try {
      await fetch('http://localhost:4000/internal/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'order:update',
          orderId: order.id,
          status: order.status,
          hotelId: order.hotelId
        })
      });
    } catch (err) {
      console.error('Failed to notify realtime server', err);
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
