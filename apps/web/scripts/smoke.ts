import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_X8Zlwz5LhtHQ@ep-blue-dawn-b5737c3c.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
  const { prisma } = await import('../src/server/db/prisma');
  console.log('Connecting to Neon DB...');
  
  // 1. Create a dummy hotel
  const hotel = await prisma.hotel.create({
    data: {
      slug: 'smoke-test-hotel-' + Date.now(),
      name: 'Smoke Test Hotel',
      gstRateBp: 500,
    }
  });
  console.log('✅ Created Hotel:', hotel.id);

  // 2. Query it back
  const retrieved = await prisma.hotel.findUnique({
    where: { id: hotel.id }
  });
  console.log('✅ Retrieved Hotel:', retrieved?.name);

  // 3. Clean up
  await prisma.hotel.delete({
    where: { id: hotel.id }
  });
  console.log('✅ Cleaned up Hotel.');
  
  console.log('🎉 Neon DB connection and Prisma schema are fully verified!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    const { prisma } = await import('../src/server/db/prisma');
    await prisma.$disconnect();
  });
