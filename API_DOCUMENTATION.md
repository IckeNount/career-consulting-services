# API Documentation

## Base URL

```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

## API Version: v1

All API endpoints are prefixed with `/api/v1`

---

## 📋 Endpoints Overview

| Method | Endpoint               | Access | Description            |
| ------ | ---------------------- | ------ | ---------------------- |
| GET    | `/health`              | Public | Health check           |
| POST   | `/v1/applications`     | Public | Submit new application |
| GET    | `/v1/applications`     | Admin  | List all applications  |
| GET    | `/v1/applications/:id` | Auth   | Get single application |
| PATCH  | `/v1/applications/:id` | Admin  | Update application     |
| DELETE | `/v1/applications/:id` | Admin  | Delete application     |
| GET    | `/v1/analytics`        | Admin  | Dashboard analytics    |

---

## 🔐 Authentication

Currently, the API has placeholders for authentication. Implement one of:

- NextAuth.js
- Clerk
- Custom JWT

Protected endpoints are marked with TODO comments for adding auth checks.

---

## 📝 API Endpoints

### 1. Health Check

Check API and database status.

**Endpoint:** `GET /api/health`

**Access:** Public

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-10-21T10:30:00.000Z",
    "database": "connected",
    "version": "1.0.0"
  }
}
```

---

### 2. Submit Application

Submit a new career application.

**Endpoint:** `POST /api/v1/applications`

**Access:** Public

**Rate Limit:** 5 requests per 15 minutes per IP

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "nationality": "United States",
  "currentLocation": "New York, USA",
  "desiredCountry": "Germany",
  "desiredPosition": "Software Engineer",
  "yearsExperience": 5,
  "currentSalary": 70000,
  "expectedSalary": 80000,
  "educationLevel": "BACHELOR",
  "resumeUrl": "https://example.com/resume.pdf",
  "coverLetterUrl": "https://example.com/cover.pdf",
  "portfolioUrl": "https://example.com/portfolio",
  "skills": ["JavaScript", "React", "Node.js", "TypeScript"],
  "languages": [
    { "language": "English", "proficiency": "NATIVE" },
    { "language": "German", "proficiency": "INTERMEDIATE" }
  ],
  "notes": "Additional information here..."
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "clxxx123456",
    "email": "john.doe@example.com",
    "message": "Application submitted successfully. You will receive a confirmation email shortly."
  },
  "message": "Application created successfully"
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

**Error Response (429):**

```json
{
  "success": false,
  "error": "Too many applications submitted. Please try again later."
}
```

---

### 3. List Applications

Get all applications with filtering, searching, and pagination.

**Endpoint:** `GET /api/v1/applications`

**Access:** Admin only

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| pageSize | number | 25 | Items per page (max 100) |
| status | string | - | Filter by status (PENDING, REVIEWING, APPROVED, REJECTED) |
| search | string | - | Search in name, email, position, country |
| sortBy | string | createdAt | Sort field (createdAt, firstName, lastName, desiredCountry) |
| sortOrder | string | desc | Sort order (asc, desc) |

**Example Request:**

```
GET /api/v1/applications?page=1&pageSize=25&status=PENDING&search=engineer&sortBy=createdAt&sortOrder=desc
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx123456",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "status": "PENDING",
      "desiredCountry": "Germany",
      "desiredPosition": "Software Engineer",
      "createdAt": "2025-10-21T10:00:00.000Z",
      "languages": [...],
      "reviewer": null
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pageSize": 25,
    "totalPages": 4
  }
}
```

---

### 4. Get Application by ID

Retrieve a single application by ID.

**Endpoint:** `GET /api/v1/applications/:id`

**Access:** Authenticated (Admin can see all, users can see their own)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "clxxx123456",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "nationality": "United States",
    "currentLocation": "New York, USA",
    "desiredCountry": "Germany",
    "desiredPosition": "Software Engineer",
    "yearsExperience": 5,
    "currentSalary": "70000",
    "expectedSalary": "80000",
    "educationLevel": "BACHELOR",
    "resumeUrl": "https://example.com/resume.pdf",
    "status": "PENDING",
    "skills": ["JavaScript", "React", "Node.js"],
    "languages": [
      {
        "id": "clyyy123",
        "language": "English",
        "proficiency": "NATIVE"
      }
    ],
    "statusHistory": [
      {
        "id": "clzzz123",
        "status": "PENDING",
        "changedAt": "2025-10-21T10:00:00.000Z",
        "changedBy": "SYSTEM",
        "notes": "Application submitted",
        "admin": {
          "id": "admin123",
          "name": "System",
          "email": "system@example.com"
        }
      }
    ],
    "reviewer": null,
    "reviewNotes": null,
    "createdAt": "2025-10-21T10:00:00.000Z",
    "updatedAt": "2025-10-21T10:00:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": "Application not found"
}
```

---

### 5. Update Application

Update application status and review notes.

**Endpoint:** `PATCH /api/v1/applications/:id`

**Access:** Admin only

**Request Body:**

```json
{
  "status": "APPROVED",
  "reviewNotes": "Excellent candidate. Proceed to next stage."
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "clxxx123456",
    "status": "APPROVED",
    "reviewNotes": "Excellent candidate. Proceed to next stage.",
    "updatedAt": "2025-10-21T11:00:00.000Z",
    ...
  },
  "message": "Application updated successfully"
}
```

---

### 6. Delete Application

Delete an application permanently.

**Endpoint:** `DELETE /api/v1/applications/:id`

**Access:** Admin only

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "clxxx123456"
  },
  "message": "Application deleted successfully"
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": "Application not found"
}
```

