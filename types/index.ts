import {
  Application,
  AdminUser,
  StatusHistory,
  AuditLog,
} from "@prisma/client";

// Application with relations
export type ApplicationWithRelations = Application & {
  statusHistory: StatusHistory[];
  reviewer?: AdminUser | null;
};

// Create application input type
export type CreateApplicationInput = {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  residence: string;
  religion: string;
  maritalStatus: string;

  // Passport Information
  hasPassport: boolean;
  passportNumber?: string | null;

  // Job Preferences
  startDate: Date;

  // Education & Documents
  educationLevel: string;
  torFile?: any | null;
  diplomaFile?: any | null;
  resumeFile?: any | null;

  // Experience & Skills
  hasExperience: boolean;
  experience?: string | null;
  languages: string;
  englishLevel: string;
  skills?: string | null;

  // Additional Details
  motivation: string;
  referralSource: string;
  consent: boolean;

  // Job relation
  jobId?: string | null;
};

// Update application input type
export type UpdateApplicationInput = {
  status?: string;
  reviewedBy?: string;
  reviewNotes?: string;
};

// Dashboard analytics type
export interface DashboardAnalytics {
  overview: {
    totalApplications: number;
    pendingApplications: number;
    reviewingApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    applicationsTodayCount: number;
    applicationsThisWeekCount: number;
    applicationsThisMonthCount: number;
  };
  charts: {
    applicationsOverTime: { date: string; count: number }[];
    applicationsByCountry: { country: string; count: number }[];
    applicationsByPosition: { position: string; count: number }[];
    applicationsByStatus: { status: string; count: number }[];
  };
  trends: {
    conversionRate: number;
    avgProcessingTime: number;
    topSkills: { skill: string; count: number }[];
    topNationalities: { nationality: string; count: number }[];
  };
}

// API Response types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// Pagination types
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

// Export Prisma types
export type { Application, AdminUser, StatusHistory, AuditLog };
