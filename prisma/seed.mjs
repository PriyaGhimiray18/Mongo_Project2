import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // ✨ make sure to install this via `npm install bcrypt`
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // ... (keep your existing hostel and room code as-is)

  // ✅ Add Admin User
  console.log('Creating admin user...');

  const hashedPassword = await bcrypt.hash('Chimidem@sso', 10); // change password if needed

  await prisma.user.upsert({
  where: { email: "chimidem.cst@rub.edu.bt" },
  update: {},  // no changes on update
  create: {
    username: "Chimi Dem",  // required
    email: "chimidem.cst@rub.edu.bt",
    password: hashedPassword, // your bcrypt hashed pass
    isAdmin: true,  // mark as admin
  }
});

  console.log('✅ Admin user seeded.');

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
