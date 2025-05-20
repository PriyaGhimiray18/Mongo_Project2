// src/app/api/signup/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    console.log('Signup attempt started');
    const body = await request.json();
    console.log('Request body:', { ...body, password: '[REDACTED]' });

    const { username, email, password, studentId } = body;

    // Validate input
    if (!username || !email || !password || !studentId) {
      console.log('Missing fields:', { username: !!username, email: !!email, password: !!password, studentId: !!studentId });
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log('Checking for existing user with:', { email, studentId });
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { studentId }
        ]
      }
    });

    if (existingUser) {
      console.log('User already exists:', { 
        id: existingUser.id, 
        email: existingUser.email, 
        studentId: existingUser.studentId 
      });
      return NextResponse.json(
        { message: 'User with this email or student ID already exists' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    console.log('Creating new user');
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        studentId,
        isAdmin: false
      }
    });

    console.log('User created successfully:', { 
      id: user.id, 
      email: user.email, 
      studentId: user.studentId 
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Error creating user', error: error.message },
      { status: 500 }
    );
  }
}
