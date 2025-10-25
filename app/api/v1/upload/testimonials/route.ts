import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// POST /api/v1/upload/testimonials - Upload testimonial media (photo/video)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type - allow images and videos
    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime", // .mov
    ];

    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPG, PNG, WebP, GIF, MP4, WebM, and MOV files are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size
    const isVideo = allowedVideoTypes.includes(file.type);
    const maxSize = isVideo ? 20 * 1024 * 1024 : 5 * 1024 * 1024; // 20MB for video, 5MB for images
    
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          error: `File too large. Maximum size is ${isVideo ? '20MB for videos' : '5MB for images'}.` 
        },
        { status: 400 }
      );
    }

    // Create uploads/testimonials directory if it doesn't exist
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "testimonials"
    );
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const sanitizedName = file.name
      .replace(extension, "")
      .replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}-${sanitizedName}${extension}`;
    const filepath = path.join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return the public URL and media type
    const url = `/uploads/testimonials/${filename}`;
    const mediaType = isVideo ? "VIDEO" : "PHOTO";

    // For videos, we'll generate thumbnail on the client side or use first frame
    // For now, return null for thumbnailUrl - admin can upload separately if needed
    return NextResponse.json(
      { 
        url, 
        mediaType,
        thumbnailUrl: null,
        message: "File uploaded successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading testimonial media:", error);
    return NextResponse.json(
      { error: "Failed to upload media" },
      { status: 500 }
    );
  }
}
