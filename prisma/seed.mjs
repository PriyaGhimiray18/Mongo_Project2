import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // ✨ make sure to install this via `npm install bcrypt`
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
            room_number_hostelId: {
              room_number: roomNumber,
              hostelId: hostel.id
            }
          },
          update: {
            floor: floor + 1,
            capacity: capacity,
            status: 'AVAILABLE',
            occupants: 0,
          },
          create: {
            room_number: roomNumber,
            floor: floor + 1,
            capacity: capacity,
            status: 'AVAILABLE',
            occupants: 0,
            hostelId: hostel.id
          }
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

  // Hostels data
  const hostels = [
    { name: 'Hostel E', type: 'girls', description: 'Girls hostel with modern amenities', accommodation: '2 floors' },
    { name: 'Hostel A', type: 'boys', description: 'Boys hostel with modern amenities', accommodation: '3 floors' },
    { name: 'Hostel B', type: 'boys', description: 'Boys hostel with modern amenities', accommodation: '3 floors' },
    { name: 'RKA', type: 'girls', description: 'Girls hostel with 4 people per room', accommodation: '4 floors' },
    { name: 'RKB', type: 'girls', description: 'Girls hostel with 4 people per room', accommodation: '4 floors' },
    { name: 'NK', type: 'girls', description: 'Girls hostel with 2 people per room', accommodation: '4 floors' },
    { name: 'Lhawang', type: 'boys', description: 'Boys hostel with 2 people per room', accommodation: '3 floors' },
  ];

  console.log('Creating hostels...');
  
  for (const hostelData of hostels) {
    console.log(`Processing hostel: ${hostelData.name}`);

    try {
      // Upsert hostel record (create or update)
      const hostel = await prisma.hostel.upsert({
        where: { name: hostelData.name },
        update: hostelData,
        create: hostelData,
      });

      console.log(`Created/Updated hostel: ${hostel.name} with ID: ${hostel.id}`);

      // Decide rooms per floor, floors count and capacity
      let floorRooms;
      let numFloors;
      let capacity;

      switch (hostel.name) {
        case 'Hostel E':
          floorRooms = [12, 20]; 
          numFloors = 2;
          capacity = 2;
          break;
        case 'Hostel A':
        case 'Hostel B':
          floorRooms = [13, 14, 14]; 
          numFloors = 3;
          capacity = 2;
          break;
        case 'RKA':
        case 'RKB':
          floorRooms = [12, 12, 12, 12]; 
          numFloors = 4;
          capacity = 4;
          break;
        case 'NK':
          floorRooms = [8, 9, 9, 8]; 
          numFloors = 4;
          capacity = 2;
          break;
        case 'Lhawang':
          floorRooms = [7, 7, 7]; 
          numFloors = 3;
          capacity = 2;
          break;
        default:
          floorRooms = [13, 14, 14]; 
          numFloors = 3;
          capacity = 2;
      }

      // Create rooms for the current hostel
      await createRoomsForHostel(hostel, floorRooms, numFloors, capacity);

    } catch (hostelError) {
      console.error(`Error processing hostel ${hostelData.name}:`, hostelError);
      throw hostelError;
    }
  }

  // Add Admin User
  console.log('Creating admin user...');

  const hashedPassword = await bcrypt.hash('Chimidem@sso', 10);

  await prisma.user.upsert({
    where: { email: "chimidem.cst@rub.edu.bt" },
    update: {},  // no changes on update
    create: {
      username: "Chimi Dem",
      email: "chimidem.cst@rub.edu.bt",
      password: hashedPassword,
      isAdmin: true,
    }
  });

  console.log('✅ Admin user seeded.');

  // Final count check
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
