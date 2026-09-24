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

    await redis.publish(`hotel:${order.hotelId}:orders`, JSON.stringify({
      event: 'order:update',
      orderId: order.id,
      status: order.status
    }));

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
