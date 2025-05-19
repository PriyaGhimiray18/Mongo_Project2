import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function importHostelData() {
  try {
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'hostels.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    // Import each hostel and its rooms
    for (const hostelData of jsonData.hostels) {
      // Create hostel
      const hostel = await prisma.hostel.create({
        data: {
          name: hostelData.name,
          type: hostelData.type,
          description: hostelData.description,
          accommodation: hostelData.accommodation,
        },
      });

      // Create rooms for this hostel
      const roomsData = hostelData.rooms.map((room: any) => ({
        roomNumber: room.room_number,
        floor: room.floor,
        capacity: room.capacity,
        status: room.status,
        occupants: room.occupants,
        hostelId: hostel.id,
      }));

      await prisma.room.createMany({
        data: roomsData,
      });

      console.log(`Imported ${hostelData.name} with ${roomsData.length} rooms`);
    }

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importHostelData(); 