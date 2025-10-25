import { z } from "zod";

/**
 * Testimonials API Contracts
 * Single source of truth for testimonial endpoints
 */

// ============================================================================
// Enums & Reusable Schemas
// ============================================================================

export const TestimonialStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const TestimonialMediaTypeSchema = z.enum(["PHOTO", "VIDEO"]);

// ============================================================================
// GET /api/v1/testimonials - List Testimonials
// ============================================================================

export const GetTestimonialsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .optional()
    .default("20")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(50)),
  status: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "all" || TestimonialStatusSchema.safeParse(val).success
    ),
});

export const TestimonialResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  comment: z.string(),
  rating: z.number().min(0).max(5),
  mediaUrl: z.string().nullable(),
  mediaType: TestimonialMediaTypeSchema.nullable(),
  thumbnailUrl: z.string().nullable(),
  status: TestimonialStatusSchema,
  order: z.number().int().min(0),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const GetTestimonialsResponseSchema = z.object({
  success: z.boolean(),
  testimonials: z.array(TestimonialResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

// ============================================================================
// GET /api/v1/testimonials/[id] - Get Single Testimonial
// ============================================================================

export const GetTestimonialResponseSchema = z.object({
  success: z.boolean(),
  data: TestimonialResponseSchema,
});

// ============================================================================
// POST /api/v1/testimonials - Create Testimonial
// ============================================================================

export const CreateTestimonialRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(1000),
  rating: z.number().min(0).max(5).default(5.0),
  mediaUrl: z.string().url("Media URL must be valid").nullable().optional(),
  mediaType: TestimonialMediaTypeSchema.nullable().optional(),
  thumbnailUrl: z.string().url("Thumbnail URL must be valid").nullable().optional(),
  status: TestimonialStatusSchema.optional().default("DRAFT"),
  order: z.number().int().min(0).optional().default(0),
  publishedAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)),
});

export const CreateTestimonialResponseSchema = z.object({
  success: z.boolean(),
  data: TestimonialResponseSchema,
  message: z.string().optional(),
});

// ============================================================================
// PATCH /api/v1/testimonials/[id] - Update Testimonial
// ============================================================================

export const UpdateTestimonialRequestSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  title: z.string().min(2).max(100).optional(),
  comment: z.string().min(10).max(1000).optional(),
  rating: z.number().min(0).max(5).optional(),
  mediaUrl: z.string().url().nullable().optional(),
  mediaType: TestimonialMediaTypeSchema.nullable().optional(),
  thumbnailUrl: z.string().url().nullable().optional(),
  status: TestimonialStatusSchema.optional(),
  order: z.number().int().min(0).optional(),
  publishedAt: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)),
});

export const UpdateTestimonialResponseSchema = z.object({
  success: z.boolean(),
  data: TestimonialResponseSchema,
  message: z.string().optional(),
});

// ============================================================================
// DELETE /api/v1/testimonials/[id] - Delete Testimonial
// ============================================================================

export const DeleteTestimonialResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
  }),
  message: z.string().optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type TestimonialStatus = z.infer<typeof TestimonialStatusSchema>;
export type TestimonialMediaType = z.infer<typeof TestimonialMediaTypeSchema>;
export type GetTestimonialsQuery = z.infer<typeof GetTestimonialsQuerySchema>;
export type TestimonialResponse = z.infer<typeof TestimonialResponseSchema>;
export type GetTestimonialsResponse = z.infer<typeof GetTestimonialsResponseSchema>;
export type GetTestimonialResponse = z.infer<typeof GetTestimonialResponseSchema>;
export type CreateTestimonialRequest = z.infer<typeof CreateTestimonialRequestSchema>;
export type CreateTestimonialResponse = z.infer<typeof CreateTestimonialResponseSchema>;
export type UpdateTestimonialRequest = z.infer<typeof UpdateTestimonialRequestSchema>;
export type UpdateTestimonialResponse = z.infer<typeof UpdateTestimonialResponseSchema>;
export type DeleteTestimonialResponse = z.infer<typeof DeleteTestimonialResponseSchema>;
