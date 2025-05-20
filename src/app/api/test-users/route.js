import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Create test user
    const testPassword = await bcrypt.hash('test123', 10);
    const testUser = await prisma.user.upsert({
      where: { email: "test@example.com" },
      update: {
        password: testPassword,
        studentId: "2024001",
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

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        studentId: true,
        username: true,
        isAdmin: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      message: "Test users created/updated successfully",
      users
    });
  } catch (error) {
    console.error('Error creating test users:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 