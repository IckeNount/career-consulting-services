import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Type assertion to help VS Code IntelliSense
const db = prisma as any;

// GET /api/v1/jobs/[id] - Get single job (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await db.jobVacancy.findUnique({
      where: {
        id: params.id,
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: "Job not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch job",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/jobs/[id] - Update job (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Update job
    const job = await db.jobVacancy.update({
      where: {
        id: params.id,
      },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(companyName && { companyName }),
        ...(location && { location }),
        ...(salaryRange !== undefined && { salaryRange }),
        ...(requirements && { requirements }),
        ...(jobType && { jobType }),
        ...(applicationDeadline !== undefined && {
          applicationDeadline: applicationDeadline
            ? new Date(applicationDeadline)
            : null,
        }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update job",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/jobs/[id] - Delete job (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Delete job
    await db.jobVacancy.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete job",
      },
      { status: 500 }
    );
  }
}
