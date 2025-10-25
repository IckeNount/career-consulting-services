import { NextRequest } from "next/server";
import {
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
} from "@/lib/db/queries";
import {
  UpdateApplicationRequestSchema,
  ApplicationIdSchema,
} from "@/lib/api/contracts/applications";
import {
  validateRequestWithParams,
  withErrorHandler,
  successResponse,
  errorResponse,
} from "@/lib/api/middleware/validate";
import { z } from "zod";
import { deleteFiles, extractFilePathFromUrl } from "@/lib/utils/file-cleanup";

type RouteContext = {
  params: {
    id: string;
  };
};

const ParamsSchema = z.object({
  id: ApplicationIdSchema,
});

/**
 * GET /api/v1/applications/[id]
 * Protected endpoint - Get application by ID
 * TODO: Add authentication - admins can see all, users can see their own
 */
export const GET = withErrorHandler(
  async (req: NextRequest, context: RouteContext) => {
    const { id } = context.params;

    if (!id) {
      return errorResponse("Application ID is required", { status: 400 });
    }

    const application = await getApplicationById(id);

    if (!application) {
      return errorResponse("Application not found", { status: 404 });
    }

    return successResponse(application);
  }
);

/**
 * PATCH /api/v1/applications/[id]
 * Protected endpoint - Update application (admin only)
 */
export async function PATCH(req: NextRequest, context: RouteContext) {
  return validateRequestWithParams(
    UpdateApplicationRequestSchema,
    ParamsSchema
  )(req, context.params, async (body, params) => {
    // Check if application exists
    const existingApplication = await getApplicationById(params.id);
    if (!existingApplication) {
      return errorResponse("Application not found", { status: 404 });
    }

    // Update application status
    const updatedApplication = await updateApplicationStatus(
      params.id,
      body.status || existingApplication.status,
      body.adminId || null,
      body.reviewNotes
    );

    return successResponse(
      {
        id: updatedApplication.id,
        status: updatedApplication.status,
        reviewNotes: updatedApplication.reviewNotes,
        updatedAt: updatedApplication.updatedAt.toISOString(),
      },
      {
        message: "Application updated successfully",
      }
    );
  });
}

/**
 * DELETE /api/v1/applications/[id]
 * Protected endpoint - Delete application (admin only)
 */
export const DELETE = withErrorHandler(
  async (req: NextRequest, context: RouteContext) => {
    const { id } = context.params;

    if (!id) {
      return errorResponse("Application ID is required", { status: 400 });
    }

    // Fetch application to get file paths before deletion
    const existingApplication = await getApplicationById(id);
    if (!existingApplication) {
      return errorResponse("Application not found", { status: 404 });
    }

    // Collect all file paths to delete
    const filesToDelete: string[] = [];

    if (existingApplication.resumeFile) {
      filesToDelete.push(
        extractFilePathFromUrl(existingApplication.resumeFile)
      );
    }
    if (existingApplication.diplomaFile) {
      filesToDelete.push(
        extractFilePathFromUrl(existingApplication.diplomaFile)
      );
    }
    if (existingApplication.torFile) {
      filesToDelete.push(extractFilePathFromUrl(existingApplication.torFile));
    }

    // Delete application from database
    await deleteApplication(id);

    // Delete physical files from filesystem
    if (filesToDelete.length > 0) {
      const deleteResult = await deleteFiles(filesToDelete);
      console.log(
        `Deleted application ${id}: ${deleteResult.success} files removed, ${deleteResult.failed} files failed`
      );
    }

    return successResponse(
      { id, filesDeleted: filesToDelete.length },
      {
        message: "Application deleted successfully",
      }
    );
  }
);
