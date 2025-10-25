# API Contracts & Validation Middleware Guide

## 🎯 What We Built

A **type-safe API architecture** that prevents frontend/backend mismatches by using:

- ✅ **API Contracts** (Zod schemas as single source of truth)
- ✅ **Validation Middleware** (automatic request/response validation)
- ✅ **Type-Safe API Client** (no more raw fetch calls)

---

## 📁 Project Structure

```
lib/api/
├── contracts/           # API Contracts (Zod schemas)
│   ├── applications.ts  # Application endpoint contracts
│   ├── blog.ts         # Blog endpoint contracts
│   └── jobs.ts         # Job vacancy endpoint contracts
├── middleware/
│   └── validate.ts     # Validation middleware functions
└── client.ts           # Type-safe API client
```

---

## 🔧 How It Works

### 1. Define API Contract (Zod Schema)

```typescript
// lib/api/contracts/applications.ts
export const UpdateApplicationRequestSchema = z.object({
  status: ApplicationStatusSchema.optional(),
  reviewNotes: z.string().max(1000).optional(),
  adminId: z.string().optional().nullable(),
});

export const UpdateApplicationResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    status: ApplicationStatusSchema,
    reviewNotes: z.string().nullable(),
    updatedAt: z.string(),
  }),
  message: z.string().optional(),
});

// Export TypeScript types
export type UpdateApplicationRequest = z.infer<
  typeof UpdateApplicationRequestSchema
>;
export type UpdateApplicationResponse = z.infer<
  typeof UpdateApplicationResponseSchema
>;
```

### 2. Use Validation in API Route

```typescript
// app/api/v1/applications/[id]/route.ts
import { UpdateApplicationRequestSchema } from "@/lib/api/contracts/applications";
import {
  validateRequestWithParams,
  successResponse,
  errorResponse,
} from "@/lib/api/middleware/validate";

export async function PATCH(req: NextRequest, context: RouteContext) {
  return validateRequestWithParams(
    UpdateApplicationRequestSchema,
    ParamsSchema
  )(req, context.params, async (body, params) => {
    // ✅ body is fully typed and validated!
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
```

### 3. Use Type-Safe Client in Frontend

```typescript
// app/admin/applications/page.tsx
import { apiClient, ApiError } from "@/lib/api/client";

const updateApplicationStatus = async (
  applicationId: string,
  newStatus: ApplicationStatus,
  notes?: string
) => {
  try {
    // ✅ Fully type-safe - TypeScript knows the request/response types!
    await apiClient.applications.update(applicationId, {
      status: newStatus,
      reviewNotes: notes,
    });

    await fetchApplications();
  } catch (err) {
    if (err instanceof ApiError) {
      alert(`Failed: ${err.message} (Status: ${err.status})`);
    }
  }
};
```

---

## ✨ Benefits

### Before (Old Way)

```typescript
// ❌ No type safety
const response = await fetch(`/api/v1/applications/${id}`, {
  method: "PATCH",
  body: JSON.stringify({ status: "APPROVED" }), // Typo? Who knows!
});

// ❌ No validation - 500 errors in production
// ❌ Manual error handling
// ❌ Easy to break when API changes
```

### After (New Way)

```typescript
// ✅ Full type safety
await apiClient.applications.update(id, {
  status: "APPROVED", // TypeScript autocomplete!
});

// ✅ Automatic validation (400 errors with details)
// ✅ Standardized error handling
// ✅ Breaking changes caught at compile time
```

---

## 📋 Adding a New Endpoint

### Step 1: Define Contract

```typescript
// lib/api/contracts/yourResource.ts
export const CreateResourceRequestSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().optional(),
});

export const CreateResourceResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.string(),
  }),
});

export type CreateResourceRequest = z.infer<typeof CreateResourceRequestSchema>;
export type CreateResourceResponse = z.infer<
  typeof CreateResourceResponseSchema
>;
```

### Step 2: Create API Route with Validation

```typescript
// app/api/v1/resources/route.ts
import { CreateResourceRequestSchema } from "@/lib/api/contracts/yourResource";
import {
  validateRequestBody,
  successResponse,
} from "@/lib/api/middleware/validate";

export async function POST(req: NextRequest) {
  return validateRequestBody(CreateResourceRequestSchema)(req, async (data) => {
    const resource = await createResource(data);
    return successResponse(resource, { message: "Resource created" });
  });
}
```

### Step 3: Add to API Client

```typescript
// lib/api/client.ts
class ResourcesApi extends BaseApiClient {
  async create(data: CreateResourceRequest): Promise<CreateResourceResponse> {
    return this.request<CreateResourceResponse>("/resources", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

class ApiClient {
  public resources: ResourcesApi;

  constructor() {
    this.resources = new ResourcesApi();
  }
}
```

### Step 4: Use in Frontend

```typescript
// components/CreateResourceForm.tsx
import { apiClient } from "@/lib/api/client";

const handleSubmit = async (data) => {
  try {
    const result = await apiClient.resources.create(data);
    console.log("Created:", result.data);
  } catch (err) {
    if (err instanceof ApiError) {
      alert(err.message);
    }
  }
};
```

