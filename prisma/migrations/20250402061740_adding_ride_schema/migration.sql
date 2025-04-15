-- CreateEnum
CREATE TYPE "genderPreference" AS ENUM ('male', 'female', 'both');

-- CreateTable
CREATE TABLE "Places" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rides" (
    "id" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "vehicle" TEXT NOT NULL,
    "numberOfSeats" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "genderPreference" "genderPreference" NOT NULL,
    "additionalInfo" TEXT,
    "meetingPoints" TEXT[],
    "allowInAppChat" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Rides_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rides" ADD CONSTRAINT "Rides_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rides" ADD CONSTRAINT "Rides_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rides" ADD CONSTRAINT "Rides_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
