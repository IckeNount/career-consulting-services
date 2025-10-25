import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Validation Middleware
 * Provides reusable validation for request body, query params, and path params
 */

// ============================================================================
// Error Response Formatter
// ============================================================================

export function formatZodError(error: z.ZodError) {
  return {
    success: false,
    error: "Validation failed",
    details: error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
      code: err.code,
    })),
  };
}

export function formatError(error: unknown) {
  if (error instanceof z.ZodError) {
    return formatZodError(error);
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: false,
    error: "An unexpected error occurred",
  };
}

// ============================================================================
// Request Body Validation
// ============================================================================

/**
 * Validates request body against a Zod schema
 * Use for POST, PATCH, PUT requests
 */
export function validateRequestBody<T extends z.ZodTypeAny>(schema: T) {
  return async (
    req: NextRequest,
    handler: (data: z.infer<T>) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    try {
      const body = await req.json();
      const validatedData = schema.parse(body);
      return await handler(validatedData);
    } catch (error) {
      console.error("Request body validation error:", error);

      if (error instanceof z.ZodError) {
        return NextResponse.json(formatZodError(error), { status: 400 });
      }

      if (error instanceof SyntaxError) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid JSON in request body",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse request body",
        },
        { status: 400 }
      );
    }
  };
}

// ============================================================================
// Query Parameters Validation
// ============================================================================

/**
 * Validates URL query parameters against a Zod schema
 * Use for GET requests with query params
 */
export function validateQueryParams<T extends z.ZodTypeAny>(schema: T) {
  return async (
    req: NextRequest,
    handler: (data: z.infer<T>) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    try {
      const { searchParams } = new URL(req.url);
      const queryObject = Object.fromEntries(searchParams.entries());
      const validatedData = schema.parse(queryObject);
      return await handler(validatedData);
    } catch (error) {
      console.error("Query params validation error:", error);

      if (error instanceof z.ZodError) {
        return NextResponse.json(formatZodError(error), { status: 400 });
      }

      return NextResponse.json(
        {
          success: false,
          error: "Invalid query parameters",
        },
        { status: 400 }
      );
    }
  };
}

// ============================================================================
// Path Parameters Validation
// ============================================================================

/**
 * Validates path parameters (like [id]) against a Zod schema
 */
export function validatePathParams<T extends z.ZodTypeAny>(schema: T) {
  return async (
    params: any,
    handler: (data: z.infer<T>) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    try {
      const validatedData = schema.parse(params);
      return await handler(validatedData);
    } catch (error) {
      console.error("Path params validation error:", error);

      if (error instanceof z.ZodError) {
        return NextResponse.json(formatZodError(error), { status: 400 });
      }

      return NextResponse.json(
        {
          success: false,
          error: "Invalid path parameters",
        },
        { status: 400 }
      );
    }
  };
}

// ============================================================================
// Combined Validation (Body + Params)
// ============================================================================

/**
 * Validates both request body and path parameters
 * Use for PATCH/PUT requests with [id]
 */
export function validateRequestWithParams<
  TBody extends z.ZodTypeAny,
  TParams extends z.ZodTypeAny
>(bodySchema: TBody, paramsSchema: TParams) {
  return async (
    req: NextRequest,
    params: any,
    handler: (
      body: z.infer<TBody>,
      params: z.infer<TParams>
    ) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    try {
      // Validate params first
      const validatedParams = paramsSchema.parse(params);

      // Then validate body
      const body = await req.json();
      const validatedBody = bodySchema.parse(body);

      return await handler(validatedBody, validatedParams);
    } catch (error) {
      console.error("Combined validation error:", error);

      if (error instanceof z.ZodError) {
        return NextResponse.json(formatZodError(error), { status: 400 });
      }

      if (error instanceof SyntaxError) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid JSON in request body",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
        },
        { status: 400 }
      );
    }
  };
}

// ============================================================================
// Error Handler Wrapper
// ============================================================================

/**
 * Wraps an API handler with try-catch and standard error formatting
 */
export function withErrorHandler<
  T extends (...args: any[]) => Promise<NextResponse>
>(handler: T): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("API Error:", error);

      // Don't re-wrap NextResponse errors
      if (error instanceof NextResponse) {
        return error;
      }

      return NextResponse.json(formatError(error), { status: 500 });
    }
  }) as T;
}

// ============================================================================
// Success Response Helper
// ============================================================================

/**
 * Creates a standardized success response
 */
export function successResponse<T>(
  data: T,
  options?: {
    message?: string;
    status?: number;
  }
) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(options?.message && { message: options.message }),
    },
    { status: options?.status || 200 }
  );
}

/**
 * Creates a standardized error response
 */
export function errorResponse(
  error: string,
  options?: {
    status?: number;
    details?: any;
  }
) {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(options?.details && { details: options.details }),
    },
    { status: options?.status || 400 }
  );
}
