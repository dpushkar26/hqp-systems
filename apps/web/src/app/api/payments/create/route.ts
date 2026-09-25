import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Razorpay from 'razorpay';



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Order already paid' }, { status: 400 });
    }

    // Calculate total
    const itemTotal = order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const totalWithTax = itemTotal * 1.18; // 18% GST

    // Razorpay expects amount in paise (multiply by 100)
    const options = {
      amount: Math.round(totalWithTax * 100),
      currency: "INR",
      receipt: `receipt_order_${order.id}`,
    };

    // const razorpayOrder = await razorpay.orders.create(options);
    const razorpayOrder = {
      id: `mock_order_${Math.floor(Math.random() * 1000000)}`,
      amount: options.amount,
      currency: options.currency
    };

    // Create a Payment tracking row in our DB
    await prisma.payment.create({
      data: {
        orderId: order.id,
        gatewayRef: razorpayOrder.id,
        amount: totalWithTax,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount,
      currency: options.currency,
      key: process.env.RAZORPAY_KEY_ID, // Send public key to client to init checkout
    });

  } catch (error) {
    console.error('Create Payment Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
