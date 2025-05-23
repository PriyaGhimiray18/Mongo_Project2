import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting to create admin user...');
    console.log('Database URL:', process.env.DATABASE_URL);

    // Hash the password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash('Chimidem@sso', 10);
    console.log('Password hashed successfully');

    // Create the admin user
    console.log('Creating/updating admin user...');
    const adminUser = await prisma.user.upsert({
      where: { email: 'chimidem@cst.rub.edu.bt' },
      update: {
        username: 'Chimi Dem',
        password: hashedPassword,
        isAdmin: true
      },
      create: {
        username: 'Chimi Dem',
        email: 'chimidem@cst.rub.edu.bt',
        password: hashedPassword,
        isAdmin: true
      }
    });

    console.log('Admin user created/updated successfully:', {
      id: adminUser.id,
      email: adminUser.email,
      username: adminUser.username,
      isAdmin: adminUser.isAdmin
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
    console.error('Error details:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main(); 