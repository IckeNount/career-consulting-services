import { NextRequest } from "next/server";
import {
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
} from "@/lib/db/queries";
import { updateApplicationSchema } from "@/lib/validations/application";
import {
  apiResponse,
  apiError,
  withErrorHandler,
  parseRequestBody,
} from "@/lib/api/utils";

type RouteContext = {
  params: {
    id: string;
  };
};

/**
 * GET /api/v1/applications/[id]
 * Protected endpoint - Get application by ID
 * TODO: Add authentication - admins can see all, users can see their own
 */
export const GET = withErrorHandler(
  async (req: NextRequest, context: RouteContext) => {
    // TODO: Verify authentication
    // const session = await getServerSession(authOptions)
    // if (!session?.user) {
    //   return apiError('Unauthorized', 401)
    // }

    const { id } = context.params;

    if (!id) {
      return apiError("Application ID is required", 400);
    }

    const application = await getApplicationById(id);

    if (!application) {
      return apiError("Application not found", 404);
    }

    // TODO: Check if user is admin or owns this application
    // if (!session.user.isAdmin && application.email !== session.user.email) {
    //   return apiError('Forbidden', 403)
    // }

    return apiResponse(application);
  }
);

/**
 * PATCH /api/v1/applications/[id]
 * Protected endpoint - Update application (admin only)
 */
export const PATCH = withErrorHandler(
  async (req: NextRequest, context: RouteContext) => {
    // TODO: Verify admin authentication
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return apiError('Unauthorized - Admin access required', 401)
    // }

    const { id } = context.params;

    if (!id) {
      return apiError("Application ID is required", 400);
    }

    // Parse and validate request body
    const body = await parseRequestBody(req);
    const validatedData = updateApplicationSchema.parse(body);

    // Check if application exists
    const existingApplication = await getApplicationById(id);
    if (!existingApplication) {
      return apiError("Application not found", 404);
    }

    // Update application status
    const updatedApplication = await updateApplicationStatus(
      id,
      (validatedData.status as any) || existingApplication.status,
      "TEMP_ADMIN_ID", // TODO: Replace with actual admin ID from session
      validatedData.reviewNotes
    );

    // TODO: Send status update email to applicant
    // if (validatedData.status && validatedData.status !== existingApplication.status) {
    //   await sendStatusUpdateEmail(
    //     updatedApplication.email,
    //     validatedData.status,
    //     validatedData.reviewNotes
    //   )
    // }

    // TODO: Log audit trail
    // await createAuditLog({
    //   userId: session.user.id,
    //   action: 'UPDATE_APPLICATION',
    //   entityType: 'application',
    //   entityId: id,
    //   changes: validatedData,
    //   ipAddress: getClientIp(req),
    //   userAgent: req.headers.get('user-agent') || undefined,
    // })

    return apiResponse(updatedApplication, {
      message: "Application updated successfully",
    });
  }
);

/**
 * DELETE /api/v1/applications/[id]
 * Protected endpoint - Delete application (admin only)
 */
export const DELETE = withErrorHandler(
  async (req: NextRequest, context: RouteContext) => {
    // TODO: Verify admin authentication
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return apiError('Unauthorized - Admin access required', 401)
    // }

    const { id } = context.params;

    if (!id) {
      return apiError("Application ID is required", 400);
    }

    // Check if application exists
    const existingApplication = await getApplicationById(id);
    if (!existingApplication) {
      return apiError("Application not found", 404);
    }

    // Delete application
    await deleteApplication(id);

    // TODO: Log audit trail
    // await createAuditLog({
    //   userId: session.user.id,
    //   action: 'DELETE_APPLICATION',
    //   entityType: 'application',
    //   entityId: id,
    //   ipAddress: getClientIp(req),
    //   userAgent: req.headers.get('user-agent') || undefined,
    // })

    return apiResponse(
      { id },
      {
        message: "Application deleted successfully",
      }
    );
  }
);
