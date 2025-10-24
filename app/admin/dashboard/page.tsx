"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  FileText,
  PenSquare,
  Plus,
  Users,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  BookOpen,
  Edit,
  Trash2,
} from "lucide-react";

interface DashboardStats {
  applications: {
    total: number;
    pending: number;
    reviewed: number;
    rejected: number;
  };
  blog: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
}

interface RecentApplication {
  id: string;
  fullName: string;
  email: string;
  status: string;
  createdAt: string;
}

interface RecentBlogPost {
  id: string;
  title: string;
  status: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    applications: { total: 0, pending: 0, reviewed: 0, rejected: 0 },
    blog: { total: 0, published: 0, draft: 0, archived: 0 },
  });
  const [recentApplications, setRecentApplications] = useState<
    RecentApplication[]
  >([]);
  const [recentBlogPosts, setRecentBlogPosts] = useState<RecentBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch applications
      const appsResponse = await fetch("/api/v1/applications");
      if (appsResponse.ok) {
        const applications = await appsResponse.json();
        const appStats = {
          total: applications.length,
          pending: applications.filter((app: any) => app.status === "PENDING")
            .length,
          reviewed: applications.filter((app: any) => app.status === "REVIEWED")
            .length,
          rejected: applications.filter((app: any) => app.status === "REJECTED")
            .length,
        };
        setStats((prev) => ({ ...prev, applications: appStats }));
        setRecentApplications(applications.slice(0, 5));
      }

      // Fetch blog posts
      const blogResponse = await fetch("/api/v1/blog");
      if (blogResponse.ok) {
        const blogPosts = await blogResponse.json();
        const blogStats = {
          total: blogPosts.length,
          published: blogPosts.filter(
            (post: any) => post.status === "PUBLISHED"
          ).length,
          draft: blogPosts.filter((post: any) => post.status === "DRAFT")
            .length,
          archived: blogPosts.filter((post: any) => post.status === "ARCHIVED")
            .length,
        };
        setStats((prev) => ({ ...prev, blog: blogStats }));
        setRecentBlogPosts(blogPosts.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { variant: "default" | "secondary" | "destructive"; icon: any }
    > = {
      PENDING: { variant: "secondary", icon: Clock },
      REVIEWED: { variant: "default", icon: CheckCircle2 },
      REJECTED: { variant: "destructive", icon: XCircle },
      PUBLISHED: { variant: "default", icon: Eye },
      DRAFT: { variant: "secondary", icon: FileText },
      ARCHIVED: { variant: "destructive", icon: XCircle },
    };

    const config = variants[status] || variants.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className='text-xs'>
        <Icon className='mr-1 h-3 w-3' />
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!session) {
    return null;
  }

  return (
    <div className='min-h-screen bg-background p-4 md:p-8'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Header */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold'>Admin Dashboard</h1>
            <p className='text-muted-foreground mt-2'>
              Manage applications and blog content
            </p>
          </div>
          <Button
            variant='outline'
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut className='mr-2 h-4 w-4' />
            Sign Out
          </Button>
        </div>

        {/* Applications Section */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Users className='h-6 w-6' />
              <h2 className='text-2xl font-bold'>Application Management</h2>
            </div>
            <Button
              variant='outline'
              onClick={() => router.push("/admin/applications")}
            >
              View All
            </Button>
          </div>

          {/* Application Stats */}
          <div className='grid gap-4 md:grid-cols-4'>
            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>Total Applications</CardDescription>
                <CardTitle className='text-3xl'>
                  {stats.applications.total}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-xs text-muted-foreground'>
                  All submitted applications
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>Pending Review</CardDescription>
                <CardTitle className='text-3xl text-yellow-600'>
                  {stats.applications.pending}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-xs text-muted-foreground'>
                  Awaiting your review
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>Reviewed</CardDescription>
                <CardTitle className='text-3xl text-green-600'>
                  {stats.applications.reviewed}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-xs text-muted-foreground'>
                  Successfully reviewed
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>Rejected</CardDescription>
                <CardTitle className='text-3xl text-red-600'>
                  {stats.applications.rejected}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-xs text-muted-foreground'>
                  Not a good fit
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                Latest job applications submitted
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className='text-center py-8 text-muted-foreground'>
                  Loading...
                </div>
              ) : recentApplications.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>
                  No applications yet
                </div>
              ) : (
                <div className='space-y-3'>
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className='flex items-center justify-between p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors'
                      onClick={() =>
                        router.push(`/admin/applications?id=${app.id}`)
                      }
                    >
                      <div className='flex-1'>
                        <div className='font-semibold'>{app.fullName}</div>
                        <div className='text-sm text-muted-foreground'>
                          {app.email}
                        </div>
                      </div>
                      <div className='flex items-center gap-4'>
                        <div className='text-xs text-muted-foreground'>
                          {formatDate(app.createdAt)}
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Blog CMS Section */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <BookOpen className='h-6 w-6' />
              <h2 className='text-2xl font-bold'>Blog Content Management</h2>
            </div>
            <div className='flex gap-2'>
              <Button onClick={() => router.push("/admin/blog/new")}>
                <Plus className='mr-2 h-4 w-4' />
                New Post
              </Button>
              <Button
                variant='outline'
                onClick={() => router.push("/admin/blog")}
              >
                Manage All
              </Button>
            </div>
          </div>

          {/* Blog Stats */}
          <div className='grid gap-4 md:grid-cols-4'>
            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>Total Posts</CardDescription>
                <CardTitle className='text-3xl'>{stats.blog.total}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-xs text-muted-foreground'>
                  All blog posts
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>Published</CardDescription>
                <CardTitle className='text-3xl text-green-600'>
                  {stats.blog.published}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-xs text-muted-foreground'>
                  Live on website
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>Drafts</CardDescription>
                <CardTitle className='text-3xl text-yellow-600'>
                  {stats.blog.draft}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-xs text-muted-foreground'>
                  Work in progress
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>Archived</CardDescription>
                <CardTitle className='text-3xl text-gray-600'>
                  {stats.blog.archived}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-xs text-muted-foreground'>
                  Hidden from public
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Blog Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Blog Posts</CardTitle>
              <CardDescription>Latest blog content updates</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className='text-center py-8 text-muted-foreground'>
                  Loading...
                </div>
              ) : recentBlogPosts.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>
                  <BookOpen className='h-12 w-12 mx-auto mb-4 opacity-50' />
                  <p>No blog posts yet</p>
                  <Button
                    className='mt-4'
                    onClick={() => router.push("/admin/blog/new")}
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Create Your First Post
                  </Button>
                </div>
              ) : (
                <div className='space-y-3'>
                  {recentBlogPosts.map((post) => (
                    <div
                      key={post.id}
                      className='flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors'
                    >
                      <div className='flex-1'>
                        <div className='font-semibold'>{post.title}</div>
                        <div className='text-sm text-muted-foreground'>
                          {post.category.replace("_", " ")} • Updated{" "}
                          {formatDate(post.updatedAt)}
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        {getStatusBadge(post.status)}
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() =>
                            router.push(`/admin/blog/${post.id}/edit`)
                          }
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3 md:grid-cols-2'>
              <Button
                variant='outline'
                className='justify-start h-auto py-4'
                onClick={() => router.push("/admin/blog/new")}
              >
                <PenSquare className='mr-3 h-5 w-5' />
                <div className='text-left'>
                  <div className='font-semibold'>Write New Blog Post</div>
                  <div className='text-xs text-muted-foreground'>
                    Create and publish content
                  </div>
                </div>
              </Button>

              <Button
                variant='outline'
                className='justify-start h-auto py-4'
                onClick={() => router.push("/admin/applications")}
              >
                <FileText className='mr-3 h-5 w-5' />
                <div className='text-left'>
                  <div className='font-semibold'>Review Applications</div>
                  <div className='text-xs text-muted-foreground'>
                    Process pending applications
                  </div>
                </div>
              </Button>

              <Button
                variant='outline'
                className='justify-start h-auto py-4'
                onClick={() => router.push("/admin/blog")}
              >
                <BookOpen className='mr-3 h-5 w-5' />
                <div className='text-left'>
                  <div className='font-semibold'>Manage Blog</div>
                  <div className='text-xs text-muted-foreground'>
                    Edit, publish, or archive posts
                  </div>
                </div>
              </Button>

              <Button
                variant='outline'
                className='justify-start h-auto py-4'
                onClick={() => window.open("/blog", "_blank")}
              >
                <Eye className='mr-3 h-5 w-5' />
                <div className='text-left'>
                  <div className='font-semibold'>View Public Blog</div>
                  <div className='text-xs text-muted-foreground'>
                    See live blog page
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
