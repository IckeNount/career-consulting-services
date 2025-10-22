import { NextRequest } from "next/server";
import { apiResponse } from "@/lib/api/utils";
import prisma from "@/lib/db/prisma";

/**
 * GET /api/health
 * Public endpoint - Health check
 */
export async function GET(req: NextRequest) {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    return apiResponse({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      version: "1.0.0",
    });
  } catch (error) {
    return apiResponse(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
