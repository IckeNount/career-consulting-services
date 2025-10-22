import { NextRequest } from "next/server";
import { createApplication, getApplications } from "@/lib/db/queries";
import {
  createApplicationSchema,
  applicationQuerySchema,
} from "@/lib/validations/application";
import {
  apiResponse,
  apiError,
  withErrorHandler,
  rateLimit,
  getClientIp,
  parseRequestBody,
  paginatedResponse,
} from "@/lib/api/utils";

/**
 * POST /api/v1/applications
 * Public endpoint - Create a new application
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  // Rate limiting - 5 applications per 15 minutes per IP
  const clientIp = getClientIp(req);
  const rateLimitResult = rateLimit(
    `application_${clientIp}`,
    5,
    15 * 60 * 1000
  );

  if (!rateLimitResult.success) {
    return apiError(
      "Too many applications submitted. Please try again later.",
      429
    );
  }

  // Parse and validate request body
  const body = await parseRequestBody(req);
  const validatedData = createApplicationSchema.parse(body);

  // Create application
  const application = await createApplication(validatedData);

  // TODO: Send confirmation email to applicant
  // await sendApplicationConfirmationEmail(application.email, application.id)

  // TODO: Notify admin of new application
  // await notifyAdminNewApplication(application.id)

  return apiResponse(
    {
      id: application.id,
      email: application.email,
      message:
        "Application submitted successfully. You will receive a confirmation email shortly.",
    },
    {
      status: 201,
      message: "Application created successfully",
    }
  );
});

/**
 * GET /api/v1/applications
 * Protected endpoint - List all applications (admin only)
 * TODO: Add authentication middleware
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  // TODO: Verify admin authentication
  // const session = await getServerSession(authOptions)
  // if (!session?.user?.isAdmin) {
  //   return apiError('Unauthorized', 401)
  // }

  // Parse query parameters
  const { searchParams } = new URL(req.url);
  const queryParams = {
    page: searchParams.get("page") || "1",
    pageSize: searchParams.get("pageSize") || "25",
    status: searchParams.get("status") || undefined,
    search: searchParams.get("search") || undefined,
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
  };

  const validatedParams = applicationQuerySchema.parse(queryParams);

  // Fetch applications
  const result = await getApplications({
    page: validatedParams.page,
    pageSize: validatedParams.pageSize,
    status: validatedParams.status as any,
    search: validatedParams.search,
    sortBy: validatedParams.sortBy,
    sortOrder: validatedParams.sortOrder,
  });

  return paginatedResponse(result.data, result.pagination);
});
