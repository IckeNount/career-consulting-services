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
  Eye,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Home,
} from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  status: string;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  author: string;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, statusFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      // Always request all statuses for admin view
      if (statusFilter === "all") params.append("status", "all");

      const response = await fetch(`/api/v1/blog?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const response = await fetch(`/api/v1/blog/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPosts();
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post");
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    try {
      const response = await fetch(`/api/v1/blog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchPosts();
      } else {
        alert("Failed to update post status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryColors: Record<string, string> = {
    TEACHING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    VISAS:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    RELOCATION:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    CAREER_TIPS:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    INTERVIEWS: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    CULTURE:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    PUBLISHED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    ARCHIVED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <Button
            variant='ghost'
            onClick={() => router.push("/admin/dashboard")}
            className='mb-4 -ml-4'
          >
            <Home className='mr-2 h-4 w-4' />
            Back to Dashboard
          </Button>
          <h1 className='text-4xl font-bold'>Blog Management</h1>
          <p className='text-muted-foreground mt-2'>
            Create and manage blog posts
          </p>
        </div>
        <Button onClick={() => router.push("/admin/blog/new")}>
          <Plus className='mr-2 h-4 w-4' />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <div className='flex flex-col md:flex-row gap-4 mb-6'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search posts...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className='w-full md:w-[200px]'>
            <SelectValue placeholder='Category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Categories</SelectItem>
            <SelectItem value='TEACHING'>Teaching</SelectItem>
            <SelectItem value='VISAS'>Visas</SelectItem>
            <SelectItem value='RELOCATION'>Relocation</SelectItem>
            <SelectItem value='CAREER_TIPS'>Career Tips</SelectItem>
            <SelectItem value='INTERVIEWS'>Interviews</SelectItem>
            <SelectItem value='CULTURE'>Culture</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-full md:w-[200px]'>
            <SelectValue placeholder='Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Status</SelectItem>
            <SelectItem value='DRAFT'>Draft</SelectItem>
            <SelectItem value='PUBLISHED'>Published</SelectItem>
            <SelectItem value='ARCHIVED'>Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className='text-center py-12'>Loading...</div>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center'>
            <FileText className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-semibold mb-2'>No blog posts found</h3>
            <p className='text-muted-foreground mb-4'>
              Get started by creating your first blog post
            </p>
            <Button onClick={() => router.push("/admin/blog/new")}>
              <Plus className='mr-2 h-4 w-4' />
              Create Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-6'>
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <div className='flex gap-2 mb-2'>
                      <Badge className={categoryColors[post.category]}>
                        {post.category.replace(/_/g, " ")}
                      </Badge>
                      <Badge className={statusColors[post.status]}>
                        {post.status}
                      </Badge>
                    </div>
                    <CardTitle className='text-2xl mb-2'>
                      {post.title}
                    </CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </div>
                  <div className='flex gap-2 ml-4'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => router.push(`/blog/${post.slug}`)}
                      title='View'
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
                      title='Edit'
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => handleDelete(post.id)}
                      title='Delete'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <Calendar className='h-4 w-4' />
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className='flex items-center gap-1'>
                    <Eye className='h-4 w-4' />
                    {post.views} views
                  </div>
                  <div>By {post.author}</div>
                </div>
                <div className='mt-4'>
                  <Button
                    variant={
                      post.status === "PUBLISHED" ? "secondary" : "default"
                    }
                    onClick={() => handleStatusToggle(post.id, post.status)}
                  >
                    {post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
