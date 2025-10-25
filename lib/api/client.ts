/**
 * Type-Safe API Client
 * Provides type-safe methods for all API endpoints
 */

import {
  type GetApplicationsQuery,
  type GetApplicationsResponse,
  type GetApplicationResponse,
  type CreateApplicationRequest,
  type CreateApplicationResponse,
  type UpdateApplicationRequest,
  type UpdateApplicationResponse,
  type DeleteApplicationResponse,
} from "./contracts/applications";

import {
  type GetBlogPostsQuery,
  type GetBlogPostsResponse,
  type GetBlogPostResponse,
  type CreateBlogPostRequest,
  type CreateBlogPostResponse,
  type UpdateBlogPostRequest,
  type UpdateBlogPostResponse,
  type DeleteBlogPostResponse,
} from "./contracts/blog";

import {
  type GetJobsQuery,
  type GetJobsResponse,
  type GetJobResponse,
  type CreateJobRequest,
  type CreateJobResponse,
  type UpdateJobRequest,
  type UpdateJobResponse,
  type DeleteJobResponse,
} from "./contracts/jobs";

// ============================================================================
// Custom API Error Class
// ============================================================================

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: any) {
    super(message);
    this.name = "ApiError";
  }
}

// ============================================================================
// Base API Client
// ============================================================================

class BaseApiClient {
  private baseUrl: string;

  constructor(baseUrl = "/api/v1") {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic request method with error handling
   */
  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          response.status,
          data.error || "Request failed",
          data.details
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError) {
        throw new ApiError(0, "Network error: Unable to connect to server");
      }

      throw new ApiError(
        500,
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }

  /**
   * Build query string from object
   */
  protected buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }
}

// ============================================================================
// Applications API Client
// ============================================================================

class ApplicationsApi extends BaseApiClient {
  /**
   * GET /api/v1/applications - List all applications
   */
  async list(
    query?: Partial<GetApplicationsQuery>
  ): Promise<GetApplicationsResponse> {
    const queryString = query ? this.buildQueryString(query) : "";
    return this.request<GetApplicationsResponse>(`/applications${queryString}`);
  }

  /**
   * GET /api/v1/applications/[id] - Get single application
   */
  async get(id: string): Promise<GetApplicationResponse> {
    return this.request<GetApplicationResponse>(`/applications/${id}`);
  }

  /**
   * POST /api/v1/applications - Create application
   */
  async create(
    data: CreateApplicationRequest
  ): Promise<CreateApplicationResponse> {
    return this.request<CreateApplicationResponse>("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH /api/v1/applications/[id] - Update application
   */
  async update(
    id: string,
    data: UpdateApplicationRequest
  ): Promise<UpdateApplicationResponse> {
    return this.request<UpdateApplicationResponse>(`/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE /api/v1/applications/[id] - Delete application
   */
  async delete(id: string): Promise<DeleteApplicationResponse> {
    return this.request<DeleteApplicationResponse>(`/applications/${id}`, {
      method: "DELETE",
    });
  }
}

// ============================================================================
// Blog API Client
// ============================================================================

class BlogApi extends BaseApiClient {
  /**
   * GET /api/v1/blog - List all blog posts
   */
  async list(
    query?: Partial<GetBlogPostsQuery>
  ): Promise<GetBlogPostsResponse> {
    const queryString = query ? this.buildQueryString(query) : "";
    return this.request<GetBlogPostsResponse>(`/blog${queryString}`);
  }

  /**
   * GET /api/v1/blog/[slug] - Get single blog post by slug
   */
  async getBySlug(slug: string): Promise<GetBlogPostResponse> {
    return this.request<GetBlogPostResponse>(`/blog/${slug}`);
  }

  /**
   * GET /api/v1/blog/[id] - Get single blog post by ID
   */
  async get(id: string): Promise<GetBlogPostResponse> {
    return this.request<GetBlogPostResponse>(`/blog/${id}`);
  }

  /**
   * POST /api/v1/blog - Create blog post
   */
  async create(data: CreateBlogPostRequest): Promise<CreateBlogPostResponse> {
    return this.request<CreateBlogPostResponse>("/blog", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH /api/v1/blog/[id] - Update blog post
   */
  async update(
    id: string,
    data: UpdateBlogPostRequest
  ): Promise<UpdateBlogPostResponse> {
    return this.request<UpdateBlogPostResponse>(`/blog/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE /api/v1/blog/[id] - Delete blog post
   */
  async delete(id: string): Promise<DeleteBlogPostResponse> {
    return this.request<DeleteBlogPostResponse>(`/blog/${id}`, {
      method: "DELETE",
    });
  }
}

// ============================================================================
// Jobs API Client
// ============================================================================

class JobsApi extends BaseApiClient {
  /**
   * GET /api/v1/jobs - List all job vacancies
   */
  async list(query?: Partial<GetJobsQuery>): Promise<GetJobsResponse> {
    const queryString = query ? this.buildQueryString(query) : "";
    return this.request<GetJobsResponse>(`/jobs${queryString}`);
  }

  /**
   * GET /api/v1/jobs/admin/all - List all jobs (admin view)
   */
  async listAll(query?: Partial<GetJobsQuery>): Promise<GetJobsResponse> {
    const queryString = query ? this.buildQueryString(query) : "";
    return this.request<GetJobsResponse>(`/jobs/admin/all${queryString}`);
  }

  /**
   * GET /api/v1/jobs/[id] - Get single job vacancy
   */
  async get(id: string): Promise<GetJobResponse> {
    return this.request<GetJobResponse>(`/jobs/${id}`);
  }

  /**
   * POST /api/v1/jobs - Create job vacancy
   */
  async create(data: CreateJobRequest): Promise<CreateJobResponse> {
    return this.request<CreateJobResponse>("/jobs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH /api/v1/jobs/[id] - Update job vacancy
   */
  async update(id: string, data: UpdateJobRequest): Promise<UpdateJobResponse> {
    return this.request<UpdateJobResponse>(`/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE /api/v1/jobs/[id] - Delete job vacancy
   */
  async delete(id: string): Promise<DeleteJobResponse> {
    return this.request<DeleteJobResponse>(`/jobs/${id}`, {
      method: "DELETE",
    });
  }
}

// ============================================================================
// Main API Client Export
// ============================================================================

class ApiClient {
  public applications: ApplicationsApi;
  public blog: BlogApi;
  public jobs: JobsApi;

  constructor() {
    this.applications = new ApplicationsApi();
    this.blog = new BlogApi();
    this.jobs = new JobsApi();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
