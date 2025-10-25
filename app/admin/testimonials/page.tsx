"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Home,
  Video,
  Image as ImageIcon,
  Star,
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  title: string;
  comment: string;
  rating: number;
  mediaUrl: string | null;
  mediaType: "PHOTO" | "VIDEO" | null;
  status: string;
  order: number;
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      // Always request all statuses for admin view
      if (statusFilter === "all") params.append("status", "all");
      params.append("limit", "50");

      const response = await fetch(`/api/v1/testimonials?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
      }

      const data = await response.json();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const response = await fetch(`/api/v1/testimonials/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTestimonials();
      } else {
        alert("Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Error deleting testimonial");
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial) =>
    searchQuery
      ? testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        testimonial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        testimonial.comment.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      PUBLISHED: "default",
      DRAFT: "secondary",
      ARCHIVED: "outline",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>{status}</Badge>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Testimonials Management</h1>
          <p className="text-muted-foreground">
            Manage client testimonials with photos and videos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button onClick={() => router.push("/admin/testimonials/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Testimonial
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter testimonials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search testimonials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={fetchTestimonials}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No testimonials found</p>
            <Button onClick={() => router.push("/admin/testimonials/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Testimonial
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="flex flex-col">
              {/* Media Preview */}
              {testimonial.mediaUrl && (
                <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                  {testimonial.mediaType === "VIDEO" ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <Video className="w-12 h-12 text-white" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <ImageIcon className="w-12 h-12 text-white" />
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={testimonial.mediaUrl}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {testimonial.name}
                    </CardTitle>
                    <CardDescription className="truncate">
                      {testimonial.title}
                    </CardDescription>
                  </div>
                  {getStatusBadge(testimonial.status)}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  &ldquo;{testimonial.comment}&rdquo;
                </p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{testimonial.rating.toFixed(1)}</span>
                  <span className="mx-2">•</span>
                  <span>Order: {testimonial.order}</span>
                  {testimonial.mediaType && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="flex items-center gap-1">
                        {testimonial.mediaType === "VIDEO" ? (
                          <>
                            <Video className="w-3 h-3" />
                            Video
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-3 h-3" />
                            Photo
                          </>
                        )}
                      </span>
                    </>
                  )}
                </div>

                <div className="text-xs text-muted-foreground mb-4">
                  {testimonial.publishedAt ? (
                    <span>
                      Published:{" "}
                      {new Date(testimonial.publishedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span>
                      Created: {new Date(testimonial.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/admin/testimonials/${testimonial.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(testimonial.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <Card className="mt-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Total: {filteredTestimonials.length} testimonial(s)
            </span>
            <div className="flex gap-4 text-muted-foreground">
              <span>
                Published:{" "}
                {testimonials.filter((t) => t.status === "PUBLISHED").length}
              </span>
              <span>
                Draft: {testimonials.filter((t) => t.status === "DRAFT").length}
              </span>
              <span>
                Archived:{" "}
                {testimonials.filter((t) => t.status === "ARCHIVED").length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
