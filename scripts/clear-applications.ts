import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Deleting all applications...");

  // Delete all applications (this will cascade delete related records)
  const deleted = await prisma.application.deleteMany({});

  console.log(`Deleted ${deleted.count} applications`);
  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
