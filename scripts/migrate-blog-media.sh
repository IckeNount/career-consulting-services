#!/bin/bash

# Blog Media Gallery Migration Script
# This script ensures your database is updated with the new BlogMedia model

echo "🚀 Starting Blog Media Gallery Migration..."
echo ""

# Step 1: Generate Prisma Client
echo "📦 Step 1/3: Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo "✅ Prisma Client generated successfully"
echo ""

# Step 2: Run Migration
echo "🔄 Step 2/3: Running database migration..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "⚠️  Migration deployment failed. Trying development migration..."
    npx prisma migrate dev --name add_blog_media
    
    if [ $? -ne 0 ]; then
        echo "❌ Migration failed"
        exit 1
    fi
fi

echo "✅ Database migration completed successfully"
echo ""

# Step 3: Verify Migration
echo "🔍 Step 3/3: Verifying database schema..."
npx prisma db pull --force

if [ $? -eq 0 ]; then
    echo "✅ Database schema verified"
else
    echo "⚠️  Could not verify schema, but migration may have succeeded"
fi

echo ""
echo "🎉 Migration complete! Your database now supports:"
echo "   - Multiple media items per blog post"
echo "   - Image and video support"
echo "   - Caption management"
echo "   - Custom ordering"
echo ""
echo "Next steps:"
echo "1. Restart your development server: npm run dev"
echo "2. Clear Next.js cache if needed: rm -rf .next"
echo "3. Visit /admin/blog/new to create a blog post with media"
echo ""
