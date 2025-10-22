import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Get the current authenticated admin user session
 * Returns null if not authenticated
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get the current authenticated admin user or redirect to login
 * Use this in server components that require authentication
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

/**
 * Check if the current user is a super admin
 */
export async function isSuperAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "SUPER_ADMIN";
}

/**
 * Require super admin access or redirect
 */
export async function requireSuperAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  return session;
}
