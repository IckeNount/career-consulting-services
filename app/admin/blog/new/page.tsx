"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { MediaUpload } from "@/components/ui/media-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Eye } from "lucide-react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface MediaItem {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  caption?: string;
}

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "TEACHING",
    status: "DRAFT",
    author: "KTECCS Team",
    readTime: "5 min read",
    metaTitle: "",
    metaDescription: "",
  });
  const [media, setMedia] = useState<MediaItem[]>([]);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["clean"],
    ],
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Auto-generate slug from title only if slug is currently empty
      if (field === "title" && !prev.slug) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }

      return updated;
    });
  };

  const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
    // Validate required fields
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!formData.slug.trim()) {
      alert("Please enter a slug");
      return;
    }

    if (!formData.excerpt.trim()) {
      alert("Please enter an excerpt");
      return;
    }

    if (!formData.content.trim() || formData.content === "<p><br></p>") {
      alert("Please enter content");
      return;
    }

    if (!formData.coverImage.trim()) {
      alert("Please add a cover image");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/v1/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status,
          publishedAt: status === "PUBLISHED" ? new Date().toISOString() : null,
          media: media.map((item, index) => ({
            url: item.url,
            type: item.type,
            caption: item.caption,
            order: index,
          })),
        }),
      });

      if (response.ok) {
        router.push("/admin/blog");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create blog post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-5xl'>
      <div className='mb-8'>
        <Button
          variant='ghost'
          onClick={() => router.push("/admin/blog")}
          className='mb-4'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Blog
        </Button>
        <h1 className='text-4xl font-bold'>Create New Blog Post</h1>
        <p className='text-muted-foreground mt-2'>
          Fill in the details to create a new blog post
        </p>
      </div>

      <div className='grid gap-6'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details of your blog post
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>
                Title <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='title'
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder='Enter blog post title'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='slug'>
                Slug <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='slug'
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder='url-friendly-slug'
              />
              <p className='text-xs text-muted-foreground'>
                URL: /blog/{formData.slug || "your-slug"}
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='excerpt'>
                Excerpt <span className='text-red-500'>*</span>
              </Label>
              <Textarea
                id='excerpt'
                value={formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                placeholder='Brief summary of the blog post'
                rows={3}
              />
            </div>

            <div className='space-y-2'>
              <ImageUpload
                value={formData.coverImage}
                onChange={(url) => handleInputChange("coverImage", url)}
                label='Cover Image'
                required
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='category'>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='TEACHING'>Teaching</SelectItem>
                    <SelectItem value='VISAS'>Visas</SelectItem>
                    <SelectItem value='RELOCATION'>Relocation</SelectItem>
                    <SelectItem value='CAREER_TIPS'>Career Tips</SelectItem>
                    <SelectItem value='INTERVIEWS'>Interviews</SelectItem>
                    <SelectItem value='CULTURE'>Culture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='readTime'>Read Time</Label>
                <Input
                  id='readTime'
                  value={formData.readTime}
                  onChange={(e) =>
                    handleInputChange("readTime", e.target.value)
                  }
                  placeholder='5 min read'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='author'>Author</Label>
              <Input
                id='author'
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder='Author name'
              />
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>
              Write your blog post content using the rich text editor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <Label>
                Content <span className='text-red-500'>*</span>
              </Label>
              <div className='min-h-[400px]'>
                <ReactQuill
                  theme='snow'
                  value={formData.content}
                  onChange={(value) => handleInputChange("content", value)}
                  modules={quillModules}
                  className='h-[350px]'
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>Media Gallery</CardTitle>
            <CardDescription>
              Upload photos and videos to display in a masonry layout on your
              blog post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MediaUpload
              value={media}
              onChange={setMedia}
              label='Photos & Videos'
              maxFiles={20}
            />
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>
              Optimize your blog post for search engines
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='metaTitle'>Meta Title</Label>
              <Input
                id='metaTitle'
                value={formData.metaTitle}
                onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                placeholder='SEO title (optional)'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='metaDescription'>Meta Description</Label>
              <Textarea
                id='metaDescription'
                value={formData.metaDescription}
                onChange={(e) =>
                  handleInputChange("metaDescription", e.target.value)
                }
                placeholder='SEO description (optional)'
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className='flex gap-4 justify-end'>
          <Button
            variant='outline'
            onClick={() => handleSubmit("DRAFT")}
            disabled={loading}
          >
            <Save className='mr-2 h-4 w-4' />
            Save as Draft
          </Button>
          <Button onClick={() => handleSubmit("PUBLISHED")} disabled={loading}>
            <Eye className='mr-2 h-4 w-4' />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
