# Testimonials API Documentation

## Base URL
```
/api/v1/testimonials
```

## Authentication
All write operations (POST, PATCH, DELETE) require admin authentication via NextAuth session.

---

## Endpoints

### 1. Upload Testimonial Media
Upload photo or video for testimonials.

**Endpoint:** `POST /api/v1/upload/testimonials`

**Content-Type:** `multipart/form-data`

**Authentication:** Not required (handled in form)

**Request Body:**
```typescript
{
  file: File // Image (JPG, PNG, WebP, GIF) or Video (MP4, WebM, MOV)
}
```

**File Limits:**
- Images: Max 5MB
- Videos: Max 20MB

**Response:** `200 OK`
```json
{
  "url": "/uploads/testimonials/1729858756-testimonial.mp4",
  "mediaType": "VIDEO",
  "thumbnailUrl": null,
  "message": "File uploaded successfully"
}
```

**Error Responses:**
- `400` - No file provided / Invalid file type / File too large
- `500` - Upload failed

---

### 2. List Testimonials
Get paginated list of testimonials with optional filtering.

**Endpoint:** `GET /api/v1/testimonials`

**Authentication:** Not required for published testimonials

**Query Parameters:**
```typescript
{
  page?: string      // Default: "1"
  limit?: string     // Default: "20", Max: 50
  status?: string    // "DRAFT" | "PUBLISHED" | "ARCHIVED" | "all"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "testimonials": [
    {
      "id": "clx123abc",
      "name": "John Doe",
      "title": "English Teacher",
      "comment": "Amazing experience working abroad...",
      "rating": 5.0,
      "mediaUrl": "/uploads/testimonials/video.mp4",
      "mediaType": "VIDEO",
      "thumbnailUrl": "/uploads/testimonials/thumb.jpg",
      "status": "PUBLISHED",
      "order": 0,
      "publishedAt": "2025-10-20T10:00:00.000Z",
      "createdAt": "2025-10-18T08:00:00.000Z",
      "updatedAt": "2025-10-20T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

**Example Requests:**
```bash
# Get published testimonials (public)
GET /api/v1/testimonials?status=PUBLISHED

# Get all testimonials (admin)
GET /api/v1/testimonials?status=all&limit=50

# Get page 2
GET /api/v1/testimonials?page=2&limit=10
```

---

### 3. Get Single Testimonial
Retrieve a specific testimonial by ID.

**Endpoint:** `GET /api/v1/testimonials/[id]`

**Authentication:** Not required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "clx123abc",
    "name": "John Doe",
    "title": "English Teacher",
    "comment": "Amazing experience...",
    "rating": 5.0,
    "mediaUrl": "/uploads/testimonials/video.mp4",
    "mediaType": "VIDEO",
    "thumbnailUrl": "/uploads/testimonials/thumb.jpg",
    "status": "PUBLISHED",
    "order": 0,
    "publishedAt": "2025-10-20T10:00:00.000Z",
    "createdAt": "2025-10-18T08:00:00.000Z",
    "updatedAt": "2025-10-20T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `404` - Testimonial not found
- `500` - Server error

---

### 4. Create Testimonial
Create a new testimonial (Admin only).

**Endpoint:** `POST /api/v1/testimonials`

**Authentication:** Required (Admin session)

**Request Body:**
```json
{
  "name": "John Doe",
  "title": "English Teacher",
  "comment": "Working abroad was an amazing experience that changed my life...",
  "rating": 5.0,
  "mediaUrl": "/uploads/testimonials/1729858756-video.mp4",
  "mediaType": "VIDEO",
  "thumbnailUrl": "/uploads/testimonials/1729858756-thumb.jpg",
  "status": "PUBLISHED",
  "order": 0,
  "publishedAt": "2025-10-25T10:00:00.000Z"
}
```

**Required Fields:**
- `name` (min: 2, max: 100 characters)
- `title` (min: 2, max: 100 characters)
- `comment` (min: 10, max: 1000 characters)

**Optional Fields:**
- `rating` (0-5, default: 5.0)
- `mediaUrl` (URL string or null)
- `mediaType` ("PHOTO" | "VIDEO" | null)
- `thumbnailUrl` (URL string or null)
- `status` ("DRAFT" | "PUBLISHED" | "ARCHIVED", default: "DRAFT")
- `order` (integer >= 0, default: 0)
- `publishedAt` (ISO date string)

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "clx123abc",
    "name": "John Doe",
    "title": "English Teacher",
    "comment": "Working abroad was an amazing experience...",
    "rating": 5.0,
    "mediaUrl": "/uploads/testimonials/video.mp4",
    "mediaType": "VIDEO",
    "thumbnailUrl": "/uploads/testimonials/thumb.jpg",
    "status": "PUBLISHED",
    "order": 0,
    "publishedAt": "2025-10-25T10:00:00.000Z",
    "createdAt": "2025-10-25T09:00:00.000Z",
    "updatedAt": "2025-10-25T09:00:00.000Z"
  },
  "message": "Testimonial created successfully"
}
```

