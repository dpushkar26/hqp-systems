'use server';
import { prisma } from '@/server/db/prisma';

import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '@/server/auth/guards';
import { PERMISSIONS } from '@/server/auth/permissions';



const getCustomerProfileSchema = z.object({
  hotelId: z.string(),
  phoneNumber: z.string().min(10),
});

export async function getCustomerProfile(payload: z.infer<typeof getCustomerProfileSchema>) {
  const { user, hotelId: sessionHotelId } = await requireRole(PERMISSIONS["orders:read"]);

  const result = getCustomerProfileSchema.safeParse(payload);
  if (!result.success) {
    return { error: 'Invalid payload', details: result.error.issues };
  }

  const { hotelId, phoneNumber } = result.data;
  
  if (user.role !== 'PLATFORM_ADMIN' && user.role !== 'PLATFORM_OPS' && sessionHotelId !== hotelId) {
    return { error: 'Forbidden' };
  }


  // Fetch the customer along with their past orders and invoices
  const customer = await prisma.customer.findUnique({
    where: {
      phoneNumber_hotelId: {
        phoneNumber,
        hotelId,
      }
    },
    include: {
      // Fetch all past invoices, sorted by most recent
      invoices: {
        orderBy: { createdAt: 'desc' },
        include: {
          orders: {
            include: {
              items: {
                include: {
                  menuItem: true // Get details about what they ordered
                }
              }
            }
          }
        }
      },
      // Optionally fetch any orders that might not be invoiced yet
      orders: {
        where: { invoiceId: null },
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              menuItem: true
            }
          }
        }
      }
    }
  });

  if (!customer) {
    return { 
      error: 'Customer not found',
      isNewCustomer: true 
    };
  }

  return {
    success: true,
    isNewCustomer: false,
    customerProfile: {
      id: customer.id,
      visitCount: customer.visitCount,
      lastVisitDate: customer.lastVisitDate,
      pastInvoices: customer.invoices, // History of all paid/completed bills
      activeOrders: customer.orders, // Any active uninvoiced orders
    }
  };
}
