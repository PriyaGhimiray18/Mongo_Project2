-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('AVAILABLE', 'PARTIALLY_BOOKED', 'FULLY_BOOKED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "studentId" TEXT,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hostel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "accommodation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hostel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "capacity" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "hostelId" TEXT NOT NULL,
    "occupants" INTEGER NOT NULL DEFAULT 0,
    "room_number" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "checkinDate" TIMESTAMP(3) NOT NULL,
    "numPeople" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "checkoutDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "studentId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_studentId_key" ON "User"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Hostel_name_key" ON "Hostel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Room_room_number_hostelId_key" ON "Room"("room_number", "hostelId");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_roomId_idx" ON "Booking"("roomId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
