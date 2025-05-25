import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hostel = searchParams.get('hostel');

    // If no specific hostel is requested, return all hostels
    if (!hostel) {
      const allHostels = await prisma.hostel.findMany({
        include: {
          rooms: true
        }
      });
      return new Response(JSON.stringify(allHostels), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('🔍 Received hostel param:', hostel);

    if (!hostel) {
      return new Response(JSON.stringify({ error: 'Hostel parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const cleanHostelName = hostel.trim();
    console.log('🧼 Cleaned hostel name:', cleanHostelName);

    let hostelData;

    // 1️⃣ Exact match (case-sensitive)
    hostelData = await prisma.hostel.findFirst({
      where: { name: cleanHostelName }
    });

    console.log('🟡 Exact match result:', hostelData?.name);

    // 2️⃣ Case-insensitive match
    if (!hostelData) {
      hostelData = await prisma.hostel.findFirst({
        where: {
          name: {
            equals: cleanHostelName,
            mode: 'insensitive'
          }
        }
      });
      console.log('🟠 Case-insensitive match result:', hostelData?.name);
    }

    // 3️⃣ Partial match if nothing found
    if (!hostelData) {
      const partialTerm = cleanHostelName.replace(/hostel/i, '').trim();
      console.log('🔎 Trying partial match with:', partialTerm);

      hostelData = await prisma.hostel.findFirst({
        where: {
          name: {
            contains: partialTerm,
            mode: 'insensitive'
          }
        }
      });
      console.log('🔵 Partial match result:', hostelData?.name);
    }

    // 🔴 No match found
    if (!hostelData) {
      const allHostels = await prisma.hostel.findMany({ select: { name: true } });
      return new Response(JSON.stringify({
        error: 'Hostel not found',
        availableHostels: allHostels.map(h => h.name)
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ✅ Found the hostel — get its rooms
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

    const transformedRooms = rooms.map(room => {
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

    return new Response(JSON.stringify({
      hostel: hostelData.name,
      type: hostelData.type,
      rooms: transformedRooms
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('🔥 GET /api/room error:', error);
    return new Response(JSON.stringify({ error: 'Server error: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


// PUT - Update rooms for a hostel
export async function PUT(request) {
  try {
    const body = await request.json();
    const { hostelId, rooms } = body;

    if (!hostelId || !Array.isArray(rooms)) {
      return Response.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Delete all existing rooms for this hostel
    await prisma.room.deleteMany({
      where: {
        hostelId: hostelId,
      }
    });

    // Add new rooms with the hostelId attached
    const createRooms = rooms.map(room => ({
      roomNumber: Number(room.roomNumber),
      floor: room.floor,
      capacity: room.capacity,
      status: room.status,
      occupants: room.occupants,
      hostelId: hostelId,
    }));

    await prisma.room.createMany({
      data: createRooms,
    });

    return Response.json({ message: 'Rooms updated successfully' });
  } catch (error) {
    console.error('Error updating rooms:', error);
    return Response.json(
      { error: 'Failed to update rooms' },
      { status: 500 }
    );
  }
}

// POST - Create a new hostel
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('📝 Received POST request body:', body);
    const { name, type, description, accommodation } = body;

    // Validate required fields
    if (!name || !type || !description || !accommodation) {
      console.log('❌ Missing fields:', {
        name: !name,
        type: !type,
        description: !description,
        accommodation: !accommodation
      });
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if hostel with same name already exists
    const existingHostel = await prisma.hostel.findUnique({
      where: { name }
    });

    if (existingHostel) {
      return Response.json(
        { error: 'A hostel with this name already exists' },
        { status: 400 }
      );
    }

    // Create the new hostel
    const hostel = await prisma.hostel.create({
      data: {
        name,
        type,
        description,
        accommodation
      }
    });

    return Response.json(hostel, { status: 201 });
  } catch (error) {
    console.error('Error creating hostel:', error);
    return Response.json(
      { error: 'Failed to create hostel' },
      { status: 500 }
    );
  }
}
// DELETE - Delete hostel by ID (including its rooms)
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (!id) {
      return Response.json({ error: 'Missing hostel ID' }, { status: 400 });
    }

    // Delete all related rooms first
    await prisma.room.deleteMany({
      where: { hostelId: Number(id) },
    });

    // Then delete the hostel
    await prisma.hostel.delete({
      where: { id: Number(id) },
    });

    return Response.json({ message: 'Hostel deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('❌ DELETE /api/hostels error:', error);
    return Response.json({ error: 'Failed to delete hostel' }, { status: 500 });
  }
}