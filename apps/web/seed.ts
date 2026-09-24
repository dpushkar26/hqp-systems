import { prisma } from './src/lib/prisma';

async function main() {
  console.log('Seeding database...');

  // Create Hotel
  const hotel = await prisma.hotel.upsert({
    where: { slug: 'demo-hotel' },
    update: {},
    create: {
      id: 'demo-hotel',
      slug: 'demo-hotel',
      name: 'The Grand HQSP Hotel',
    },
  });

  // Create Table
  const table = await prisma.table.upsert({
    where: { id: 'table-1' },
    update: {},
    create: {
      id: 'table-1',
      hotelId: hotel.id,
      name: 'Table 1',
    },
  });

  // Create Menu Category
  const category = await prisma.menuCategory.upsert({
    where: { id: 'cat-1' },
    update: {},
    create: {
      id: 'cat-1',
      hotelId: hotel.id,
      name: 'Main Course',
    },
  });

  // Create Menu Item
  const menuItem = await prisma.menuItem.upsert({
    where: { id: 'item-1' },
    update: {},
    create: {
      id: 'item-1',
      hotelId: hotel.id,
      categoryId: category.id,
      name: 'Spicy Chicken Curry',
      price: 450,
      isAvailable: true,
    },
  });

  console.log('Seeding complete! You can now test the API.');
  console.log(`Test with -> hotelId: "${hotel.id}", tableId: "${table.id}"`);
  console.log(`Order Item ID -> "${menuItem.id}"`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Need to disconnect the pg pool
  });
