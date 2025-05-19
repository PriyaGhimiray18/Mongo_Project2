import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  console.log('NODE_ENV:', process.env.NODE_ENV);
  try {
    const body = await request.json();
    const { loginInput, studentId, password } = body;
    const loginId = loginInput || studentId;

    if (!loginId || !password) {
      return NextResponse.json({ message: 'Login ID and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ studentId: loginId }, { username: loginId }, { email: loginId }],
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ message: 'JWT secret not set' }, { status: 500 });
    }

    const token = jwt.sign(
      {
        id: user.id,
        studentId: user.studentId,
        isAdmin: user.isAdmin,
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        studentId: user.studentId,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.isAdmin ? 'admin' : 'user',
      },
      session: {
        user: {
          id: user.id,
          name: user.username || user.studentId,
          email: user.email,
          isAdmin: user.isAdmin,
          role: user.isAdmin ? 'admin' : 'user',
        },
        expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour expiration
      },
    });

    // SET THE COOKIE: secure true only in prod, false in dev (localhost)
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // <--- this is the key line
      path: '/',
      maxAge: 60 * 60, // 1 hour in seconds
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
