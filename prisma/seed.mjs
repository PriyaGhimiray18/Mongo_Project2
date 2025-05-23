import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // ✨ make sure to install this via `npm install bcrypt`
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // ... (keep your existing hostel and room code as-is)

  // Create test user with student ID
  console.log('Creating test user...');
  const testPassword = await bcrypt.hash('cst1234', 10);

  await prisma.user.upsert({
    where: { email: "02230143.cst@rub.edu.bt" },
    update: {
      password: testPassword,
      studentId: "02230143",
      isAdmin: false
    },
    create: {
      username: "Test User",
      email: "test@example.com",
      studentId: "2024001",
      password: testPassword,
      isAdmin: false,
    }
  });

  console.log('✅ Test user seeded.');

  // Create admin user
  console.log('Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      password: adminPassword,
      studentId: "2024002",
      isAdmin: true
    },
    create: {
      username: "Admin User",
      email: "admin@example.com",
      studentId: "2024002",
      password: adminPassword,
      isAdmin: true,
    }
  });

  console.log('✅ Admin user seeded.');

  // Seed Hostel A
  const hostelA = await prisma.hostel.upsert({
    where: { name: 'Hostel A' },
    update: {},
    create: {
      name: 'Hostel A',
      type: 'BOYS',
      location: 'CST Campus',
      price_per_night: 100,
      available_rooms: 10,
      amenities: ['wifi', 'parking', 'ac'],
      image_url: '/img/hostelA.jpg',
    },
  });

  console.log('Hostel A seeded:', hostelA);

  // ✅ Logging counts
  const hostelCount = await prisma.hostel.count();
  const roomCount = await prisma.room.count();
  const userCount = await prisma.user.count();
  
  console.log(`Seeding completed. Created ${hostelCount} hostels, ${roomCount} rooms, and ${userCount} users.`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
