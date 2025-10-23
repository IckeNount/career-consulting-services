/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `applications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "applications_email_key" ON "applications"("email");
