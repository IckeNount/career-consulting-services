import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Type assertion to help VS Code IntelliSense
const db = prisma as any;

// GET /api/v1/jobs - Public endpoint to list active jobs
export async function GET(request: NextRequest) {
  try {
    const jobs = await db.jobVacancy.findMany({
      where: {
        isActive: true,
      },
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

// POST /api/v1/jobs - Admin only endpoint to create a job
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      title,
      description,
      companyName,
      location,
      salaryRange,
      requirements,
      jobType,
      applicationDeadline,
      isActive,
    } = body;

    // Validation
    if (
      !title ||
      !description ||
      !companyName ||
      !location ||
      !requirements ||
      !jobType
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Create job
    const job = await db.jobVacancy.create({
      data: {
        title,
        description,
        companyName,
        location,
        salaryRange: salaryRange || null,
        requirements,
        jobType,
        applicationDeadline: applicationDeadline
          ? new Date(applicationDeadline)
          : null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: job,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create job vacancy",
      },
      { status: 500 }
    );
  }
}