---

## 🛡️ Validation Middleware API

### `validateRequestBody(schema)`

For POST/PATCH requests with body validation.

```typescript
export async function POST(req: NextRequest) {
  return validateRequestBody(CreateSchema)(req, async (data) => {
    // data is validated and typed
    return successResponse(await create(data));
  });
}
```

### `validateQueryParams(schema)`

For GET requests with query parameters.

```typescript
export async function GET(req: NextRequest) {
  return validateQueryParams(QuerySchema)(req, async (query) => {
    // query params are validated
    return successResponse(await list(query));
  });
}
```

### `validateRequestWithParams(bodySchema, paramsSchema)`

For PATCH/DELETE with both body and path params.

```typescript
export async function PATCH(req: NextRequest, context) {
  return validateRequestWithParams(UpdateSchema, ParamsSchema)(
    req,
    context.params,
    async (body, params) => {
      return successResponse(await update(params.id, body));
    }
  );
}
```

### `withErrorHandler(handler)`

Wraps any handler with automatic error catching.

```typescript
export const GET = withErrorHandler(async (req) => {
  const data = await fetchData();
  return successResponse(data);
});
```

---

## 🎨 Response Helpers

### Success Response

```typescript
return successResponse(data, {
  message: "Operation successful",
  status: 201, // optional, defaults to 200
});

// Returns:
// {
//   "success": true,
//   "data": {...},
//   "message": "Operation successful"
// }
```

### Error Response

```typescript
return errorResponse("Resource not found", {
  status: 404,
  details: { field: "id", reason: "invalid" },
});

// Returns:
// {
//   "success": false,
//   "error": "Resource not found",
//   "details": {...}
// }
```

---

## 🔍 Error Handling

### Backend Errors (Automatic)

```typescript
// Validation errors (400)
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address",
      "code": "invalid_string"
    }
  ]
}

// Server errors (500)
{
  "success": false,
  "error": "Internal server error"
}
```

### Frontend Error Handling

```typescript
try {
  await apiClient.applications.update(id, data);
} catch (err) {
  if (err instanceof ApiError) {
    console.log(err.status); // HTTP status code
    console.log(err.message); // Error message
    console.log(err.details); // Additional details (if any)
  }
}
```

---

## 🚀 Next Steps

1. ✅ **Test the Implementation**

   - Try updating an application status
   - Try sending invalid data
   - Verify error messages are helpful

2. **Extend to Other Endpoints**

   - Apply same pattern to blog routes
   - Apply to job vacancy routes
   - Update all frontend fetch calls

3. **Add Tests** (Optional but Recommended)

   ```typescript
   import { UpdateApplicationRequestSchema } from "@/lib/api/contracts/applications";

   describe("Application Contracts", () => {
     it("validates correct update request", () => {
       const validData = { status: "APPROVED", reviewNotes: "Great!" };
       expect(() =>
         UpdateApplicationRequestSchema.parse(validData)
       ).not.toThrow();
     });

     it("rejects invalid status", () => {
       const invalidData = { status: "INVALID_STATUS" };
       expect(() =>
         UpdateApplicationRequestSchema.parse(invalidData)
       ).toThrow();
     });
   });
   ```

4. **Add Pre-commit Hooks**
   ```bash
   npm install -D husky lint-staged
   npx husky install
   ```

---

## 💡 Pro Tips

1. **Always update contracts first** - Change schemas before changing routes
2. **Use Zod refinements** for complex validation:

   ```typescript
   z.object({
     password: z.string().min(8),
     confirmPassword: z.string(),
   }).refine((data) => data.password === data.confirmPassword, {
     message: "Passwords must match",
     path: ["confirmPassword"],
   });
   ```

3. **Reuse common schemas**:

   ```typescript
   const IdParamSchema = z.object({ id: z.string().cuid() });
   // Use across all [id] routes
   ```

4. **Document with JSDoc**:
   ```typescript
   /**
    * Updates an application's status and review notes
    * @param id - Application ID
    * @param data - Status and optional review notes
    * @returns Updated application data
    * @throws ApiError if application not found or validation fails
    */
   async update(id: string, data: UpdateApplicationRequest) {
     // ...
   }
   ```

---

## 📊 Current Status

✅ **Completed:**

- API contracts for applications, blog, jobs
- Validation middleware
- Type-safe API client
- Applications PATCH endpoint updated
- Applications frontend updated

🔄 **To Do:**

- Update remaining API routes (blog, jobs)
- Update dashboard frontend
- Add tests
- Add CI/CD checks

---

## 🐛 Troubleshooting

### "Type X is not assignable to Y"

- Check that contract schemas match your actual data
- Use `Partial<T>` for optional query params
- Verify Zod `.optional()` placement

### "Validation failed" errors

- Check Zod error details for specific field issues
- Use `.passthrough()` on schemas if you need to allow extra fields
- Verify transformations (dates, numbers) match input format

### API client type errors

- Restart TypeScript server in VSCode
- Check that contracts are properly exported
- Verify API client imports correct types

---

Built with ❤️ to prevent production bugs!
