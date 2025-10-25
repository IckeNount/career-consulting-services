/*
  Warnings:

  - You are about to drop the column `coverLetterUrl` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `currentLocation` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `currentSalary` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `desiredCountry` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `desiredPosition` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `expectedSalary` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `linkedInUrl` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `portfolioUrl` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `yearsExperience` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the `languages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `englishLevel` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languages` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maritalStatus` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motivation` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralSource` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `religion` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `residence` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `educationLevel` on the `applications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."languages" DROP CONSTRAINT "languages_applicationId_fkey";

-- DropIndex
DROP INDEX "public"."applications_desiredCountry_idx";

-- AlterTable
ALTER TABLE "applications" DROP COLUMN "coverLetterUrl",
DROP COLUMN "currentLocation",
DROP COLUMN "currentSalary",
DROP COLUMN "dateOfBirth",
DROP COLUMN "desiredCountry",
DROP COLUMN "desiredPosition",
DROP COLUMN "expectedSalary",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "linkedInUrl",
DROP COLUMN "notes",
DROP COLUMN "portfolioUrl",
DROP COLUMN "resumeUrl",
DROP COLUMN "yearsExperience",
ADD COLUMN     "consent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "diplomaFile" TEXT,
ADD COLUMN     "englishLevel" TEXT NOT NULL,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "hasExperience" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasPassport" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "languages" TEXT NOT NULL,
ADD COLUMN     "maritalStatus" TEXT NOT NULL,
ADD COLUMN     "motivation" TEXT NOT NULL,
ADD COLUMN     "passportNumber" TEXT,
ADD COLUMN     "referralSource" TEXT NOT NULL,
ADD COLUMN     "religion" TEXT NOT NULL,
ADD COLUMN     "residence" TEXT NOT NULL,
ADD COLUMN     "resumeFile" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "torFile" TEXT,
DROP COLUMN "educationLevel",
ADD COLUMN     "educationLevel" TEXT NOT NULL,
ALTER COLUMN "skills" DROP NOT NULL,
ALTER COLUMN "skills" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "public"."languages";

-- CreateIndex
CREATE INDEX "applications_residence_idx" ON "applications"("residence");
