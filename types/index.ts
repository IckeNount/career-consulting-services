import {
  Application,
  AdminUser,
  Language,
  StatusHistory,
  AuditLog,
} from "@prisma/client";

// Application with relations
export type ApplicationWithRelations = Application & {
  languages: Language[];
  statusHistory: StatusHistory[];
  reviewer?: AdminUser | null;
};

// Create application input type
export type CreateApplicationInput = {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  nationality: string;
  currentLocation: string;

  // Professional Information
  desiredCountry: string;
  desiredPosition: string;
  yearsExperience: number;
  currentSalary?: number;
  expectedSalary?: number;
  educationLevel: string;

  // Documents
  resumeUrl?: string;
  coverLetterUrl?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;

  // Additional
  skills: string[];
  languages: {
    language: string;
    proficiency: string;
  }[];
  notes?: string;
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
export type { Application, AdminUser, Language, StatusHistory, AuditLog };
