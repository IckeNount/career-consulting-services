# Blog Media Gallery Feature

## Overview

This implementation adds a comprehensive media gallery feature to the blog system with:

- **Masonry Layout**: Beautiful Pinterest-style layout for photos and videos
- **Drag & Drop Upload**: Easy-to-use drag-and-drop interface for uploading media
- **Video Support**: Full support for video formats (MP4, WebM, MOV, OGG)
- **See More Button**: Progressive loading with an expandable gallery
- **Rich Text Editor**: React Quill integration for content editing

## Features Implemented

### 1. Database Schema Updates

- Added `BlogMedia` model to store multiple photos and videos per blog post
- Supports both IMAGE and VIDEO types
- Includes caption support and custom ordering
- Cascade delete when blog post is removed

### 2. Media Upload Component (`components/ui/media-upload.tsx`)

- **Drag & Drop**: Drop files anywhere in the upload zone
- **Multi-file Upload**: Upload multiple files simultaneously
- **File Validation**:
  - Images: PNG, JPG, JPEG, GIF, WebP (max 5MB)
  - Videos: MP4, WebM, OGG, MOV (max 50MB)
- **Preview**: Real-time preview of uploaded images and videos
- **Caption Support**: Add captions to each media item
- **Reordering**: Drag items to reorder them
- **Progress Tracking**: Visual feedback during uploads

### 3. Masonry Gallery Component (`components/ui/masonry-gallery.tsx`)

- **Responsive Layout**: Adapts to screen size (1, 2, or 3 columns)
- **See More Button**: Initially shows 6 items, expandable to show all
- **Lightbox**: Click any media to view in full-screen lightbox
- **Video Playback**: Inline video preview with full controls in lightbox
- **Caption Display**: Hover to see captions on thumbnails

### 4. Blog CMS Integration

Both create and edit pages now include:

- Media gallery upload section
- Support for unlimited media items (default max: 20)
- Drag & drop functionality
- Preview and edit capabilities

### 5. API Endpoints Updated

- **POST /api/v1/blog**: Create blog posts with media
- **PATCH /api/v1/blog/[id]**: Update blog posts and media
- **GET /api/v1/blog/[id]**: Fetch blog posts with media
- **POST /api/v1/upload**: Upload images and videos

## File Structure

```
app/
├── admin/blog/
│   ├── new/page.tsx                 # Create blog with media upload
│   └── [id]/edit/page.tsx           # Edit blog with media management
├── blog/[slug]/page.tsx             # Display blog with masonry gallery
└── api/v1/
    ├── blog/
    │   ├── route.ts                 # Blog CRUD with media support
    │   └── [id]/route.ts            # Single blog operations
    └── upload/route.ts              # File upload (images & videos)

components/ui/
├── media-upload.tsx                 # Drag & drop media uploader
├── masonry-gallery.tsx              # Masonry layout gallery
└── masonry-gallery.css              # Gallery styles

prisma/
└── schema.prisma                    # Updated with BlogMedia model
```

## Usage

### Creating a Blog Post with Media

1. Navigate to `/admin/blog/new`
2. Fill in basic information (title, slug, excerpt, cover image)
3. Write content using the rich text editor
4. In the "Media Gallery" section:
   - Drag and drop images/videos OR click to select files
   - Add captions to any media items
   - Reorder items using arrow buttons
   - Remove unwanted items with the X button
5. Save as draft or publish

### Viewing Media Gallery

On the blog detail page (`/blog/[slug]`):

- Media gallery appears below the blog content
- Shows first 6 items in masonry layout
- Click "See More" to view all items
- Click any item to open lightbox view
- Videos play with full controls in lightbox

## Technical Details

### Database Migration

```bash
npx prisma migrate dev --name add_blog_media
npx prisma generate
```

### Installed Packages

- `react-masonry-css`: Masonry layout
- `react-dropzone`: Drag & drop functionality
- `react-quill`: Rich text editor (already installed)

### Media Types Supported

**Images:**

- JPEG/JPG
- PNG
- WebP
- GIF
- Max size: 5MB

**Videos:**

- MP4
- WebM
- OGG
- QuickTime (MOV)
- Max size: 50MB

## API Examples

### Create Blog Post with Media

```json
POST /api/v1/blog
{
  "title": "My Blog Post",
  "slug": "my-blog-post",
  "excerpt": "A brief summary",
  "content": "<p>Blog content</p>",
  "coverImage": "/uploads/cover.jpg",
  "category": "TEACHING",
  "status": "PUBLISHED",
  "media": [
    {
      "url": "/uploads/photo1.jpg",
      "type": "IMAGE",
      "caption": "Beautiful sunset",
      "order": 0
    },
    {
      "url": "/uploads/video1.mp4",
      "type": "VIDEO",
      "caption": "Tutorial video",
      "order": 1
    }
  ]
}
```

### Update Media

```json
PATCH /api/v1/blog/[id]
{
  "media": [
    {
      "url": "/uploads/new-photo.jpg",
      "type": "IMAGE",
      "caption": "Updated photo",
      "order": 0
    }
  ]
}
```

## TypeScript Notes

After running migrations, you may need to:

1. Restart your TypeScript server in VS Code
2. Reload your development server: `npm run dev`
3. Clear Next.js cache if needed: `rm -rf .next`

The Prisma Client types will be automatically updated after running `npx prisma generate`.

## Customization

### Change Initial Display Count

In `app/blog/[slug]/page.tsx`:

```tsx
<MasonryGallery media={post.media} initialDisplayCount={8} />
```

### Change Max Upload Files

In blog CMS pages:

```tsx
<MediaUpload value={media} onChange={setMedia} maxFiles={30} />
```

### Customize Masonry Breakpoints

In `components/ui/masonry-gallery.tsx`:

```tsx
const breakpointColumns = {
  default: 4, // 4 columns on large screens
  1100: 3, // 3 columns on medium screens
  700: 2, // 2 columns on tablets
  500: 1, // 1 column on mobile
};
```

## Future Enhancements

Potential improvements:

- [ ] Image optimization/compression before upload
- [ ] Bulk delete/reorder operations
- [ ] Video thumbnail generation
- [ ] Advanced filtering and search in media library
- [ ] Cloud storage integration (AWS S3, Cloudinary)
- [ ] Image editing capabilities
- [ ] Alt text management for accessibility
