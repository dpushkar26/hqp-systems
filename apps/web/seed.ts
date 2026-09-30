import { prisma } from './src/lib/prisma';

async function main() {
  // Create a demo hotel
  const hotel = await prisma.hotel.upsert({
    where: { slug: 'hqsp-demo' },
    update: {},
    create: {
      id: 'hqsp-demo',
      slug: 'hqsp-demo',
      name: 'HQSP Demo Hotel',
    },
  });

  // Create tables
  const tables = [
    { id: 'table-1', name: 'Table 1' },
    { id: 'table-2', name: 'Table 2' },
    { id: 'table-3', name: 'Table 3' },
    { id: 'table-4', name: 'Table 4' },
    { id: 'table-5', name: 'Table 5' },
  ];

  for (const t of tables) {
    await prisma.table.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        hotelId: hotel.id,
        name: t.name,
      },
    });
  }

  // Create menu category
  let category = await prisma.menuCategory.findFirst({ where: { hotelId: hotel.id } });
  if (!category) {
    category = await prisma.menuCategory.create({
      data: {
        hotelId: hotel.id,
        name: 'Main Course',
      },
    });
  }

  // Create menu items
  const itemsCount = await prisma.menuItem.count({ where: { hotelId: hotel.id } });
  if (itemsCount === 0) {
    await prisma.menuItem.create({
      data: {
        hotelId: hotel.id,
        categoryId: category.id,
        name: 'Burger',
        price: 15.99,
        isAvailable: true,
      },
    });
    
    await prisma.menuItem.create({
      data: {
        hotelId: hotel.id,
        categoryId: category.id,
        name: 'Pizza',
        price: 20.00,
        isAvailable: true,
      },
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
