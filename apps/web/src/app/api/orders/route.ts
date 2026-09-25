import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { Redis } from '@upstash/redis';


const redis = Redis.fromEnv(); // Uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from .env

const OrderItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().int().min(1),
});

const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1),
  instructions: z.string().optional(),
  paymentMode: z.enum(['UPI', 'CARD', 'CASH']).default('CASH'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, instructions, paymentMode } = CreateOrderSchema.parse(body);

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('active_session_id')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { table: true, customer: true }
    });

    if (!session || !session.isVerified || !session.customerId) {
      return NextResponse.json({ error: 'Session not verified. Please complete OTP.' }, { status: 403 });
    }

    // Fetch prices for all items securely from DB (never trust client prices)
    const menuItemIds = items.map(item => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, hotelId: session.hotelId }
    });

    if (menuItems.length !== items.length) {
      return NextResponse.json({ error: 'One or more items are invalid or unavailable.' }, { status: 400 });
    }

    // Construct Order Items payload
    const orderItemsData = items.map(clientItem => {
      const dbItem = menuItems.find((m: any) => m.id === clientItem.menuItemId)!;
      return {
        menuItemId: dbItem.id,
        quantity: clientItem.quantity,
        price: dbItem.price, // Lock in the price at time of order
      };
    });

    // Create the Order in a Transaction
    const order = await prisma.order.create({
      data: {
        hotelId: session.hotelId,
        tableId: session.tableId,
        customerId: session.customerId,
        paymentMode: paymentMode,
        status: 'PLACED',
        paymentStatus: 'UNPAID',
        items: {
          create: orderItemsData,
        }
      },
      include: {
        table: true,
        items: {
          include: { menuItem: true }
        }
      }
    });

    // Publish event to Redis for the Realtime server to pick up and broadcast to the Kitchen Dashboard
    await redis.publish(`hotel:${session.hotelId}:orders`, JSON.stringify({
      event: 'NEW_ORDER',
      orderId: order.id,
      table: order.table.name,
      status: order.status,
      items: order.items.map((i: any) => ({ name: i.menuItem.name, quantity: i.quantity }))
    }));

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Order placed successfully',
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const orders = await prisma.order.findMany({
      include: { 
        items: { include: { menuItem: true } },
        table: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
