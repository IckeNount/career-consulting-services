import { z } from "zod";

/**
 * Blog API Contracts
 * Single source of truth for blog endpoints
 */

// ============================================================================
// Enums & Reusable Schemas
// ============================================================================

export const BlogCategorySchema = z.enum([
  "TEACHING",
  "VISAS",
  "RELOCATION",
  "CAREER_TIPS",
  "INTERVIEWS",
  "CULTURE",
]);

export const BlogStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const MediaTypeSchema = z.enum(["IMAGE", "VIDEO"]);

export const BlogMediaSchema = z.object({
  id: z.string().optional(),
  url: z.string().url(),
  type: MediaTypeSchema,
  caption: z.string().nullable().optional(),
  order: z.number().int().min(0),
});

// ============================================================================
// GET /api/v1/blog - List Blog Posts
// ============================================================================

export const GetBlogPostsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(50)),
  category: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || val === "all" || BlogCategorySchema.safeParse(val).success
    ),
  status: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "all" || BlogStatusSchema.safeParse(val).success
    ),
  search: z.string().max(200).optional(),
});

export const BlogPostResponseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  coverImage: z.string().url(),
  category: BlogCategorySchema,
  status: BlogStatusSchema,
  author: z.string(),
  readTime: z.string(),
  views: z.number().int().min(0),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  authorId: z.string().nullable(),
  authorAdmin: z
    .object({
      name: z.string(),
      email: z.string().email(),
    })
    .nullable()
    .optional(),
  media: z.array(BlogMediaSchema).optional(),
});

export const GetBlogPostsResponseSchema = z.object({
  success: z.boolean(),
  posts: z.array(BlogPostResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

// ============================================================================
// GET /api/v1/blog/[slug] - Get Single Blog Post
// ============================================================================

export const GetBlogPostResponseSchema = z.object({
  success: z.boolean(),
  data: BlogPostResponseSchema,
});

// ============================================================================
// POST /api/v1/blog - Create Blog Post
// ============================================================================

export const CreateBlogPostRequestSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters")
    .max(500),
  content: z.string().min(50, "Content must be at least 50 characters"),
  coverImage: z.string().url("Cover image must be a valid URL"),
  category: BlogCategorySchema,
  status: BlogStatusSchema.optional().default("DRAFT"),
  author: z.string().min(2).max(100).optional(),
  readTime: z.string().optional().default("5 min read"),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  publishedAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)),
  media: z.array(BlogMediaSchema).optional(),
});

export const CreateBlogPostResponseSchema = z.object({
  success: z.boolean(),
  data: BlogPostResponseSchema,
  message: z.string().optional(),
});

// ============================================================================
// PATCH /api/v1/blog/[id] - Update Blog Post
// ============================================================================

export const UpdateBlogPostRequestSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  title: z.string().min(3).max(200).optional(),
  excerpt: z.string().min(10).max(500).optional(),
  content: z.string().min(50).optional(),
  coverImage: z.string().url().optional(),
  category: BlogCategorySchema.optional(),
  status: BlogStatusSchema.optional(),
  author: z.string().min(2).max(100).optional(),
  readTime: z.string().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  publishedAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)),
  media: z.array(BlogMediaSchema).optional(),
});

export const UpdateBlogPostResponseSchema = z.object({
  success: z.boolean(),
  data: BlogPostResponseSchema,
  message: z.string().optional(),
});

// ============================================================================
// DELETE /api/v1/blog/[id] - Delete Blog Post
// ============================================================================

export const DeleteBlogPostResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
  }),
  message: z.string().optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type BlogCategory = z.infer<typeof BlogCategorySchema>;
export type BlogStatus = z.infer<typeof BlogStatusSchema>;
export type MediaType = z.infer<typeof MediaTypeSchema>;
export type BlogMedia = z.infer<typeof BlogMediaSchema>;
export type GetBlogPostsQuery = z.infer<typeof GetBlogPostsQuerySchema>;
export type BlogPostResponse = z.infer<typeof BlogPostResponseSchema>;
export type GetBlogPostsResponse = z.infer<typeof GetBlogPostsResponseSchema>;
export type GetBlogPostResponse = z.infer<typeof GetBlogPostResponseSchema>;
export type CreateBlogPostRequest = z.infer<typeof CreateBlogPostRequestSchema>;
export type CreateBlogPostResponse = z.infer<
  typeof CreateBlogPostResponseSchema
>;
export type UpdateBlogPostRequest = z.infer<typeof UpdateBlogPostRequestSchema>;
export type UpdateBlogPostResponse = z.infer<
  typeof UpdateBlogPostResponseSchema
>;
export type DeleteBlogPostResponse = z.infer<
  typeof DeleteBlogPostResponseSchema
>;
