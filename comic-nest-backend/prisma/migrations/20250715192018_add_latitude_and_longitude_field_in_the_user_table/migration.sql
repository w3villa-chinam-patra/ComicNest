/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `OTPVerification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `OTPVerification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OTPVerification" ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "OTPVerification_userId_key" ON "OTPVerification"("userId");
