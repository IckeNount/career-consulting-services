import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { 
  GetTestimonialsQuerySchema,
  CreateTestimonialRequestSchema 
} from "@/lib/api/contracts/testimonials";

// GET /api/v1/testimonials - List all testimonials with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const queryResult = GetTestimonialsQuerySchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      status: searchParams.get("status"),
    });

    if (!queryResult.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: queryResult.error },
        { status: 400 }
      );
    }

    const { page, limit, status } = queryResult.data;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.TestimonialWhereInput = {};

    if (status && status !== "all") {
      where.status = status as any;
    }
    // If no status filter or "all", return all testimonials (admin view)
    // For public access, the query should explicitly pass status=PUBLISHED

    // Execute queries
    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.testimonial.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      testimonials,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST /api/v1/testimonials - Create a new testimonial (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = CreateTestimonialRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid request data", 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }

    const {
      name,
      title,
      comment,
      rating,
      mediaUrl,
      mediaType,
      thumbnailUrl,
      status,
      order,
      publishedAt,
    } = validationResult.data;

    // Verify the admin user exists
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
    });

    if (!adminUser) {
      console.error(
        `Admin user not found - Session ID: ${session.user.id}, Email: ${session.user.email}`
      );
      return NextResponse.json(
        {
          success: false,
          error:
            "Admin user not found. Please log out and log back in to refresh your session.",
        },
        { status: 403 }
      );
    }

    // Create testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        title,
        comment,
        rating,
        mediaUrl,
        mediaType,
        thumbnailUrl,
        status: status || "DRAFT",
        order: order || 0,
        publishedAt: status === "PUBLISHED" ? publishedAt || new Date() : null,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        data: testimonial,
        message: "Testimonial created successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
