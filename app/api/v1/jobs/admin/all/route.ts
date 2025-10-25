import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Type assertion to help VS Code IntelliSense
const db = prisma as any;

// GET /api/v1/jobs/admin/all - Admin endpoint to get all jobs (including inactive)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Verify user is admin
    const admin = await prisma.adminUser.findUnique({
      where: { email: session.user.email },
    });

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        { status: 403 }
      );
    }

    const jobs = await db.jobVacancy.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch job vacancies",
      },
      { status: 500 }
    );
  }
}
