import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

// GET /api/v1/blog - List all blog posts with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.BlogPostWhereInput = {};

    if (category && category !== "all") {
      where.category = category as any;
    }

    if (status && status !== "all") {
      where.status = status as any;
    }
    // If no status filter or "all", return all posts (admin view)
    // For public access, the query should explicitly pass status=PUBLISHED

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    // Execute queries
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          authorAdmin: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          publishedAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST /api/v1/blog - Create a new blog post (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      slug,
      title,
      excerpt,
      content,
      coverImage,
      category,
      status,
      author,
      readTime,
      metaTitle,
      metaDescription,
      publishedAt,
      media,
    } = body;

    // Validate required fields
    if (!slug || !title || !excerpt || !content || !coverImage || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }

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
          error:
            "Admin user not found. Please log out and log back in to refresh your session.",
        },
        { status: 403 }
      );
    }

    // Create blog post with media
    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        coverImage,
        category,
        status: status || "DRAFT",
        author: author || adminUser.name || "KTECCS Team",
        readTime: readTime || "5 min read",
        metaTitle,
        metaDescription,
        publishedAt: status === "PUBLISHED" ? publishedAt || new Date() : null,
        authorId: session.user.id,
        media: media
          ? {
              create: media.map((item: any) => ({
                url: item.url,
                type: item.type,
                caption: item.caption || null,
                order: item.order,
              })),
            }
          : undefined,
      },
      include: {
        authorAdmin: {
          select: {
            name: true,
            email: true,
          },
        },
        media: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
