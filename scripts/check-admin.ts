import prisma from "../lib/db/prisma";

async function checkAdmin() {
  try {
    console.log("Checking admin users...\n");

    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (admins.length === 0) {
      console.log("❌ No admin users found in database!");
      console.log("Run: npm run db:seed");
    } else {
      console.log(`✅ Found ${admins.length} admin user(s):\n`);
      admins.forEach((admin) => {
        console.log(`ID: ${admin.id}`);
        console.log(`Email: ${admin.email}`);
        console.log(`Name: ${admin.name}`);
        console.log(`Role: ${admin.role}`);
        console.log(`Active: ${admin.isActive}`);
        console.log("---");
      });
    }

    // Check blog posts
    const posts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        authorId: true,
      },
    });

    console.log(`\n📝 Found ${posts.length} blog post(s)`);
    if (posts.length > 0) {
      posts.forEach((post) => {
        console.log(`- ${post.title} (authorId: ${post.authorId || "NULL"})`);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
