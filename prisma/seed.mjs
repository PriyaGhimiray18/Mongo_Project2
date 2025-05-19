import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create hostels
  const hostels = [
    {
      name: 'Hostel E',
      type: 'boys',
      description: "Boy's Hostel",
      accommodation: '2 floors'
    },
    {
      name: 'Hostel A',
      type: 'boys',
      description: "Boy's Hostel",
      accommodation: '3 floors'
    },
    {
      name: 'Hostel B',
      type: 'boys',
      description: "Boy's Hostel",
      accommodation: '3 floors'
    },
    {
      name: 'RKA',
      type: 'boys',
      description: "Boy's Hostel",
      accommodation: '4 floors'
    },
    {
      name: 'RKB',
      type: 'boys',
      description: "Boy's Hostel",
      accommodation: '4 floors'
    },
    {
      name: 'NK',
      type: 'boys',
      description: "Boy's Hostel",
      accommodation: '4 floors'
    },
    {
      name: 'Lhawang',
      type: 'boys',
      description: "Boy's Hostel",
      accommodation: '3 floors'
    },
    {
      name: 'Hostel F',
      type: 'girls',
      description: "Girl's Hostel",
      accommodation: '3 floors'
    },
    {
      name: 'Hostel C',
      type: 'girls',
      description: "Girl's Hostel",
      accommodation: '3 floors'
    },
    {
      name: 'Hostel D',
      type: 'girls',
      description: "Girl's Hostel",
      accommodation: '3 floors'
    }
  ];

  console.log('Creating hostels...');
  
  // Create hostels and their rooms
  for (const hostelData of hostels) {
    console.log(`Processing hostel: ${hostelData.name}`);
    
    try {
      const hostel = await prisma.hostel.upsert({
        where: { name: hostelData.name },
        update: hostelData,
        create: hostelData
      });

      console.log(`Created/Updated hostel: ${hostel.name} with ID: ${hostel.id}`);

      // Add rooms based on hostel type
      let floorRooms;
      let numFloors;
      let capacity;

      switch (hostel.name) {
        case 'Hostel E':
          floorRooms = [12, 20]; // 1st floor: 101-112, 2nd floor: 201-220
          numFloors = 2;
          capacity = 2;
          break;
        case 'Hostel A':
        case 'Hostel B':
          floorRooms = [13, 14, 14]; // 101-113, 201-214, 301-314
          numFloors = 3;
          capacity = 2;
          break;
        case 'RKA':
        case 'RKB':
          floorRooms = [12, 12, 12, 12]; // 101-112, 201-212, 301-312, 401-412
          numFloors = 4;
          capacity = 4;
          break;
        case 'NK':
          floorRooms = [8, 9, 9, 8]; // 101-108, 201-209, 301-309, 401-408
          numFloors = 4;
          capacity = 4;
          break;
        case 'Lhawang':
          floorRooms = [7, 7, 7]; // 101-107, 201-207, 301-307
          numFloors = 3;
          capacity = 4;
          break;
        case 'Hostel F':
          floorRooms = [23, 23, 23]; // 101-123, 201-223, 301-323
          numFloors = 3;
          capacity = 3;
          break;
        case 'Hostel C':
        case 'Hostel D':
          floorRooms = [13, 14, 14]; // 101-113, 201-214, 301-314
          numFloors = 3;
          capacity = 2;
          break;
        default:
          floorRooms = [13, 14, 14]; // Default configuration
          numFloors = 3;
          capacity = 2;
      }

      console.log(`Creating rooms for ${hostel.name}...`);

      // Create rooms for each floor
      for (let floor = 0; floor < numFloors; floor++) {
        const numRooms = floorRooms[floor];
        for (let room = 1; room <= numRooms; room++) {
          const roomNumber = (floor + 1) * 100 + room;
          try {
            await prisma.room.upsert({
              where: {
                room_number_hostelId: {
                  hostelId: hostel.id,
                  room_number: roomNumber
                }
              },
              update: {
                floor: floor + 1,
                capacity: capacity,
                status: 'AVAILABLE',
                occupants: 0
              },
              create: {
                hostelId: hostel.id,
                room_number: roomNumber,
                floor: floor + 1,
                capacity: capacity,
                status: 'AVAILABLE',
                occupants: 0
              }
            });
            console.log(`Created/Updated room ${roomNumber} in ${hostel.name}`);
          } catch (roomError) {
            console.error(`Error creating room ${roomNumber} in ${hostel.name}:`, roomError);
            throw roomError;
          }
        }
      }
    } catch (hostelError) {
      console.error(`Error processing hostel ${hostelData.name}:`, hostelError);
      throw hostelError;
    }
  }

  // Verify the data was created
  const hostelCount = await prisma.hostel.count();
  const roomCount = await prisma.room.count();
  
  console.log(`Seeding completed. Created ${hostelCount} hostels and ${roomCount} rooms.`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 