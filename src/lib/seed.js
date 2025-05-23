import prisma from './prisma';
import bcrypt from 'bcryptjs';
import hostelsData from '../../data/hostels.json';

export async function seed() {
  try {
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

    // Create test user
    const userPassword = await bcrypt.hash('cst1234', 10);
    const user = await prisma.user.upsert({
      where: { studentId: "02230143" },
      update: {
        password: userPassword,
        email: "02230143@example.com",
        isAdmin: false
      },
      create: {
        username: "User 02230143",
        email: "02230143@example.com",
        studentId: "02230143",
        password: userPassword,
        isAdmin: false,
      }
    });

    console.log('✅ User seeded:', user.studentId);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {
        password: adminPassword,
        studentId: "2024002",
        isAdmin: true
      },
      create: {
        username: "Admin User",
        email: "admin@example.com",
        studentId: "2024002",
        password: adminPassword,
        isAdmin: true,
      }
    });

    console.log('✅ Admin user seeded:', adminUser.email);

    return { user, adminUser };
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
} 