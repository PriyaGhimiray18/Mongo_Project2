import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        room: {
          include: {
            hostel: true,  // Include hostel details inside room
          },
        },
      },
      orderBy: {
        checkinDate: 'desc',
      },
    });

    return new Response(JSON.stringify(bookings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch bookings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
