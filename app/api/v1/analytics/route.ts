import { NextRequest } from "next/server";
import {
  getDashboardStats,
  getApplicationsByCountry,
  getApplicationsByPosition,
  getApplicationsOverTime,
} from "@/lib/db/queries";
import { apiResponse, apiError, withErrorHandler } from "@/lib/api/utils";

/**
 * GET /api/v1/analytics
 * Protected endpoint - Get dashboard analytics (admin only)
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  // TODO: Verify admin authentication
  // const session = await getServerSession(authOptions)
  // if (!session?.user?.isAdmin) {
  //   return apiError('Unauthorized - Admin access required', 401)
  // }

  // Get query params
  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") || "30", 10);

  // Fetch all analytics data in parallel
  const [overview, byCountry, byPosition, overTime] = await Promise.all([
    getDashboardStats(),
    getApplicationsByCountry(),
    getApplicationsByPosition(),
    getApplicationsOverTime(days),
  ]);

  // Calculate additional metrics
  const conversionRate =
    overview.totalApplications > 0
      ? (overview.approvedApplications / overview.totalApplications) * 100
      : 0;

  const analytics = {
    overview,
    charts: {
      applicationsByCountry: byCountry,
      applicationsByPosition: byPosition,
      applicationsOverTime: overTime,
    },
    trends: {
      conversionRate: Math.round(conversionRate * 100) / 100,
      growthRate: calculateGrowthRate(
        overview.applicationsThisWeekCount,
        overview.applicationsThisMonthCount
      ),
    },
  };

  return apiResponse(analytics);
});

/**
 * Helper function to calculate growth rate
 */
function calculateGrowthRate(thisWeek: number, thisMonth: number): number {
  if (thisMonth === 0) return 0;
  const avgPerWeek = thisMonth / 4;
  if (avgPerWeek === 0) return 0;
  const growth = ((thisWeek - avgPerWeek) / avgPerWeek) * 100;
  return Math.round(growth * 100) / 100;
}
