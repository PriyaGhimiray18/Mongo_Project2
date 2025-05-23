import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import hostelsData from './data/hostels.json' assert { type: 'json' };

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create hostels from JSON data
  console.log('Creating hostels...');
  for (const hostelData of hostelsData.hostels) {
    const hostel = await prisma.hostel.upsert({
      where: { name: hostelData.name },
      update: {
        name: hostelData.name,
        location: hostelData.type === 'boys' ? 'North Campus' : 'South Campus',
        description: hostelData.description,
        capacity: hostelData.rooms.reduce((total, floor) => {
          const roomsInFloor = floor.roomEnd - floor.roomStart + 1;
          return total + (roomsInFloor * floor.capacity);
        }, 0),
        amenities: ["WiFi", "Laundry", "24/7 Security", "Study Room"],
        imageUrl: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      },
      create: {
        name: hostelData.name,
        location: hostelData.type === 'boys' ? 'North Campus' : 'South Campus',
        description: hostelData.description,
        capacity: hostelData.rooms.reduce((total, floor) => {
          const roomsInFloor = floor.roomEnd - floor.roomStart + 1;
          return total + (roomsInFloor * floor.capacity);
        }, 0),
        amenities: ["WiFi", "Laundry", "24/7 Security", "Study Room"],
        imageUrl: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      }
    });
    console.log(`✅ Hostel created: ${hostel.name}`);

    // Create rooms for each floor
    for (const floorData of hostelData.rooms) {
      for (let roomNum = floorData.roomStart; roomNum <= floorData.roomEnd; roomNum++) {
        const room = await prisma.room.upsert({
          where: {
            hostelId_roomNumber: {
              hostelId: hostel.id,
              roomNumber: roomNum.toString()
            }
          },
          update: {
            type: floorData.capacity === 2 ? "Double" : floorData.capacity === 3 ? "Triple" : "Quad",
            capacity: floorData.capacity,
            price: floorData.capacity === 2 ? 8000 : floorData.capacity === 3 ? 10000 : 12000,
            isAvailable: true
          },
          create: {
            hostelId: hostel.id,
            roomNumber: roomNum.toString(),
            type: floorData.capacity === 2 ? "Double" : floorData.capacity === 3 ? "Triple" : "Quad",
            capacity: floorData.capacity,
            price: floorData.capacity === 2 ? 8000 : floorData.capacity === 3 ? 10000 : 12000,
            isAvailable: true
          }
        });
        console.log(`✅ Room created: ${room.roomNumber} in ${hostel.name}`);
      }
    }
  }

  // ✅ Add Admin User
  console.log('Creating admin user...');

  const hashedPassword = await bcrypt.hash('Chimidem@sso', 10);

  await prisma.user.upsert({
    where: { email: "chimidem.cst@rub.edu.bt" },
    update: {},  // no changes on update
    create: {
      username: "Chimi Dem",  // required
      email: "chimidem.cst@rub.edu.bt",
      password: hashedPassword,
      isAdmin: true,  // mark as admin
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