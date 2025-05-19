import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // ensure prisma is the default export

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        room: {
          select: {
            roomNumber: true,
            hostel: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      studentName: booking.studentName || booking.user?.username || 'N/A',
      studentID: booking.studentId || 'N/A',
      department: booking.department || 'N/A',
      email: booking.email || booking.user?.email || 'N/A',
      phone: booking.phone || 'N/A',
      hostelName: booking.room?.hostel?.name || 'N/A',
      roomNumber: booking.room?.roomNumber?.toString() || 'N/A',
      checkinDate: booking.checkinDate,
      numPeople: booking.numPeople || 0,
      status: booking.status || 'N/A',
    }));

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
