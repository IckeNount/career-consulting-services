import { z } from "zod";

/**
 * Application API Contracts
 * Single source of truth for application endpoints
 */

// ============================================================================
// Enums & Reusable Schemas
// ============================================================================

export const ApplicationStatusSchema = z.enum([
  "PENDING",
  "REVIEWING",
  "APPROVED",
  "REJECTED",
]);

export const ApplicationIdSchema = z.string().cuid();

// ============================================================================
// GET /api/v1/applications - List Applications
// ============================================================================

export const GetApplicationsQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().int().positive()),
    pageSize: z
      .string()
      .optional()
      .default("25")
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().int().min(1).max(100)),
    status: ApplicationStatusSchema.optional(),
    search: z.string().max(100).optional(),
    sortBy: z
      .enum(["createdAt", "updatedAt", "fullName", "residence"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    jobId: z.string().optional(),
  })
  .optional();

export const ApplicationResponseSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  nationality: z.string(),
  residence: z.string(),
  religion: z.string(),
  maritalStatus: z.string(),
  hasPassport: z.boolean(),
  passportNumber: z.string().nullable(),
  startDate: z.string(),
  educationLevel: z.string(),
  torFile: z.string().nullable(),
  diplomaFile: z.string().nullable(),
  resumeFile: z.string().nullable(),
  hasExperience: z.boolean(),
  experience: z.string().nullable(),
  languages: z.string(),
  englishLevel: z.string(),
  skills: z.string().nullable(),
  motivation: z.string(),
  referralSource: z.string(),
  consent: z.boolean(),
  status: ApplicationStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  reviewNotes: z.string().nullable(),
  reviewedBy: z.string().nullable(),
  jobId: z.string().nullable(),
  job: z
    .object({
      id: z.string(),
      title: z.string(),
      companyName: z.string(),
      location: z.string(),
    })
    .nullable()
    .optional(),
});

export const GetApplicationsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ApplicationResponseSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  }),
});

// ============================================================================
// GET /api/v1/applications/[id] - Get Single Application
// ============================================================================

export const GetApplicationResponseSchema = z.object({
  success: z.boolean(),
  data: ApplicationResponseSchema,
});

// ============================================================================
// POST /api/v1/applications - Create Application
// ============================================================================

export const CreateApplicationRequestSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(20),
  nationality: z.string().min(2, "Nationality is required").max(100),
  residence: z
    .string()
    .min(2, "Current country of residence is required")
    .max(100),
  religion: z.string().min(2, "Religion is required").max(100),
  maritalStatus: z.string().min(2, "Marital status is required").max(50),
  hasPassport: z.boolean(),
  passportNumber: z
    .string()
    .min(5, "Passport number must be at least 5 characters")
    .max(50)
    .optional()
    .nullable(),
  startDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val).toISOString()),
  educationLevel: z.string().min(2, "Education level is required").max(50),
  torFile: z.string().url().optional().nullable(),
  diplomaFile: z.string().url().optional().nullable(),
  resumeFile: z.string().url().optional().nullable(),
  hasExperience: z.boolean(),
  experience: z
    .string()
    .min(10, "Please provide more details about your experience")
    .max(2000)
    .optional()
    .nullable(),
  languages: z.string().min(2, "At least one language is required").max(200),
  englishLevel: z
    .string()
    .min(2, "English proficiency level is required")
    .max(50),
  skills: z
    .string()
    .max(1000, "Skills must not exceed 1000 characters")
    .optional()
    .nullable(),
  motivation: z
    .string()
    .min(20, "Please tell us more (at least 20 characters)")
    .max(2000),
  referralSource: z
    .string()
    .min(2, "Please tell us how you heard about us")
    .max(50),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
  jobId: z.string().optional().nullable(),
});

export const CreateApplicationResponseSchema = z.object({
  success: z.boolean(),
  data: ApplicationResponseSchema,
  message: z.string().optional(),
});

// ============================================================================
// PATCH /api/v1/applications/[id] - Update Application
// ============================================================================

export const UpdateApplicationRequestSchema = z.object({
  status: ApplicationStatusSchema.optional(),
  reviewNotes: z
    .string()
    .max(1000, "Review notes must not exceed 1000 characters")
    .optional(),
  adminId: z.string().optional().nullable(),
});

export const UpdateApplicationResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    status: ApplicationStatusSchema,
    reviewNotes: z.string().nullable(),
    updatedAt: z.string(),
  }),
  message: z.string().optional(),
});

// ============================================================================
// DELETE /api/v1/applications/[id] - Delete Application
// ============================================================================

export const DeleteApplicationResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
  }),
  message: z.string().optional(),
});

// ============================================================================
// Error Response
// ============================================================================

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z.any().optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;
export type GetApplicationsQuery = z.infer<typeof GetApplicationsQuerySchema>;
export type GetApplicationsResponse = z.infer<
  typeof GetApplicationsResponseSchema
>;
export type GetApplicationResponse = z.infer<
  typeof GetApplicationResponseSchema
>;
export type CreateApplicationRequest = z.infer<
  typeof CreateApplicationRequestSchema
>;
export type CreateApplicationResponse = z.infer<
  typeof CreateApplicationResponseSchema
>;
export type UpdateApplicationRequest = z.infer<
  typeof UpdateApplicationRequestSchema
>;
export type UpdateApplicationResponse = z.infer<
  typeof UpdateApplicationResponseSchema
>;
export type DeleteApplicationResponse = z.infer<
  typeof DeleteApplicationResponseSchema
>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
