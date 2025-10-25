import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📊 Checking job vacancies...\n");

  const jobs = await prisma.jobVacancy.findMany({
    include: {
      _count: {
        select: { applications: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(`✅ Total jobs found: ${jobs.length}\n`);

  jobs.forEach((job, index) => {
    console.log(`${index + 1}. ${job.title}`);
    console.log(`   Company: ${job.companyName}`);
    console.log(`   Location: ${job.location}`);
    console.log(`   Type: ${job.jobType}`);
    console.log(`   Salary: ${job.salaryRange}`);
    console.log(`   Status: ${job.isActive ? "✅ Active" : "❌ Inactive"}`);
    console.log(`   Applications: ${job._count.applications}`);
    console.log(
      `   Deadline: ${job.applicationDeadline?.toLocaleDateString()}`
    );
    console.log();
  });
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
