import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function importHostels() {
  try {
    console.log('Starting hostel import...');

    // Read the JSON file
    const jsonPath = path.join(__dirname, '..', 'data', 'hostels.json');
    const data = JSON.parse(await fs.readFile(jsonPath, 'utf8'));

    // Process each hostel
    for (const hostelData of data.hostels) {
      console.log(`Processing hostel: ${hostelData.name}`);

      // Create or update the hostel
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

      // Process rooms for this hostel
      for (const roomConfig of hostelData.rooms) {
        console.log(`Processing rooms for floor ${roomConfig.floor}`);
        
        // Create rooms from roomStart to roomEnd
        for (let roomNum = roomConfig.roomStart; roomNum <= roomConfig.roomEnd; roomNum++) {
          try {
            await prisma.room.upsert({
              where: {
                room_number_hostelId: {
                  hostelId: hostel.id,
                  roomNumber: roomNum
                }
              },
              update: {
                floor: roomConfig.floor,
                capacity: roomConfig.capacity,
                status: 'AVAILABLE',
                occupants: 0
              },
              create: {
                hostelId: hostel.id,
                roomNumber: roomNum,
                floor: roomConfig.floor,
                capacity: roomConfig.capacity,
                status: 'AVAILABLE',
                occupants: 0
              }
            });
            console.log(`Created/Updated room ${roomNum} in ${hostel.name}`);
          } catch (roomError) {
            console.error(`Error creating room ${roomNum} in ${hostel.name}:`, roomError);
          }
        }
      }
    }

    // Print summary
    const hostelCount = await prisma.hostel.count();
    const roomCount = await prisma.room.count();
    console.log(`Import completed. Created/Updated ${hostelCount} hostels and ${roomCount} rooms.`);

  } catch (error) {
    console.error('Import error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importHostels(); 