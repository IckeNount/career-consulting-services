import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient() as any; // Type workaround for seed script

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
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        nationality: "United States",
        residence: "New York, USA",
        religion: "Christian",
        maritalStatus: "Single",
        hasPassport: true,
        passportNumber: "US123456789",
        startDate: new Date("2025-03-01"),
        educationLevel: "Bachelor's Degree",
        skills: "JavaScript, React, Node.js, TypeScript",
        languages: "English, German",
        englishLevel: "Native",
        hasExperience: true,
        experience: "5 years of software development experience",
        motivation:
          "Seeking opportunities to work abroad and expand my technical skills.",
        referralSource: "LinkedIn",
        consent: true,
        statusHistory: {
          create: {
            status: "PENDING",
            notes: "Application submitted",
          },
        },
      },
    }),
    prisma.application.create({
      data: {
        fullName: "Maria Garcia",
        email: "maria.garcia@example.com",
        phone: "+34123456789",
        nationality: "Spain",
        residence: "Madrid, Spain",
        religion: "Catholic",
        maritalStatus: "Married",
        hasPassport: true,
        passportNumber: "ES987654321",
        startDate: new Date("2025-04-01"),
        educationLevel: "Master's Degree",
        skills: "Python, SQL, Power BI, Statistics",
        languages: "Spanish, English, French",
        englishLevel: "Advanced",
        hasExperience: true,
        experience: "3 years of data analysis experience",
        motivation:
          "Looking to advance my career in data analytics internationally.",
        referralSource: "Job Board",
        consent: true,
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
