import prisma from "./prisma";
import {
  ApplicationStatus,
  Prisma,
  EducationLevel,
  LanguageProficiency,
} from "@prisma/client";
import type { CreateApplicationInput, UpdateApplicationInput } from "@/types";

// Type assertion to help VS Code IntelliSense with new models
const db = prisma as any;

/**
 * Application Queries
 */

// Create a new application
export async function createApplication(data: CreateApplicationInput) {
  const {
    passportNumber,
    experience,
    skills,
    torFile,
    diplomaFile,
    resumeFile,
    jobId,
    ...applicationData
  } = data;

  // Build base data object with required fields
  const cleanedData: any = {
    fullName: applicationData.fullName,
    email: applicationData.email,
    phone: applicationData.phone,
    nationality: applicationData.nationality,
    residence: applicationData.residence,
    religion: applicationData.religion,
    maritalStatus: applicationData.maritalStatus,
    hasPassport: applicationData.hasPassport,
    startDate: new Date(applicationData.startDate),
    educationLevel: applicationData.educationLevel,
    hasExperience: applicationData.hasExperience,
    languages: applicationData.languages,
    englishLevel: applicationData.englishLevel,
    motivation: applicationData.motivation,
    referralSource: applicationData.referralSource,
    consent: applicationData.consent,
  };

  // Add optional fields only if they have valid values
  if (passportNumber) {
    cleanedData.passportNumber = passportNumber;
  }
  if (experience) {
    cleanedData.experience = experience;
  }
  if (skills) {
    cleanedData.skills = skills;
  }
  if (torFile) {
    cleanedData.torFile = torFile;
  }
  if (diplomaFile) {
    cleanedData.diplomaFile = diplomaFile;
  }
  if (resumeFile) {
    cleanedData.resumeFile = resumeFile;
  }
  if (jobId) {
    cleanedData.jobId = jobId;
  }

  return await prisma.application.create({
    data: {
      ...cleanedData,
      // Create initial status history entry for public submissions
      statusHistory: {
        create: {
          status: ApplicationStatus.PENDING,
          changedBy: null,
          notes: "Application submitted via public form",
        },
      },
    },
    include: {
      statusHistory: true,
      ...(jobId && { job: true }),
    } as any,
  });
}

// Get application by ID
export async function getApplicationById(id: string) {
  return await prisma.application.findUnique({
    where: { id },
    include: {
      statusHistory: {
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { changedAt: "desc" },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    } as any,
  });
}

// Get all applications with pagination and filters
export async function getApplications({
  page = 1,
  pageSize = 25,
  status,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  jobId,
}: {
  page?: number;
  pageSize?: number;
  status?: ApplicationStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  jobId?: string;
}) {
  const skip = (page - 1) * pageSize;

  const where: any = {
    ...(status && { status }),
    ...(jobId && { jobId }),
    ...(search && {
      OR: [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { nationality: { contains: search, mode: "insensitive" } },
        { residence: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [applications, total] = await Promise.all([
    db.application.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            companyName: true,
            location: true,
          },
        },
      },
    }),
    db.application.count({ where }),
  ]);

  return {
    data: applications,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

// Update application status
export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  adminId: string | null,
  notes?: string
) {
  return await prisma.application.update({
    where: { id },
    data: {
      status,
      ...(adminId && { reviewedBy: adminId }),
      ...(notes !== undefined && { reviewNotes: notes }),
      updatedAt: new Date(),
      statusHistory: {
        create: {
          status,
          changedBy: adminId,
          notes,
        },
      },
    },
    include: {
      statusHistory: true,
      reviewer: adminId
        ? {
            select: {
              id: true,
              name: true,
              email: true,
            },
          }
        : undefined,
    },
  });
}

// Delete application
export async function deleteApplication(id: string) {
  return await prisma.application.delete({
    where: { id },
  });
}

/**
 * Admin User Queries
 */

// Create admin user
export async function createAdminUser(data: {
  email: string;
  passwordHash: string;
  name: string;
  role?: "ADMIN" | "SUPER_ADMIN";
}) {
  return await prisma.adminUser.create({
    data,
  });
}

// Get admin user by email
export async function getAdminByEmail(email: string) {
  return await prisma.adminUser.findUnique({
    where: { email },
  });
}

// Get admin user by ID
export async function getAdminById(id: string) {
  return await prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      lastLogin: true,
      isActive: true,
    },
  });
}

// Update admin last login
export async function updateAdminLastLogin(id: string) {
  return await prisma.adminUser.update({
    where: { id },
    data: { lastLogin: new Date() },
  });
}

/**
 * Analytics Queries
 */

// Get dashboard overview stats
export async function getDashboardStats() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalApplications,
    pendingApplications,
    reviewingApplications,
    approvedApplications,
    rejectedApplications,
    applicationsTodayCount,
    applicationsThisWeekCount,
    applicationsThisMonthCount,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: ApplicationStatus.PENDING } }),
    prisma.application.count({
      where: { status: ApplicationStatus.REVIEWING },
    }),
    prisma.application.count({ where: { status: ApplicationStatus.APPROVED } }),
    prisma.application.count({ where: { status: ApplicationStatus.REJECTED } }),
    prisma.application.count({ where: { createdAt: { gte: today } } }),
    prisma.application.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.application.count({ where: { createdAt: { gte: monthAgo } } }),
  ]);

  return {
    totalApplications,
    pendingApplications,
    reviewingApplications,
    approvedApplications,
    rejectedApplications,
    applicationsTodayCount,
    applicationsThisWeekCount,
    applicationsThisMonthCount,
  };
}

// Get applications by country
export async function getApplicationsByCountry() {
  const result = await (prisma.application.groupBy as any)({
    by: ["residence"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 10,
  });

  return result.map((item: any) => ({
    country: item.residence,
    count: item._count.id,
  }));
}

// Get applications by education level
export async function getApplicationsByEducation() {
  const result = await (prisma.application.groupBy as any)({
    by: ["educationLevel"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 10,
  });

  return result.map((item: any) => ({
    education: item.educationLevel,
    count: item._count.id,
  }));
}

// Get applications over time (last 30 days)
export async function getApplicationsOverTime(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const applications = await prisma.application.findMany({
    where: {
      createdAt: { gte: startDate },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by date
  const dateMap = new Map<string, number>();
  applications.forEach((app) => {
    const date = app.createdAt.toISOString().split("T")[0];
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  });

  return Array.from(dateMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));
}

/**
 * Audit Log Queries
 */

// Create audit log
export async function createAuditLog(data: {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  return await prisma.auditLog.create({
    data,
  });
}

// Get audit logs with pagination
export async function getAuditLogs({
  page = 1,
  pageSize = 50,
  userId,
  entityType,
}: {
  page?: number;
  pageSize?: number;
  userId?: string;
  entityType?: string;
}) {
  const skip = (page - 1) * pageSize;

  const where: Prisma.AuditLogWhereInput = {
    ...(userId && { userId }),
    ...(entityType && { entityType }),
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { timestamp: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    data: logs,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
