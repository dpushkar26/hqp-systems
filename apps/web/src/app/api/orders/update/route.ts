import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';
import { Redis } from '@upstash/redis';
import { requireRole } from '@/server/auth/guards';
import { PERMISSIONS } from '@/server/auth/permissions';
import { AuthError } from '@/server/auth/guards';

const redis = Redis.fromEnv();

export async function PATCH(request: Request) {
  try {
    const { user, hotelId } = await requireRole(PERMISSIONS["orders:update"]);

    const { orderId, status } = await request.json();
    
    // Ensure order belongs to staff's hotel (if not platform admin/ops)
    const orderData = await prisma.order.findUnique({ where: { id: orderId } });
    if (!orderData) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (user.role !== "PLATFORM_ADMIN" && user.role !== "PLATFORM_OPS" && orderData.hotelId !== hotelId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    try {
      const webhookUrl = process.env.REALTIME_WEBHOOK_URL || 'http://localhost:4000/internal/webhook';
      await fetch(webhookUrl, {
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
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
