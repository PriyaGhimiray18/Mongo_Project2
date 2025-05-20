import { NextResponse } from 'next/server';
import { seed } from '@/lib/seed';

export async function GET() {
  try {
    const result = await seed();
    return NextResponse.json({
      status: 'success',
      message: 'Database seeded successfully',
      users: {
        user: { studentId: result.user.studentId, email: result.user.email },
        admin: { email: result.adminUser.email, studentId: result.adminUser.studentId }
      }
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 