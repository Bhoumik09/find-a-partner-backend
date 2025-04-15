/*
  Warnings:

  - A unique constraint covering the columns `[name,phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_phoneNumber_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_name_phoneNumber_key" ON "User"("name", "phoneNumber");
