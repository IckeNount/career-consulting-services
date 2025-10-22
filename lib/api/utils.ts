import { NextResponse } from "next/server";
import { ZodError } from "zod";

// API Response helper
export function apiResponse<T = any>(
  data?: T,
  options?: {
    status?: number;
    message?: string;
  }
) {
  return NextResponse.json(
    {
      success: true,
      data,
      message: options?.message,
    },
    { status: options?.status || 200 }
  );
}

// API Error response helper
export function apiError(
  error: string | Error | ZodError,
  status: number = 500
) {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }

  // Handle Error objects
  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status }
    );
  }

  // Handle string errors
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

// Paginated response helper
export function paginatedResponse<T = any>(
  data: T[],
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
) {
  return NextResponse.json({
    success: true,
    data,
    pagination,
  });
}

// Error handler wrapper for async route handlers
export function withErrorHandler(
  handler: (req: any, context?: any) => Promise<NextResponse>
) {
  return async (req: any, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error("API Error:", error);

      if (error instanceof ZodError) {
        return apiError(error);
      }

      if (error instanceof Error) {
        // Check for Prisma errors
        if (error.message.includes("Unique constraint")) {
          return apiError("A record with this information already exists", 409);
        }
        if (error.message.includes("Record to update not found")) {
          return apiError("Resource not found", 404);
        }

        return apiError(error.message, 500);
      }

      return apiError("An unexpected error occurred", 500);
    }
  };
}

// Rate limiting helper (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: limit - record.count };
}

// Get IP address from request
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return "unknown";
}

// Validate request method
export function validateMethod(req: Request, allowedMethods: string[]) {
  if (!allowedMethods.includes(req.method)) {
    throw new Error(`Method ${req.method} not allowed`);
  }
}

// Parse request body safely
export async function parseRequestBody<T = any>(req: Request): Promise<T> {
  try {
    return await req.json();
  } catch (error) {
    throw new Error("Invalid JSON in request body");
  }
}
