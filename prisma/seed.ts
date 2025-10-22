import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create initial admin user
  const hashedPassword = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: hashedPassword,
      name: "System Administrator",
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.log("✅ Created admin user:", admin.email);

  // Create sample applications (optional)
  const sampleApplications = await Promise.all([
    prisma.application.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        dateOfBirth: new Date("1990-01-15"),
        nationality: "United States",
        currentLocation: "New York, USA",
        desiredCountry: "Germany",
        desiredPosition: "Software Engineer",
        yearsExperience: 5,
        expectedSalary: 80000,
        educationLevel: "BACHELOR",
        resumeUrl: "https://example.com/resume.pdf",
        skills: ["JavaScript", "React", "Node.js", "TypeScript"],
        languages: {
          create: [
            { language: "English", proficiency: "NATIVE" },
            { language: "German", proficiency: "INTERMEDIATE" },
          ],
        },
        statusHistory: {
          create: {
            status: "PENDING",
            changedBy: "SYSTEM",
            notes: "Application submitted",
          },
        },
      },
    }),
    prisma.application.create({
      data: {
        firstName: "Maria",
        lastName: "Garcia",
        email: "maria.garcia@example.com",
        phone: "+34123456789",
        dateOfBirth: new Date("1992-05-20"),
        nationality: "Spain",
        currentLocation: "Madrid, Spain",
        desiredCountry: "Canada",
        desiredPosition: "Data Analyst",
        yearsExperience: 3,
        currentSalary: 35000,
        expectedSalary: 60000,
        educationLevel: "MASTER",
        resumeUrl: "https://example.com/resume2.pdf",
        coverLetterUrl: "https://example.com/cover2.pdf",
        skills: ["Python", "SQL", "Power BI", "Statistics"],
        languages: {
          create: [
            { language: "Spanish", proficiency: "NATIVE" },
            { language: "English", proficiency: "ADVANCED" },
            { language: "French", proficiency: "BASIC" },
          ],
        },
        statusHistory: {
          create: {
            status: "REVIEWING",
            changedBy: admin.id,
            notes: "Under review",
          },
        },
        reviewedBy: admin.id,
      },
    }),
  ]);

  console.log(`✅ Created ${sampleApplications.length} sample applications`);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
