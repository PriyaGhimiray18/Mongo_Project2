import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hostel = searchParams.get('hostel');

    console.log('Received hostel parameter:', hostel);

    if (!hostel) {
      return new Response(
        JSON.stringify({ error: 'Hostel parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cleanHostelName = hostel.trim();
    console.log('Cleaned hostel name:', cleanHostelName);

    // First try: Exact match
    let hostelData = await prisma.hostel.findFirst({
      where: { name: cleanHostelName }
    });
    console.log('First try (exact match) result:', hostelData?.name);

    // Second try: Case-insensitive match
    if (!hostelData) {
      hostelData = await prisma.hostel.findFirst({
        where: {
          name: {
            equals: cleanHostelName,
            mode: 'insensitive'
          }
        }
      });
      console.log('Second try (case-insensitive) result:', hostelData?.name);
    }

    // Third try: Partial match
    if (!hostelData) {
      const searchTerm = cleanHostelName.replace('Hostel', '').trim();
      console.log('Third try search term:', searchTerm);
      hostelData = await prisma.hostel.findFirst({
        where: {
          name: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        }
      });
      console.log('Third try (partial match) result:', hostelData?.name);
    }

    if (!hostelData) {
      console.log('No hostel found after all attempts');
      return new Response(
        JSON.stringify({ error: 'Hostel not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const rooms = await prisma.room.findMany({
      where: {
        hostelId: hostelData.id
      },
      orderBy: {
        roomNumber: 'asc'
      },
      select: {
        id: true,
        roomNumber: true,
        floor: true,
        capacity: true,
        status: true,
        occupants: true
      }
    });

    console.log('Found rooms:', rooms.length);

    const transformedRooms = rooms.map((room) => {
      let computedStatus;

      if (room.status === 'MAINTENANCE') {
        computedStatus = 'MAINTENANCE';
      } else if (room.occupants === 0) {
        computedStatus = 'AVAILABLE';
      } else if (room.occupants < room.capacity) {
        computedStatus = 'PARTIALLY_BOOKED';
      } else {
        computedStatus = 'FULLY_BOOKED';
      }

      return {
        ...room,
        availableSpaces: room.capacity - room.occupants,
        status: computedStatus
      };
    });

    return new Response(
      JSON.stringify({
        hostel: hostelData.name,
        type: hostelData.type,
        rooms: transformedRooms
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('General error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error: ' + error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { hostelName, roomNumber, floor, capacity } = body;

    if (!hostelName || !roomNumber || !floor || !capacity) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find the hostel to get its ID
    const hostel = await prisma.hostel.findFirst({
      where: { name: hostelName.trim() },
    });

    if (!hostel) {
      return new Response(
        JSON.stringify({ error: 'Hostel not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the new room linked to the hostel
    const newRoom = await prisma.room.create({
      data: {
        hostelId: hostel.id,
        roomNumber,
        floor,
        capacity,
        occupants: 0,  // Initially empty room
        status: 'AVAILABLE', // Default status
      },
    });

    return new Response(
      JSON.stringify({ message: 'Room added successfully', room: newRoom }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error adding room:', error);
    return new Response(
      JSON.stringify({ error: 'Server error: ' + error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
