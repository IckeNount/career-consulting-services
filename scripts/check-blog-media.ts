import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📊 Checking blog media...\n");

  const posts = await prisma.blogPost.findMany({
    include: {
      media: true,
    },
  });

  for (const post of posts) {
    console.log(`\n📝 ${post.title}`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   Media count: ${post.media.length}`);

    if (post.media.length > 0) {
      post.media.forEach((m, i) => {
        console.log(`   ${i + 1}. ${m.type} - ${m.caption}`);
      });
    }
  }

  console.log(`\n✅ Total posts: ${posts.length}`);
  console.log(
    `✅ Total media: ${posts.reduce((sum, p) => sum + p.media.length, 0)}`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
