#!/usr/bin/env tsx
/**
 * Cleanup Orphaned Files Script
 *
 * This script scans the public/uploads directory and identifies files
 * that are not referenced in the database, then optionally removes them.
 *
 * Usage:
 *   npx tsx scripts/cleanup-orphaned-files.ts --dry-run   # Preview only
 *   npx tsx scripts/cleanup-orphaned-files.ts --delete    # Actually delete files
 */

import { readdir } from "fs/promises";
import { join } from "path";
import prisma from "../lib/db/prisma";
import { deleteFile } from "../lib/utils/file-cleanup";

interface OrphanedFile {
  path: string;
  fileName: string;
  sizeKB?: number;
}

async function getAllFilesInDirectory(dir: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip certain directories
        if (entry.name === ".DS_Store" || entry.name === "team") {
          continue;
        }
        // Recursively get files from subdirectories
        const subFiles = await getAllFilesInDirectory(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        // Skip system files
        if (entry.name === ".DS_Store" || entry.name === ".gitkeep") {
          continue;
        }
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return files;
}

async function findOrphanedFiles(dryRun: boolean = true): Promise<void> {
  console.log("🔍 Scanning for orphaned files...\n");

  const uploadsDir = join(process.cwd(), "public", "uploads");
  const allFiles = await getAllFilesInDirectory(uploadsDir);

  console.log(`Found ${allFiles.length} total files in uploads directory\n`);

  // Fetch all file references from database
  console.log("📊 Fetching file references from database...");

  const [blogPosts, blogMedia, applications] = await Promise.all([
    prisma.blogPost.findMany({
      select: { coverImage: true },
    }),
    prisma.blogMedia.findMany({
      select: { url: true },
    }),
    prisma.application.findMany({
      select: { resumeFile: true, diplomaFile: true, torFile: true },
    }),
  ]);

  // Build set of referenced file paths
  const referencedFiles = new Set<string>();

  // Add blog cover images
  blogPosts.forEach((post) => {
    if (post.coverImage) {
      const normalizedPath = post.coverImage.replace(/^\//, "");
      const fullPath = join(process.cwd(), "public", normalizedPath);
      referencedFiles.add(fullPath);
    }
  });

  // Add blog media files
  blogMedia.forEach((media) => {
    if (media.url) {
      const normalizedPath = media.url.replace(/^\//, "");
      const fullPath = join(process.cwd(), "public", normalizedPath);
      referencedFiles.add(fullPath);
    }
  });

  // Add application files
  applications.forEach((app) => {
    [app.resumeFile, app.diplomaFile, app.torFile].forEach((file) => {
      if (file) {
        const normalizedPath = file.replace(/^\//, "");
        const fullPath = join(process.cwd(), "public", normalizedPath);
        referencedFiles.add(fullPath);
      }
    });
  });

  console.log(`Found ${referencedFiles.size} files referenced in database\n`);

  // Find orphaned files
  const orphanedFiles: OrphanedFile[] = [];

  for (const filePath of allFiles) {
    if (!referencedFiles.has(filePath)) {
      orphanedFiles.push({
        path: filePath,
        fileName: filePath.replace(uploadsDir, "").replace(/^\//, ""),
      });
    }
  }

  // Display results
  console.log("=".repeat(60));
  console.log(`📋 ORPHANED FILES REPORT`);
  console.log("=".repeat(60));
  console.log(`Total files in uploads: ${allFiles.length}`);
  console.log(`Files referenced in DB: ${referencedFiles.size}`);
  console.log(`Orphaned files found: ${orphanedFiles.length}`);
  console.log("=".repeat(60));

  if (orphanedFiles.length === 0) {
    console.log("\n✅ No orphaned files found! Your storage is clean.");
    return;
  }

  console.log("\n🗑️  Orphaned Files:\n");
  orphanedFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file.fileName}`);
  });

  if (dryRun) {
    console.log("\n⚠️  DRY RUN MODE - No files were deleted");
    console.log("To actually delete these files, run:");
    console.log("  npx tsx scripts/cleanup-orphaned-files.ts --delete\n");
  } else {
    console.log("\n🗑️  DELETING FILES...\n");

    let successCount = 0;
    let failCount = 0;

    for (const file of orphanedFiles) {
      const deleted = await deleteFile(file.path);
      if (deleted) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`✅ Deletion Complete:`);
    console.log(`   Successfully deleted: ${successCount} files`);
    console.log(`   Failed to delete: ${failCount} files`);
    console.log("=".repeat(60) + "\n");
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = !args.includes("--delete");

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Cleanup Orphaned Files Script

Usage:
  npx tsx scripts/cleanup-orphaned-files.ts [OPTIONS]

Options:
  --dry-run     Preview orphaned files without deleting (default)
  --delete      Actually delete the orphaned files
  --help, -h    Show this help message

Examples:
  npx tsx scripts/cleanup-orphaned-files.ts
  npx tsx scripts/cleanup-orphaned-files.ts --dry-run
  npx tsx scripts/cleanup-orphaned-files.ts --delete
`);
  process.exit(0);
}

// Run the script
findOrphanedFiles(isDryRun)
  .then(() => {
    console.log("Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
