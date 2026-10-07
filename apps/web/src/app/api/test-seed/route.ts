import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';

export async function POST() {
  try {
    const hotelId = 'hqsp-demo';

    // Create a demo hotel if not exists
    await prisma.hotel.upsert({
      where: { slug: hotelId },
      update: {},
      create: {
        id: hotelId,
        slug: hotelId,
        name: 'HQSP Demo Hotel',
      },
    });

    // Create fresh tables with unique IDs
    const newTables = [
      { id: 't-101', name: 'Table 101' },
      { id: 't-102', name: 'Table 102' },
      { id: 't-103', name: 'Table 103' },
    ];

    for (const t of newTables) {
      await prisma.table.upsert({
        where: { id: t.id },
        update: { hotelId: hotelId },
        create: {
          id: t.id,
          hotelId: hotelId,
          name: t.name,
        },
      });
    }

    // Ensure menu categories and items match the mock data exactly
    const mockCategories = [
      { id: 'cat_1', name: 'Starters' },
      { id: 'cat_2', name: 'Mains' },
      { id: 'cat_3', name: 'Beverages' },
    ];

    for (const cat of mockCategories) {
      await prisma.menuCategory.upsert({
        where: { id: cat.id },
        update: { name: cat.name },
        create: { id: cat.id, hotelId, name: cat.name },
      });
    }

    const mockItems = [
      { id: 'item_1', name: 'Paneer Tikka', price: 220, categoryId: 'cat_1' },
      { id: 'item_2', name: 'Chicken Kebab', price: 280, categoryId: 'cat_1' },
      { id: 'item_3', name: 'Butter Chicken', price: 350, categoryId: 'cat_2' },
      { id: 'item_4', name: 'Dal Tadka', price: 180, categoryId: 'cat_2' },
      { id: 'item_5', name: 'Masala Chaas', price: 50, categoryId: 'cat_3' },
    ];

    for (const item of mockItems) {
      await prisma.menuItem.upsert({
        where: { id: item.id },
        update: { price: item.price, name: item.name },
        create: {
          id: item.id,
          hotelId,
          categoryId: item.categoryId,
          name: item.name,
          price: item.price,
          isAvailable: true,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'New unique tables created for hqsp-demo.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
