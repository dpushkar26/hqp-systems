'use server';

import { z } from 'zod';
import { PrismaClient, PaymentMode } from '@prisma/client';
import { Redis } from '@upstash/redis';
import { Queue } from 'bullmq';
import Razorpay from 'razorpay';

// These would normally be instantiated in a separate db.ts or lib/ folder
const prisma = new PrismaClient();
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});
const jobsQueue = new Queue('background-jobs', {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  }
});
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

const createOrderSchema = z.object({
  hotelId: z.string(),
  tableId: z.string(),
  phoneNumber: z.string().min(10),
  paymentMode: z.nativeEnum(PaymentMode),
  items: z.array(z.object({
    menuItemId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1),
});

export async function createOrder(payload: z.infer<typeof createOrderSchema>) {
  // 1 & 2. Validate payload
  const result = createOrderSchema.safeParse(payload);
  if (!result.success) {
    return { error: 'Invalid payload', details: result.error.issues };
  }
  const { hotelId, tableId, phoneNumber, paymentMode, items } = result.data;

  // 3. Re-fetch each MenuItem and recompute total
  const itemIds = items.map(i => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: {
      id: { in: itemIds },
      hotelId: hotelId, // Multi-tenant check on items
    },
  });

  if (menuItems.length !== itemIds.length) {
    return { error: 'One or more items are invalid or do not belong to this hotel.' };
  }

  let totalAmount = 0;
  const orderItemsData = items.map(cartItem => {
    const menuItem = menuItems.find(m => m.id === cartItem.menuItemId)!;
    if (!menuItem.isAvailable) {
      throw new Error(`Item ${menuItem.name} is currently unavailable.`);
    }
    totalAmount += menuItem.price * cartItem.quantity;
    return {
      menuItemId: menuItem.id,
      quantity: cartItem.quantity,
      price: menuItem.price,
    };
  });

  // 4. Verify tableId belongs to hotelId
  const table = await prisma.table.findFirst({
    where: { id: tableId, hotelId },
  });
  if (!table) {
    return { error: 'Invalid table for this hotel.' };
  }

  // 5. Single Postgres transaction
  const order = await prisma.$transaction(async (tx) => {
    // 5a. Upsert Customer
    let customer = await tx.customer.findUnique({
      where: {
        phoneNumber_hotelId: {
          phoneNumber,
          hotelId,
        }
      }
    });

    if (!customer) {
      customer = await tx.customer.create({
        data: {
          hotelId,
          phoneNumber,
        }
      });
    }

    // 5b. Atomic visit-count update using raw SQL to prevent race conditions
    await tx.$executeRaw`
      UPDATE "Customer"
      SET "visitCount" = "visitCount" + 1, "lastVisitDate" = CURRENT_DATE
      WHERE id = ${customer.id}
        AND ("lastVisitDate" IS NULL OR "lastVisitDate" < CURRENT_DATE);
    `;

    // Re-fetch customer to check if a reward was unlocked
    const updatedCustomer = await tx.customer.findUnique({
      where: { id: customer.id }
    });

    // 5c. Insert Order + OrderItem rows
    const newOrder = await tx.order.create({
      data: {
        hotelId,
        tableId,
        customerId: customer.id,
        paymentMode,
        paymentStatus: 'UNPAID', // Initial state
        status: 'PLACED',
        items: {
          create: orderItemsData,
        }
      },
      include: {
        items: true,
      }
    });

    return { newOrder, updatedCustomer };
  });

  const { newOrder, updatedCustomer } = order;

  // 6. Payment processing
  let checkoutParams = null;
  if (paymentMode === 'UPI' || paymentMode === 'CARD') {
    // Create Razorpay order
    const rpOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // in paise
      currency: 'INR',
      receipt: newOrder.id,
    });

    // Update order status to PENDING
    await prisma.order.update({
      where: { id: newOrder.id },
      data: { paymentStatus: 'PENDING' },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: newOrder.id,
        gatewayRef: rpOrder.id,
        amount: totalAmount,
        status: 'PENDING'
      }
    });

    checkoutParams = {
      id: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
    };
  }

  // 7. Publish to Redis (Async)
  redis.publish(`hotel:${hotelId}:orders`, JSON.stringify({
    orderId: newOrder.id,
    tableId,
    items: newOrder.items,
    status: newOrder.status,
  })).catch(console.error); // Catch to not block the request

  // Reward check (Async)
  if (updatedCustomer) {
    const rules = await prisma.rewardRule.findMany({ where: { hotelId } });
    const unlockedRule = rules.find(r => r.visitThreshold === updatedCustomer.visitCount);
    if (unlockedRule) {
      redis.publish(`hotel:${hotelId}:reward-unlocked`, JSON.stringify({
        customerId: updatedCustomer.id,
        visitCount: updatedCustomer.visitCount,
      })).catch(console.error);
    }
  }

  // 9. Enqueue background job (Async)
  jobsQueue.add('send-order-confirmation', {
    orderId: newOrder.id,
    phoneNumber,
  }).catch(console.error);

  // 10. Return success immediately
  return {
    success: true,
    orderId: newOrder.id,
    status: newOrder.status,
    paymentStatus: paymentMode === 'CASH' ? 'UNPAID' : 'PENDING',
    razorpayCheckout: checkoutParams,
  };
}
