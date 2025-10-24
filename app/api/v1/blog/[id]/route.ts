import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db/prisma";

// GET /api/v1/blog/[id] - Get a single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
      include: {
        authorAdmin: {
          select: {
            name: true,
            email: true,
          },
        },
        media: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/blog/[id] - Update a blog post (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // If slug is being changed, check it doesn't conflict
    if (slug && slug !== existingPost.slug) {
      const slugConflict = await prisma.blogPost.findUnique({
        where: { slug },
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (slug !== undefined) updateData.slug = slug;
    if (title !== undefined) updateData.title = title;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (category !== undefined) updateData.category = category;
    if (status !== undefined) {
      updateData.status = status;
      // Set or update publishedAt when changing to PUBLISHED
      if (status === "PUBLISHED") {
        // Update publishedAt even if already published (for re-publishing)
        updateData.publishedAt = publishedAt || new Date();
      }
    }
    if (author !== undefined) updateData.author = author;
    if (readTime !== undefined) updateData.readTime = readTime;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined)
      updateData.metaDescription = metaDescription;

    // Handle media updates if provided (within a transaction for atomicity)
    if (media !== undefined) {
      await prisma.$transaction(async (tx) => {
        // Delete existing media
        await tx.blogMedia.deleteMany({
          where: { postId: params.id },
        });

        // Create new media if any
        if (media.length > 0) {
          await tx.blogMedia.createMany({
            data: media.map((item: any) => ({
              postId: params.id,
              url: item.url,
              type: item.type,
              caption: item.caption || null,
              order: item.order,
            })),
          });
        }
      });
    }

    // Update blog post
    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: updateData,
      include: {
        authorAdmin: {
          select: {
            name: true,
            email: true,
          },
        },
        media: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/blog/[id] - Delete a blog post (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Delete blog post
    await prisma.blogPost.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
