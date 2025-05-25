import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to create rooms for a hostel
async function createRoomsForHostel(hostel, floorData) {
  console.log(`Creating rooms for ${hostel.name}...`);
  let totalRooms = 0;

  for (const floor of floorData) {
    for (let roomNumber = floor.roomStart; roomNumber <= floor.roomEnd; roomNumber++) {
      try {
        await prisma.room.upsert({
          where: {
            room_number_hostelId: {
              roomNumber: roomNumber,
              hostelId: hostel.id
            }
          },
          update: {
            floor: floor.floor,
            capacity: floor.capacity,
            status: 'AVAILABLE',
            occupants: 0,
          },
          create: {
            roomNumber: roomNumber,
            floor: floor.floor,
            capacity: floor.capacity,
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

  // Read the JSON file
  const jsonData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/hostels.json'), 'utf-8')
  );

  console.log('Creating hostels...');
  
  for (const hostelData of jsonData.hostels) {
    console.log(`Processing hostel: ${hostelData.name}`);

    try {
      // Upsert hostel record (create or update)
      const hostel = await prisma.hostel.upsert({
        where: { name: hostelData.name },
        update: {
          type: hostelData.type,
          description: hostelData.description,
          accommodation: hostelData.accommodation,
        },
        create: {
          name: hostelData.name,
          type: hostelData.type,
          description: hostelData.description,
          accommodation: hostelData.accommodation,
        },
      });

      console.log(`Created/Updated hostel: ${hostel.name} with ID: ${hostel.id}`);

      // Create rooms for the current hostel
      await createRoomsForHostel(hostel, hostelData.rooms);

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
