'use server';
import { prisma } from '@/server/db/prisma';

import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { Queue } from 'bullmq';
import { requireRole } from '@/server/auth/guards';
import { PERMISSIONS } from '@/server/auth/permissions';
import * as xlsx from 'xlsx';



// Setup BullMQ for WhatsApp background jobs
const whatsappQueue = new Queue('whatsapp-notifications', {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  }
});

// 1. Generate Receipt for Print
const generateReceiptSchema = z.object({
  invoiceId: z.string(),
  hotelId: z.string(),
});

export async function generateReceipt(payload: z.infer<typeof generateReceiptSchema>) {
  const { user, hotelId: sessionHotelId } = await requireRole(PERMISSIONS["bills:generate"]);

  const result = generateReceiptSchema.safeParse(payload);
  if (!result.success) {
    return { error: 'Invalid payload', details: result.error.issues };
  }

  if (user.role !== 'PLATFORM_ADMIN' && user.role !== 'PLATFORM_OPS' && sessionHotelId !== result.data.hotelId) {
    return { error: 'Forbidden' };
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: result.data.invoiceId, hotelId: result.data.hotelId },
    include: {
      table: true,
      customer: true,
      orders: {
        include: {
          items: {
            include: { menuItem: true }
          }
        }
      }
    }
  });

  if (!invoice) return { error: 'Invoice not found' };

  return { success: true, receiptData: invoice };
}


// 2. Send Bill to WhatsApp
const sendWhatsAppSchema = z.object({
  invoiceId: z.string(),
  phoneNumber: z.string().min(10),
});

export async function sendBillToWhatsApp(payload: z.infer<typeof sendWhatsAppSchema>) {
  await requireRole(PERMISSIONS["bills:generate"]);
  const result = sendWhatsAppSchema.safeParse(payload);
  if (!result.success) return { error: 'Invalid payload' };

  // Instead of blocking the server, we add it to a Redis queue
  await whatsappQueue.add('send-invoice-bill', {
    invoiceId: result.data.invoiceId,
    phoneNumber: result.data.phoneNumber,
  });

  return { success: true, message: 'WhatsApp message queued successfully' };
}


// 3. Export Daily Bills to Excel
const exportDailyBillsSchema = z.object({
  hotelId: z.string(),
  date: z.string(), // Format: YYYY-MM-DD
});

export async function exportDailyBillsToExcel(payload: z.infer<typeof exportDailyBillsSchema>) {
  const { user, hotelId: sessionHotelId } = await requireRole(PERMISSIONS["reports:view"]);
  const result = exportDailyBillsSchema.safeParse(payload);
  if (!result.success) return { error: 'Invalid payload' };

  const { hotelId, date } = result.data;
  if (user.role !== 'PLATFORM_ADMIN' && user.role !== 'PLATFORM_OPS' && sessionHotelId !== hotelId) {
    return { error: 'Forbidden' };
  }
  const startDate = new Date(`${date}T00:00:00.000Z`);
  const endDate = new Date(`${date}T23:59:59.999Z`);

  const invoices = await prisma.invoice.findMany({
    where: {
      hotelId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      }
    },
    include: {
      table: true,
      customer: true,
    }
  });

  // Map database records to flat objects for Excel
  const excelData = invoices.map((inv: any) => ({
    'Invoice ID': inv.id,
    'Date & Time': inv.createdAt.toLocaleString(),
    'Table Name': inv.table.name,
    'Customer Phone': inv.customer.phoneNumber,
    'Amount (₹)': inv.totalAmount,
    'Status': inv.paymentStatus,
    'Payment Mode': inv.paymentMode || 'N/A'
  }));

  // Create workbook and worksheet
  const worksheet = xlsx.utils.json_to_sheet(excelData);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Daily Bills");

  // Write to base64 so it can be downloaded by the browser
  const excelBase64 = xlsx.write(workbook, { type: 'base64', bookType: 'xlsx' });

  return { 
    success: true, 
    fileName: `Daily_Bills_${date}.xlsx`,
    excelBase64 
  };
}
