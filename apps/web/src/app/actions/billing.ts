'use server';

import { z } from 'zod';
import { PrismaClient, PaymentMode } from '@prisma/client';
import Razorpay from 'razorpay';

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

const generateInvoiceSchema = z.object({
  hotelId: z.string(),
  tableId: z.string(),
  customerId: z.string(),
});

export async function generateInvoice(payload: z.infer<typeof generateInvoiceSchema>) {
  const result = generateInvoiceSchema.safeParse(payload);
  if (!result.success) {
    return { error: 'Invalid payload', details: result.error.issues };
  }
  const { hotelId, tableId, customerId } = result.data;

  // 1. Fetch all UNPAID orders for this specific customer at this specific table
  const unpaidOrders = await prisma.order.findMany({
    where: {
      hotelId,
      tableId,
      customerId,
      paymentStatus: 'UNPAID',
    },
    include: {
      items: true,
    }
  });

  if (unpaidOrders.length === 0) {
    return { error: 'No unpaid orders found for this customer at this table.' };
  }

  // 2. Calculate total bill amount
  let totalAmount = 0;
  for (const order of unpaidOrders) {
    for (const item of order.items) {
      totalAmount += item.price * item.quantity;
    }
  }

  // 3. Create a single Invoice (Bill) for all these orders
  const invoice = await prisma.invoice.create({
    data: {
      hotelId,
      tableId,
      customerId,
      totalAmount,
      paymentStatus: 'UNPAID',
      orders: {
        connect: unpaidOrders.map((order: any) => ({ id: order.id })), // Link all unpaid orders to this invoice
      }
    },
  });

  // 4. Optionally, create Razorpay checkout link for the combined bill
  const rpOrder = await razorpay.orders.create({
    amount: totalAmount * 100, // Razorpay works in paise
    currency: 'INR',
    receipt: invoice.id,
  });

  // Create payment record for the invoice
  await prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      gatewayRef: rpOrder.id,
      amount: totalAmount,
      status: 'PENDING'
    }
  });

  return {
    success: true,
    invoiceId: invoice.id,
    totalAmount,
    razorpayCheckout: {
      id: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
    }
  };
}
