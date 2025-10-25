import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Safely deletes a file from the filesystem
 * @param filePath - Relative path from public/ directory or absolute path
 * @returns Promise<boolean> - true if deleted successfully, false otherwise
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    if (!filePath) {
      console.warn("deleteFile: No file path provided");
      return false;
    }

    // Handle both absolute paths and relative paths
    let absolutePath: string;

    if (filePath.startsWith("/")) {
      // Absolute path
      absolutePath = filePath;
    } else if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      // External URL - cannot delete
      console.warn(`deleteFile: Cannot delete external URL: ${filePath}`);
      return false;
    } else {
      // Relative path - assume it's relative to public directory
      absolutePath = join(process.cwd(), "public", filePath);
    }

    // Check if file exists before attempting deletion
    if (!existsSync(absolutePath)) {
      console.warn(`deleteFile: File not found: ${absolutePath}`);
      return false;
    }

    // Delete the file
    await unlink(absolutePath);
    console.log(`✓ Deleted file: ${absolutePath}`);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
}

/**
 * Safely deletes multiple files from the filesystem
 * @param filePaths - Array of file paths (relative or absolute)
 * @returns Promise<{ success: number; failed: number }> - Count of successful and failed deletions
 */
export async function deleteFiles(
  filePaths: (string | null | undefined)[]
): Promise<{ success: number; failed: number }> {
  const results = { success: 0, failed: 0 };

  // Filter out null/undefined values
  const validPaths = filePaths.filter(
    (path): path is string => path != null && path.length > 0
  );

  if (validPaths.length === 0) {
    console.warn("deleteFiles: No valid file paths provided");
    return results;
  }

  // Delete files in parallel
  const deletePromises = validPaths.map(async (filePath) => {
    const deleted = await deleteFile(filePath);
    if (deleted) {
      results.success++;
    } else {
      results.failed++;
    }
  });

  await Promise.all(deletePromises);

  console.log(
    `File deletion summary: ${results.success} succeeded, ${results.failed} failed`
  );

  return results;
}

/**
 * Extracts file path from a URL or returns the path as-is
 * Useful for handling URLs stored in database that need to be converted to file paths
 * @param urlOrPath - URL string like "/uploads/image.jpg" or full URL
 * @returns string - Path relative to public directory
 */
export function extractFilePathFromUrl(urlOrPath: string): string {
  try {
    // If it's a full URL, extract the pathname
    if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
      const url = new URL(urlOrPath);
      return url.pathname;
    }

    // Already a path - remove leading slash if present for consistency
    return urlOrPath.startsWith("/") ? urlOrPath.substring(1) : urlOrPath;
  } catch (error) {
    console.error(`Error extracting path from URL ${urlOrPath}:`, error);
    return urlOrPath;
  }
}
