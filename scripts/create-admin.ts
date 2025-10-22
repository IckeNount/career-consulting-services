/**
 * Script to create a new admin user
 * Usage: npm run create-admin
 */

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import * as readline from "readline";

const prisma = new PrismaClient();

type AdminRole = "ADMIN" | "SUPER_ADMIN";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createAdmin() {
  console.log("\n🔐 Create New Admin User\n");

  try {
    const email = await question("Email: ");
    const name = await question("Full Name: ");
    const password = await question("Password (min 8 chars): ");
    const roleInput = await question("Role (ADMIN/SUPER_ADMIN) [ADMIN]: ");

    // Validation
    if (!email || !email.includes("@")) {
      throw new Error("Invalid email address");
    }

    if (!name || name.length < 2) {
      throw new Error("Name must be at least 2 characters");
    }

    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    const role = (roleInput.toUpperCase() as AdminRole) || "ADMIN";
    if (!["ADMIN", "SUPER_ADMIN"].includes(role)) {
      throw new Error("Role must be ADMIN or SUPER_ADMIN");
    }

    // Check if user already exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error(`User with email ${email} already exists`);
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Create admin user
    const admin = await prisma.adminUser.create({
      data: {
        email,
        name,
        passwordHash,
        role,
        isActive: true,
      },
    });

    console.log("\n✅ Admin user created successfully!");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin.id}\n`);
  } catch (error) {
    console.error("\n❌ Error creating admin user:");
    if (error instanceof Error) {
      console.error(`   ${error.message}\n`);
    }
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();
