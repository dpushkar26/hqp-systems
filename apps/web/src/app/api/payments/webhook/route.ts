import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';
import crypto from 'crypto';
import { Redis } from '@upstash/redis';


const redis = Redis.fromEnv();

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    
    // Verify Webhook Signature to ensure it actually came from Razorpay
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'secret'; // Set this in .env
    const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);

    // Ensure we handle only payment.captured (successful payment)
    if (payload.event === 'payment.captured') {
      const paymentEntity = payload.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;

      // Find our internal payment tracking row
      const payment = await prisma.payment.findFirst({
        where: { gatewayRef: razorpayOrderId },
        include: { order: true }
      });

      if (payment) {
        // Mark Payment and Order as PAID
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'PAID' }
          }),
          prisma.order.update({
            where: { id: payment.orderId },
            data: { paymentStatus: 'PAID' }
          })
        ]);

        // Publish event to the Realtime Server via internal webhook so the Owner dashboard sees it instantly
        try {
          const webhookUrl = process.env.REALTIME_WEBHOOK_URL || 'http://localhost:4000/internal/webhook';
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              hotelId: payment.order.hotelId,
              event: 'PAYMENT_RECEIVED',
              orderId: payment.order.id,
              tableId: payment.order.tableId,
              amount: payment.amount
            })
          });
        } catch (webhookErr) {
          console.error('Failed to send webhook to realtime server', webhookErr);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
