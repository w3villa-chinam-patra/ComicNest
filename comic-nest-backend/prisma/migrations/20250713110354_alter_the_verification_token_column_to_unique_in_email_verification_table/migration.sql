/*
  Warnings:

  - A unique constraint covering the columns `[verificationToken]` on the table `EmailVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmailVerification_verificationToken_key" ON "EmailVerification"("verificationToken");
