import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    const dbStatus = await prisma.$queryRaw`SELECT 1`;
    
    // Get all users (excluding passwords)
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
      status: 'success',
      dbConnection: dbStatus ? 'connected' : 'failed',
      users: users
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
} 