import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Adding missing linkedInUrl column...");

  await prisma.$executeRawUnsafe(
    `ALTER TABLE applications ADD COLUMN IF NOT EXISTS "linkedInUrl" TEXT;`
  );

  console.log("✓ Successfully added linkedInUrl column");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
