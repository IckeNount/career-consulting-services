import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Making expectedSalary nullable...");

  await prisma.$executeRawUnsafe(
    `ALTER TABLE applications ALTER COLUMN "expectedSalary" DROP NOT NULL;`
  );

  console.log("✓ Successfully made expectedSalary nullable");

  // Also fix the EducationLevel enum if needed
  console.log("Updating EducationLevel enum...");
  await prisma.$executeRawUnsafe(`
    ALTER TYPE "EducationLevel" RENAME VALUE 'DOCTORATE' TO 'PHD';
  `);
  console.log("✓ Successfully updated EducationLevel enum");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
