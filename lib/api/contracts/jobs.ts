import { z } from "zod";

/**
 * Job Vacancy API Contracts
 * Single source of truth for job vacancy endpoints
 */

// ============================================================================
// Enums & Reusable Schemas
// ============================================================================

export const JobTypeSchema = z.enum(["FULL_TIME", "CONTRACT", "SUBSTITUTE"]);

// ============================================================================
// GET /api/v1/jobs - List Job Vacancies (Public)
// ============================================================================

export const GetJobsQuerySchema = z.object({
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
  jobType: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "all" || JobTypeSchema.safeParse(val).success
    ),
  location: z.string().max(100).optional(),
  search: z.string().max(200).optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined
    ),
});

export const JobVacancyResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  companyName: z.string(),
  location: z.string(),
  salaryRange: z.string().nullable(),
  requirements: z.string(),
  jobType: JobTypeSchema,
  applicationDeadline: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  _count: z
    .object({
      applications: z.number().int().min(0),
    })
    .optional(),
});

export const GetJobsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(JobVacancyResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

// ============================================================================
// GET /api/v1/jobs/[id] - Get Single Job Vacancy
// ============================================================================

export const GetJobResponseSchema = z.object({
  success: z.boolean(),
  data: JobVacancyResponseSchema,
});

// ============================================================================
// POST /api/v1/jobs - Create Job Vacancy (Admin)
// ============================================================================

export const CreateJobRequestSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(50, "Description must be at least 50 characters"),
  companyName: z.string().min(2, "Company name is required").max(100),
  location: z.string().min(2, "Location is required").max(100),
  salaryRange: z.string().max(100).optional().nullable(),
  requirements: z
    .string()
    .min(20, "Requirements must be at least 20 characters"),
  jobType: JobTypeSchema,
  applicationDeadline: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val).toISOString() : null)),
  isActive: z.boolean().optional().default(true),
});

export const CreateJobResponseSchema = z.object({
  success: z.boolean(),
  data: JobVacancyResponseSchema,
  message: z.string().optional(),
});

// ============================================================================
// PATCH /api/v1/jobs/[id] - Update Job Vacancy (Admin)
// ============================================================================

export const UpdateJobRequestSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(50).optional(),
  companyName: z.string().min(2).max(100).optional(),
  location: z.string().min(2).max(100).optional(),
  salaryRange: z.string().max(100).optional().nullable(),
  requirements: z.string().min(20).optional(),
  jobType: JobTypeSchema.optional(),
  applicationDeadline: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val).toISOString() : null)),
  isActive: z.boolean().optional(),
});

export const UpdateJobResponseSchema = z.object({
  success: z.boolean(),
  data: JobVacancyResponseSchema,
  message: z.string().optional(),
});

// ============================================================================
// DELETE /api/v1/jobs/[id] - Delete Job Vacancy (Admin)
// ============================================================================

export const DeleteJobResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
  }),
  message: z.string().optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type JobType = z.infer<typeof JobTypeSchema>;
export type GetJobsQuery = z.infer<typeof GetJobsQuerySchema>;
export type JobVacancyResponse = z.infer<typeof JobVacancyResponseSchema>;
export type GetJobsResponse = z.infer<typeof GetJobsResponseSchema>;
export type GetJobResponse = z.infer<typeof GetJobResponseSchema>;
export type CreateJobRequest = z.infer<typeof CreateJobRequestSchema>;
export type CreateJobResponse = z.infer<typeof CreateJobResponseSchema>;
export type UpdateJobRequest = z.infer<typeof UpdateJobRequestSchema>;
export type UpdateJobResponse = z.infer<typeof UpdateJobResponseSchema>;
export type DeleteJobResponse = z.infer<typeof DeleteJobResponseSchema>;
