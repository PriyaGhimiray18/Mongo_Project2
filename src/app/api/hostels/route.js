import prisma  from '@/lib/prisma';

// GET - Fetch all hostels with rooms
export async function GET() {
  try {
    const hostels = await prisma.hostel.findMany({
      orderBy: { name: 'asc' },
      include: { rooms: true }, // Make sure rooms are fetched too
    });

    return Response.json({ hostels });
  } catch (error) {
    console.error('Error fetching hostels:', error);
    return Response.json(
      { error: 'Failed to fetch hostels' },
      { status: 500 }
    );
  }
}

// POST - Add a new hostel
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, type, description, accommodation } = body;

    const newHostel = await prisma.hostel.create({
      data: {
        name,
        type,
        description,
        accommodation,
      }
    });

    return Response.json({ message: 'Hostel created', hostel: newHostel });
  } catch (error) {
    console.error('Error creating hostel:', error);
    return Response.json(
      { error: 'Failed to create hostel' },
      { status: 500 }
    );
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
