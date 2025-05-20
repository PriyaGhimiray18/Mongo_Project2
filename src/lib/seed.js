import prisma from './prisma';
import bcrypt from 'bcryptjs';

export async function seed() {
  try {
    console.log('Starting database seeding...');

    // Create user with specific credentials
    const userPassword = await bcrypt.hash('cst1234', 10);
    const user = await prisma.user.upsert({
      where: { studentId: "02230143" },
      update: {
        password: userPassword,
        email: "02230143@example.com",
        isAdmin: false
      },
      create: {
        username: "User 02230143",
        email: "02230143@example.com",
        studentId: "02230143",
        password: userPassword,
        isAdmin: false,
      }
    });

    console.log('✅ User seeded:', user.studentId);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
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

    console.log('✅ Admin user seeded:', adminUser.email);

    return { user, adminUser };
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
} 