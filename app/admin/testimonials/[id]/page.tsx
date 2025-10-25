"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowLeft, Save, Video, Image as ImageIcon } from "lucide-react";

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const testimonialId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    comment: "",
    rating: 5.0,
    mediaUrl: "",
    mediaType: null as "PHOTO" | "VIDEO" | null,
    thumbnailUrl: "",
    status: "DRAFT",
    order: 0,
  });

  useEffect(() => {
    fetchTestimonial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonialId]);

  const fetchTestimonial = async () => {
    try {
      const response = await fetch(`/api/v1/testimonials/${testimonialId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch testimonial");
      }

      const { data } = await response.json();
      setFormData({
        name: data.name,
        title: data.title,
        comment: data.comment,
        rating: data.rating,
        mediaUrl: data.mediaUrl || "",
        mediaType: data.mediaType,
        thumbnailUrl: data.thumbnailUrl || "",
        status: data.status,
        order: data.order,
      });
    } catch (error) {
      alert("Failed to load testimonial");
      router.push("/admin/testimonials");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/v1/upload/testimonials", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const { url, mediaType } = await response.json();
      
      handleInputChange("mediaUrl", url);
      handleInputChange("mediaType", mediaType);
      
      alert("Media uploaded successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to upload media");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      alert("Please enter a name");
      return;
    }

    if (!formData.title.trim()) {
      alert("Please enter a title/role");
      return;
    }

    if (!formData.comment.trim()) {
      alert("Please enter a comment");
      return;
    }

    if (formData.comment.length < 10) {
      alert("Comment must be at least 10 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/v1/testimonials/${testimonialId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update testimonial");
      }

      alert("Testimonial updated successfully!");
      router.push("/admin/testimonials");
    } catch (error: any) {
      alert(error.message || "Failed to update testimonial");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading testimonial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/admin/testimonials")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Testimonial</h1>
          <p className="text-muted-foreground">Update testimonial details</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Client details and testimonial content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Client Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="title">Job Title / Role *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="English Teacher"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="comment">Testimonial Comment *</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                placeholder="Share the client's experience..."
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.comment.length} / 1000 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) =>
                    handleInputChange("rating", parseFloat(e.target.value))
                  }
                />
              </div>

              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) =>
                    handleInputChange("order", parseInt(e.target.value))
                  }
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
            <CardDescription>
              Upload a photo or video (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="media">Upload Photo/Video</Label>
              <div className="mt-2">
                <Input
                  id="media"
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  disabled={uploading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Images: JPG, PNG, WebP, GIF (max 5MB) • Videos: MP4, WebM, MOV (max 20MB)
                </p>
              </div>
            </div>

            {uploading && (
              <div className="text-sm text-muted-foreground">
                Uploading media...
              </div>
            )}

            {formData.mediaUrl && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {formData.mediaType === "VIDEO" ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {formData.mediaType} Uploaded
                  </span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.mediaUrl}
                  alt="Preview"
                  className="max-w-full h-auto max-h-64 rounded"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    handleInputChange("mediaUrl", "");
                    handleInputChange("mediaType", null);
                  }}
                >
                  Remove Media
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/testimonials")}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
