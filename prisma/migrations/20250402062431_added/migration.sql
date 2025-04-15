-- DropForeignKey
ALTER TABLE "Rides" DROP CONSTRAINT "Rides_userId_fkey";

-- AddForeignKey
ALTER TABLE "Rides" ADD CONSTRAINT "Rides_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