**Error Responses:**
- `400` - Invalid request data / Validation errors
- `401` - Unauthorized (no session)
- `403` - Admin user not found
- `500` - Server error

---

### 5. Update Testimonial
Update an existing testimonial (Admin only).

**Endpoint:** `PATCH /api/v1/testimonials/[id]`

**Authentication:** Required (Admin session)

**Request Body:** (All fields optional)
```json
{
  "name": "John Doe Updated",
  "title": "Senior English Teacher",
  "comment": "Updated comment...",
  "rating": 4.8,
  "mediaUrl": "/uploads/testimonials/new-video.mp4",
  "mediaType": "VIDEO",
  "thumbnailUrl": "/uploads/testimonials/new-thumb.jpg",
  "status": "PUBLISHED",
  "order": 1
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "clx123abc",
    "name": "John Doe Updated",
    "title": "Senior English Teacher",
    // ... updated fields
  },
  "message": "Testimonial updated successfully"
}
```

**Error Responses:**
- `400` - Invalid request data
- `401` - Unauthorized
- `404` - Testimonial not found
- `500` - Server error

---

### 6. Delete Testimonial
Delete a testimonial and its associated media files (Admin only).

**Endpoint:** `DELETE /api/v1/testimonials/[id]`

**Authentication:** Required (Admin session)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "clx123abc"
  },
  "message": "Testimonial deleted successfully"
}
```

**Note:** This endpoint will:
1. Delete the testimonial record from the database
2. Delete associated media files from `/public/uploads/testimonials/`
3. Delete associated thumbnail files

**Error Responses:**
- `401` - Unauthorized
- `404` - Testimonial not found
- `500` - Server error

---

## Data Models

### Testimonial
```typescript
interface Testimonial {
  id: string;
  name: string;
  title: string;
  comment: string;
  rating: number;
  mediaUrl: string | null;
  mediaType: "PHOTO" | "VIDEO" | null;
  thumbnailUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  order: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

## Usage Examples

### Frontend Integration

#### Fetching Published Testimonials
```typescript
const response = await fetch('/api/v1/testimonials?status=PUBLISHED&limit=6');
const { testimonials } = await response.json();
```

#### Admin Creating Testimonial
```typescript
// 1. Upload media first
const formData = new FormData();
formData.append('file', videoFile);

const uploadResponse = await fetch('/api/v1/upload/testimonials', {
  method: 'POST',
  body: formData,
});
const { url, mediaType } = await uploadResponse.json();

// 2. Create testimonial with media URL
const testimonialData = {
  name: "Jane Smith",
  title: "ESL Teacher",
  comment: "Great experience!",
  rating: 5,
  mediaUrl: url,
  mediaType: mediaType,
  status: "PUBLISHED",
};

const createResponse = await fetch('/api/v1/testimonials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testimonialData),
});
```

---

## CI/CD Pipeline Alignment

This API follows the same patterns as existing endpoints:
- ✅ Type-safe contracts with Zod validation (`lib/api/contracts/testimonials.ts`)
- ✅ Consistent response format (`{ success, data, message }`)
- ✅ NextAuth session-based authentication
- ✅ File cleanup utilities for media deletion
- ✅ Proper error handling and status codes
- ✅ Database operations via Prisma ORM
- ✅ RESTful naming conventions

### Testing Checklist
- [ ] Upload media files (photos & videos)
- [ ] Create testimonials with validation
- [ ] List testimonials with pagination
- [ ] Update testimonials
- [ ] Delete testimonials (verify file cleanup)
- [ ] Test authentication on protected routes
- [ ] Verify file size limits
- [ ] Test invalid file types rejection
