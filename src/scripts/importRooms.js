import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importHostelsAndRooms() {
  try {
    // Load JSON file
    const jsonPath = path.resolve('public/data/hostels.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonData);

    if (!Array.isArray(data.hostels)) {
      throw new Error('Invalid JSON structure: "hostels" key not found or is not an array');
    }

    // Import hostels
    for (const hostel of data.hostels) {
      // Upsert hostel to avoid duplicates
      await prisma.hostel.upsert({
        where: { id: hostel.id },
        update: {
          name: hostel.name,
          type: hostel.type,
          description: hostel.description,
          accommodation: hostel.accommodation,
        },
        create: {
          id: hostel.id,
          name: hostel.name,
          type: hostel.type,
          description: hostel.description,
          accommodation: hostel.accommodation,
        },
      });

      // Import rooms for this hostel
      for (const room of hostel.rooms) {
        // Upsert room to avoid duplicates
        await prisma.room.upsert({
          where: {
            // Assuming room_number + hostelId is unique
            room_number_hostelId: {
              room_number: room.room_number,
              hostelId: hostel.id,
            },
          },
          update: {
            floor: room.floor,
            capacity: room.capacity,
            status: room.status,
            occupants: room.occupants,
          },
          create: {
            room_number: room.room_number,
            floor: room.floor,
            capacity: room.capacity,
            status: room.status,
            occupants: room.occupants,
            hostelId: hostel.id,
          },
        });
      }
    }

    console.log('Hostels and rooms imported successfully!');
  } catch (error) {
    console.error('Error importing hostels and rooms:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import function
importHostelsAndRooms();
