const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const hostelsData = require('../public/data/hostels.json');

const prisma = new PrismaClient();

// Helper to create rooms for a hostel
async function createRoomsForHostel(hostel, floorRooms, numFloors, capacity) {
  console.log(`Creating rooms for ${hostel.name}...`);
  let totalRooms = 0;

  for (let floor = 0; floor < numFloors; floor++) {
    const numRooms = floorRooms[floor];
    for (let room = 1; room <= numRooms; room++) {
      const roomNumber = (floor + 1) * 100 + room;
      try {
        await prisma.room.upsert({
          where: {
            hostelId_roomNumber: {
              hostelId: hostel.id,
              roomNumber: roomNumber,
            },
          },
          update: {
            floor: floor + 1,
            capacity: capacity,
            status: 'AVAILABLE',
            occupants: 0,
          },
          create: {
            hostelId: hostel.id,
            roomNumber: roomNumber,
            floor: floor + 1,
            capacity: capacity,
            status: 'AVAILABLE',
            occupants: 0,
          },
        });
        totalRooms++;
      } catch (roomError) {
        console.error(`Error creating room ${roomNumber} in ${hostel.name}:`, roomError);
        throw roomError;
      }
    }
  }
  console.log(`Created/Updated ${totalRooms} rooms in ${hostel.name}`);
}

async function main() {
  console.log('Starting database seeding...');

  // Create hostels from JSON data
  for (const hostelData of hostelsData.hostels) {
    const hostel = await prisma.hostel.upsert({
      where: { name: hostelData.name },
      update: {
        name: hostelData.name,
        type: hostelData.type,
        description: hostelData.description,
        accommodation: hostelData.accommodation,
      },
      create: {
        name: hostelData.name,
        type: hostelData.type,
        description: hostelData.description,
        accommodation: hostelData.accommodation,
      }
    });
    console.log(`✅ Hostel upserted: ${hostel.name}`);

    // Create rooms for each hostel
    for (const roomData of hostelData.rooms) {
      await prisma.room.upsert({
        where: {
          room_number_hostelId: {
            room_number: roomData.room_number,
            hostelId: hostel.id
          }
        },
        update: {
          floor: roomData.floor,
          capacity: roomData.capacity,
          status: roomData.status.toUpperCase(),
          occupants: roomData.occupants,
        },
        create: {
          hostelId: hostel.id,
          room_number: roomData.room_number,
          floor: roomData.floor,
          capacity: roomData.capacity,
          status: roomData.status.toUpperCase(),
          occupants: roomData.occupants,
        }
      });
    }
    console.log(`✅ Rooms upserted for hostel: ${hostel.name}`);
  }

  // ✅ Add Admin User
  console.log('Creating admin user...');
  const hashedPassword = await bcrypt.hash('Chimidem@sso', 10);
  await prisma.user.upsert({
    where: { email: "chimidem.cst@rub.edu.bt" },
    update: {},
    create: {
      username: "Chimi Dem",
      email: "chimidem.cst@rub.edu.bt",
      password: hashedPassword,
      isAdmin: true,
    }
  });
  console.log('✅ Admin user seeded.');

  // ✅ Logging counts
  const hostelCount = await prisma.hostel.count();
  const roomCount = await prisma.room.count();
  const userCount = await prisma.user.count();
  console.log(`Seeding completed. Created ${hostelCount} hostels, ${roomCount} rooms, and ${userCount} users.`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
