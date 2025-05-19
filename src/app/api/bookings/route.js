import { NextResponse } from 'next/server';
import prisma  from '@/lib/prisma'; // double-check your prisma import

export async function POST(request) {
  try {
    const bookingData = await request.json();

    console.log('Received booking data:', bookingData);

    if (!bookingData.userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find hostel by name
    const hostel = await prisma.hostel.findFirst({
      where: { name: bookingData.hostelName }
    });

    if (!hostel) {
      return new Response(
        JSON.stringify({ error: 'Hostel not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find room by hostelId and roomNumber
    const room = await prisma.room.findFirst({
      where: {
        hostelId: hostel.id,
        roomNumber: parseInt(bookingData.roomNumber, 10)
      }
    });

    if (!room) {
      return new Response(
        JSON.stringify({ error: 'Room not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Split multiline strings into arrays
    const studentNames = bookingData.studentName.split('\n').map(s => s.trim()).filter(Boolean);
    const studentIds = bookingData.studentId.split('\n').map(s => s.trim()).filter(Boolean);
    const departments = bookingData.department.split('\n').map(s => s.trim()).filter(Boolean);

    const numPeople = studentNames.length;

    if (numPeople !== studentIds.length || numPeople !== departments.length) {
      return new Response(
        JSON.stringify({ error: 'Mismatch in number of students\' details' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check capacity
    if (room.occupants + numPeople > room.capacity) {
      return new Response(
        JSON.stringify({ error: `Room capacity exceeded. Max allowed: ${room.capacity}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if any student is already booked in any room
    for (const sid of studentIds) {
      const existingBooking = await prisma.booking.findFirst({
        where: { studentId: sid }
      });
      if (existingBooking) {
        return new Response(
          JSON.stringify({ error: `Student with ID ${sid} is already booked in another room` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create bookings transactionally
    const bookings = await prisma.$transaction(
      studentNames.map((name, index) => {
        return prisma.booking.create({
          data: {
            studentName: name,
            studentId: studentIds[index],
            department: departments[index],
            checkinDate: new Date(bookingData.checkinDate),
            numPeople: 1,
            email: bookingData.email,
            phone: bookingData.phone,
            status: 'CONFIRMED',  // Confirmed booking
            roomId: room.id,
            userId: bookingData.userId
          }
        });
      })
    );

    // Update room occupants and status
    const updatedOccupants = room.occupants + numPeople;

    // Determine new room status based on occupants
    let newStatus = 'AVAILABLE';
    if (updatedOccupants === 0) {
      newStatus = 'AVAILABLE';
    } else if (updatedOccupants < room.capacity) {
      newStatus = 'PARTIALLY_BOOKED';
    } else if (updatedOccupants === room.capacity) {
      newStatus = 'FULLY_BOOKED';
    }

    const updatedRoom = await prisma.room.update({
      where: { id: room.id },
      data: {
        occupants: updatedOccupants,
        status: newStatus
      }
    });

    return new Response(
      JSON.stringify({
        message: 'Booking successful',
        bookings,
        room: updatedRoom
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating bookings:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create bookings', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
