import { z } from "zod";

// Enums
export const applicationStatusEnum = z.enum([
  "PENDING",
  "REVIEWING",
  "APPROVED",
  "REJECTED",
]);

// Create application schema - Updated for new form structure
export const createApplicationSchema = z.object({
  // Personal Information
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

  // Passport Information
  hasPassport: z.boolean(),
  passportNumber: z
    .string()
    .min(5, "Passport number must be at least 5 characters")
    .max(50)
    .optional()
    .nullable(),

  // Job Preferences
  startDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),

  // Education & Documents
  educationLevel: z.string().min(2, "Education level is required").max(50),
  torFile: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  diplomaFile: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  resumeFile: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),

  // Experience & Skills
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

  // Additional Details
  motivation: z
    .string()
    .min(
      20,
      "Please tell us more about your motivation (at least 20 characters)"
    )
    .max(2000),
  referralSource: z
    .string()
    .min(2, "Please tell us how you heard about us")
    .max(50),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and privacy policy",
  }),

  // Job relation
  jobId: z.string().optional().nullable(),
});

// Update application schema (for admin)
export const updateApplicationSchema = z.object({
  status: applicationStatusEnum.optional(),
  reviewNotes: z
    .string()
    .max(1000, "Review notes must not exceed 1000 characters")
    .optional(),
});

// Query params schema for filtering
export const applicationQuerySchema = z.object({
  page: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive())
    .default("1"),
  pageSize: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .default("25"),
  status: applicationStatusEnum.optional(),
  search: z.string().max(100).optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "fullName", "residence"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  jobId: z.string().optional(),
});

// Type exports
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type ApplicationQueryParams = z.infer<typeof applicationQuerySchema>;
