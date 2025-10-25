import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { deleteFiles, extractFilePathFromUrl } from "@/lib/utils/file-cleanup";
import { 
  UpdateTestimonialRequestSchema 
} from "@/lib/api/contracts/testimonials";

// GET /api/v1/testimonials/[id] - Get a single testimonial
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: params.id },
    });

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/testimonials/[id] - Update a testimonial (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validationResult = UpdateTestimonialRequestSchema.safeParse(body);

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

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id: params.id },
    });

    if (!existingTestimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
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

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (title !== undefined) updateData.title = title;
    if (comment !== undefined) updateData.comment = comment;
    if (rating !== undefined) updateData.rating = rating;
    if (mediaUrl !== undefined) updateData.mediaUrl = mediaUrl;
    if (mediaType !== undefined) updateData.mediaType = mediaType;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (order !== undefined) updateData.order = order;
    
    if (status !== undefined) {
      updateData.status = status;
      // Set or update publishedAt when changing to PUBLISHED
      if (status === "PUBLISHED" && !existingTestimonial.publishedAt) {
        updateData.publishedAt = publishedAt || new Date();
      }
    }

    // Update testimonial
    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: testimonial,
      message: "Testimonial updated successfully",
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/testimonials/[id] - Delete a testimonial (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    // Fetch testimonial to get media file paths before deletion
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id: params.id },
    });

    if (!existingTestimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Collect all file paths to delete
    const filesToDelete: string[] = [];

    // Add media file if it exists and is not an external URL
    if (existingTestimonial.mediaUrl) {
      const mediaPath = extractFilePathFromUrl(existingTestimonial.mediaUrl);
      if (!mediaPath.startsWith("http")) {
        filesToDelete.push(mediaPath);
      }
    }

    // Add thumbnail if it exists and is not an external URL
    if (existingTestimonial.thumbnailUrl) {
      const thumbnailPath = extractFilePathFromUrl(existingTestimonial.thumbnailUrl);
      if (!thumbnailPath.startsWith("http")) {
        filesToDelete.push(thumbnailPath);
      }
    }

    // Delete testimonial from database
    await prisma.testimonial.delete({
      where: { id: params.id },
    });

    // Delete physical files from filesystem
    if (filesToDelete.length > 0) {
      const deleteResult = await deleteFiles(filesToDelete);
      console.log(
        `Deleted testimonial ${params.id}: ${deleteResult.success} files removed, ${deleteResult.failed} files failed`
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: params.id },
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