---

### 7. Get Analytics

Get dashboard analytics and statistics.

**Endpoint:** `GET /api/v1/analytics`

**Access:** Admin only

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| days | number | 30 | Days for time-series data |

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalApplications": 150,
      "pendingApplications": 45,
      "reviewingApplications": 30,
      "approvedApplications": 60,
      "rejectedApplications": 15,
      "applicationsTodayCount": 5,
      "applicationsThisWeekCount": 25,
      "applicationsThisMonthCount": 80
    },
    "charts": {
      "applicationsByCountry": [
        { "country": "Germany", "count": 45 },
        { "country": "Canada", "count": 30 },
        { "country": "Australia", "count": 25 }
      ],
      "applicationsByPosition": [
        { "position": "Software Engineer", "count": 60 },
        { "position": "Data Analyst", "count": 35 },
        { "position": "Product Manager", "count": 25 }
      ],
      "applicationsOverTime": [
        { "date": "2025-10-15", "count": 8 },
        { "date": "2025-10-16", "count": 12 },
        { "date": "2025-10-17", "count": 10 }
      ]
    },
    "trends": {
      "conversionRate": 40.0,
      "growthRate": 12.5
    }
  }
}
```

---

## 🔧 Error Handling

All errors follow a consistent format:

**Validation Error (400):**

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "fieldName",
      "message": "Error message"
    }
  ]
}
```

**Unauthorized (401):**

```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**Forbidden (403):**

```json
{
  "success": false,
  "error": "Forbidden"
}
```

**Not Found (404):**

```json
{
  "success": false,
  "error": "Resource not found"
}
```

**Conflict (409):**

```json
{
  "success": false,
  "error": "A record with this information already exists"
}
```

**Rate Limit (429):**

```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

**Server Error (500):**

```json
{
  "success": false,
  "error": "An unexpected error occurred"
}
```

---

## 📊 Data Models

### Application Status

- `PENDING` - Newly submitted
- `REVIEWING` - Under review by admin
- `APPROVED` - Accepted for processing
- `REJECTED` - Not suitable

### Education Level

- `HIGH_SCHOOL`
- `ASSOCIATE`
- `BACHELOR`
- `MASTER`
- `DOCTORATE`
- `OTHER`

### Language Proficiency

- `BASIC` - Can understand simple phrases
- `INTERMEDIATE` - Can hold conversations
- `ADVANCED` - Fluent in most situations
- `NATIVE` - Native speaker

---

## 🧪 Testing the API

### Using cURL

**Submit Application:**

```bash
curl -X POST http://localhost:3000/api/v1/applications \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-15",
    "nationality": "United States",
    "currentLocation": "New York",
    "desiredCountry": "Germany",
    "desiredPosition": "Software Engineer",
    "yearsExperience": 5,
    "expectedSalary": 80000,
    "educationLevel": "BACHELOR",
    "resumeUrl": "https://example.com/resume.pdf",
    "skills": ["JavaScript", "React"],
    "languages": [
      {"language": "English", "proficiency": "NATIVE"}
    ]
  }'
```

**Get Applications:**

```bash
curl http://localhost:3000/api/v1/applications?page=1&pageSize=10
```

**Health Check:**

```bash
curl http://localhost:3000/api/health
```

### Using JavaScript/Fetch

```javascript
// Submit application
const response = await fetch("/api/v1/applications", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    // ... other fields
  }),
});

const data = await response.json();
```

---

## 🚀 Next Steps

1. **Add Authentication:**

   - Uncomment TODO sections in route handlers
   - Implement NextAuth.js or Clerk
   - Protect admin endpoints

2. **Add Email Notifications:**

   - Install Resend or SendGrid
   - Create email templates
   - Send confirmation emails

3. **Add File Upload:**

   - Implement UploadThing or AWS S3
   - Handle file uploads for resume/documents
   - Virus scanning

4. **Add Rate Limiting:**

   - Implement Redis-based rate limiting
   - Add API keys for external access
   - Monitor usage

5. **Add Audit Logging:**
   - Uncomment audit log calls
   - Track all admin actions
   - IP and user agent logging

---

## 📚 Additional Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Validation](https://zod.dev/)
