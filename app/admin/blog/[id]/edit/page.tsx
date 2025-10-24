"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/v1/blog/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          coverImage: data.coverImage || "",
          category: data.category || "TEACHING",
          status: data.status || "DRAFT",
          author: data.author || "KTECCS Team",
          readTime: data.readTime || "5 min read",
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
        });
        // Load media if it exists
        if (data.media && Array.isArray(data.media)) {
          setMedia(
            data.media.map((item: any) => ({
              id: item.id,
              url: item.url,
              type: item.type,
              caption: item.caption || "",
            }))
          );
        }
      } else {
        alert("Failed to fetch blog post");
        router.push("/admin/blog");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      alert("Error fetching blog post");
      router.push("/admin/blog");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (status?: "DRAFT" | "PUBLISHED") => {
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
      const updateData: any = {
        ...formData,
        media: media.map((item, index) => ({
          url: item.url,
          type: item.type,
          caption: item.caption,
          order: index,
        })),
      };

      if (status) {
        updateData.status = status;
      }

      const response = await fetch(`/api/v1/blog/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        router.push("/admin/blog");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update blog post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Error updating blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>Loading...</div>
      </div>
    );
  }

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
        <h1 className='text-4xl font-bold'>Edit Blog Post</h1>
        <p className='text-muted-foreground mt-2'>
          Update the details of your blog post
        </p>
      </div>

      <div className='grid gap-6'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the basic details of your blog post
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
              Edit your blog post content using the rich text editor
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
