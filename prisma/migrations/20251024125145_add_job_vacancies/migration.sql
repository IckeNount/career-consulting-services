-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'CONTRACT', 'SUBSTITUTE');

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "jobId" TEXT;

-- CreateTable
CREATE TABLE "job_vacancies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "salaryRange" TEXT,
    "requirements" TEXT NOT NULL,
    "jobType" "JobType" NOT NULL,
    "applicationDeadline" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_vacancies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_vacancies_isActive_idx" ON "job_vacancies"("isActive");

-- CreateIndex
CREATE INDEX "job_vacancies_jobType_idx" ON "job_vacancies"("jobType");

-- CreateIndex
CREATE INDEX "job_vacancies_createdAt_idx" ON "job_vacancies"("createdAt");

-- CreateIndex
CREATE INDEX "applications_jobId_idx" ON "applications"("jobId");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job_vacancies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
