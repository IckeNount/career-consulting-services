import { z } from "zod";

// Enums
export const applicationStatusEnum = z.enum([
  "PENDING",
  "REVIEWING",
  "APPROVED",
  "REJECTED",
]);
export const languageProficiencyEnum = z.enum([
  "BASIC",
  "INTERMEDIATE",
  "ADVANCED",
  "NATIVE",
]);
export const educationLevelEnum = z.enum([
  "HIGH_SCHOOL",
  "ASSOCIATE",
  "BACHELOR",
  "MASTER",
  "DOCTORATE",
  "OTHER",
]);

// Language schema
export const languageSchema = z.object({
  language: z
    .string()
    .min(2, "Language name must be at least 2 characters")
    .max(50),
  proficiency: languageProficiencyEnum,
});

// Create application schema
export const createApplicationSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(20),
  dateOfBirth: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  nationality: z.string().min(2, "Nationality is required").max(100),
  currentLocation: z.string().min(2, "Current location is required").max(100),

  // Professional Information
  desiredCountry: z.string().min(2, "Desired country is required").max(100),
  desiredPosition: z.string().min(2, "Desired position is required").max(100),
  yearsExperience: z
    .number()
    .int()
    .min(0, "Years of experience must be 0 or greater")
    .max(50),
  currentSalary: z
    .number()
    .positive("Current salary must be positive")
    .optional(),
  expectedSalary: z.number().positive("Expected salary must be positive"),
  educationLevel: educationLevelEnum,

  // Documents
  resumeUrl: z.string().url("Resume URL must be a valid URL"),
  coverLetterUrl: z
    .string()
    .url("Cover letter URL must be a valid URL")
    .optional(),
  portfolioUrl: z.string().url("Portfolio URL must be a valid URL").optional(),

  // Additional Information
  skills: z
    .array(z.string().min(1).max(50))
    .min(1, "At least one skill is required")
    .max(20),
  languages: z
    .array(languageSchema)
    .min(1, "At least one language is required")
    .max(10),
  notes: z
    .string()
    .max(1000, "Notes must not exceed 1000 characters")
    .optional(),
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
    .enum(["createdAt", "updatedAt", "firstName", "lastName", "desiredCountry"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Type exports
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type ApplicationQueryParams = z.infer<typeof applicationQuerySchema>;
