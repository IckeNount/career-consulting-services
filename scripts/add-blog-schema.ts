import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Adding blog_posts table and enums...");

  // Create BlogCategory enum
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      CREATE TYPE "BlogCategory" AS ENUM ('TEACHING', 'VISAS', 'RELOCATION', 'CAREER_TIPS', 'INTERVIEWS', 'CULTURE');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // Create BlogStatus enum
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // Create blog_posts table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "blog_posts" (
      "id" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "excerpt" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "coverImage" TEXT NOT NULL,
      "category" "BlogCategory" NOT NULL,
      "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',
      "author" TEXT NOT NULL DEFAULT 'KTECCS Team',
      "readTime" TEXT NOT NULL DEFAULT '5 min read',
      "views" INTEGER NOT NULL DEFAULT 0,
      "metaTitle" TEXT,
      "metaDescription" TEXT,
      "publishedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      "authorId" TEXT,

      CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
    );
  `);

  // Create unique constraint on slug
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_slug_key" UNIQUE ("slug");
    EXCEPTION
      WHEN duplicate_table THEN null;
    END $$;
  `);

  // Create indexes
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "blog_posts_slug_idx" ON "blog_posts"("slug");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "blog_posts_status_idx" ON "blog_posts"("status");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "blog_posts_category_idx" ON "blog_posts"("category");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "blog_posts_publishedAt_idx" ON "blog_posts"("publishedAt");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "blog_posts_createdAt_idx" ON "blog_posts"("createdAt");
  `);

  // Add foreign key constraint to admin_users
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_authorId_fkey" 
      FOREIGN KEY ("authorId") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  console.log("✓ Successfully created blog_posts table and related structures");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
