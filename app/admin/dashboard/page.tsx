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
  Plus,
  Users,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  BookOpen,
  Edit,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Calendar,
  ExternalLink,
  Trash2,
} from "lucide-react";
import Link from "next/link";

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
  jobs: {
    total: number;
    active: number;
    inactive: number;
    totalApplications: number;
  };
}

interface RecentApplication {
  id: string;
  fullName: string;
  email: string;
  status: string;
  createdAt: string;
  job?: {
    title: string;
  };
}

interface RecentBlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

interface RecentJob {
  id: string;
  title: string;
  companyName: string;
  location: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    applications: number;
  };
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    applications: { total: 0, pending: 0, reviewed: 0, rejected: 0 },
    blog: { total: 0, published: 0, draft: 0, archived: 0 },
    jobs: { total: 0, active: 0, inactive: 0, totalApplications: 0 },
  });
  const [recentApplications, setRecentApplications] = useState<
    RecentApplication[]
  >([]);
  const [recentBlogPosts, setRecentBlogPosts] = useState<RecentBlogPost[]>([]);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch applications
      const appsResponse = await fetch("/api/v1/applications");
      if (appsResponse.ok) {
        const appsData = await appsResponse.json();
        const applications = appsData.data || [];
        const appStats = {
          total: applications.length,
          pending: applications.filter((app: any) => app.status === "PENDING")
            .length,
          reviewed: applications.filter(
            (app: any) =>
              app.status === "REVIEWING" || app.status === "APPROVED"
          ).length,
          rejected: applications.filter((app: any) => app.status === "REJECTED")
            .length,
        };
        setStats((prev) => ({ ...prev, applications: appStats }));
        setRecentApplications(applications.slice(0, 5));
      }

      // Fetch all blog posts for stats
      const blogResponse = await fetch("/api/v1/blog");
      if (blogResponse.ok) {
        const blogData = await blogResponse.json();
        const blogPosts = blogData.posts || [];
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
      }

      // Fetch recent published blog posts separately
      const recentBlogResponse = await fetch(
        "/api/v1/blog?status=PUBLISHED&limit=5"
      );
      if (recentBlogResponse.ok) {
        const recentBlogData = await recentBlogResponse.json();
        setRecentBlogPosts(recentBlogData.posts || []);
      }

      // Fetch job vacancies
      const jobsResponse = await fetch("/api/v1/jobs/admin/all");
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        const jobs = jobsData.data || [];
        const jobStats = {
          total: jobs.length,
          active: jobs.filter((job: any) => job.isActive).length,
          inactive: jobs.filter((job: any) => !job.isActive).length,
          totalApplications: jobs.reduce(
            (sum: number, job: any) => sum + (job._count?.applications || 0),
            0
          ),
        };
        setStats((prev) => ({ ...prev, jobs: jobStats }));
        setRecentJobs(jobs.slice(0, 5));
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

  const handleQuickEdit = (postId: string) => {
    router.push(`/admin/blog/${postId}/edit`);
  };

  const handleViewPost = (slug: string) => {
    window.open(`/blog/${slug}`, "_blank");
  };

  const handleDeletePost = async (postId: string, postTitle: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${postTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/blog/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh dashboard data
        fetchDashboardData();
      } else {
        alert("Failed to delete blog post. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
      alert("An error occurred while deleting the blog post.");
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Header */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
              Admin Dashboard
            </h1>
            <p className='text-muted-foreground mt-2 text-lg'>
              Welcome back! Manage your applications, blog content, and job
              postings
            </p>
          </div>
          <Button
            variant='outline'
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className='gap-2'
          >
            <LogOut className='h-4 w-4' />
            Sign Out
          </Button>
        </div>

        {/* Main Management Cards */}
        <div className='grid gap-6 md:grid-cols-3'>
          {/* Applications Management Card */}
          <Card className='border-2 hover:border-primary/50 transition-colors'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <div className='p-3 rounded-lg bg-blue-500/10'>
                  <Users className='h-6 w-6 text-blue-500' />
                </div>
                <Badge variant='secondary' className='text-xs'>
                  {stats.applications.pending} Pending
                </Badge>
              </div>
              <CardTitle className='text-2xl mt-4'>Applications</CardTitle>
              <CardDescription>
                Review and manage job applications
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-3 gap-2 text-center'>
                <div>
                  <div className='text-2xl font-bold'>
                    {stats.applications.total}
                  </div>
                  <div className='text-xs text-muted-foreground'>Total</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-green-600'>
                    {stats.applications.reviewed}
                  </div>
                  <div className='text-xs text-muted-foreground'>Reviewed</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-red-600'>
                    {stats.applications.rejected}
                  </div>
                  <div className='text-xs text-muted-foreground'>Rejected</div>
                </div>
              </div>
              <Button
                className='w-full'
                onClick={() => router.push("/admin/applications")}
              >
                View All Applications
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </CardContent>
          </Card>

          {/* Blog Management Card */}
          <Card className='border-2 hover:border-primary/50 transition-colors'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <div className='p-3 rounded-lg bg-purple-500/10'>
                  <BookOpen className='h-6 w-6 text-purple-500' />
                </div>
                <Badge variant='secondary' className='text-xs'>
                  {stats.blog.draft} Drafts
                </Badge>
              </div>
              <CardTitle className='text-2xl mt-4'>Blog Posts</CardTitle>
              <CardDescription>Create and manage blog content</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-3 gap-2 text-center'>
                <div>
                  <div className='text-2xl font-bold'>{stats.blog.total}</div>
                  <div className='text-xs text-muted-foreground'>Total</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-green-600'>
                    {stats.blog.published}
                  </div>
                  <div className='text-xs text-muted-foreground'>Published</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-gray-600'>
                    {stats.blog.archived}
                  </div>
                  <div className='text-xs text-muted-foreground'>Archived</div>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button
                  className='flex-1'
                  onClick={() => router.push("/admin/blog/new")}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  New Post
                </Button>
                <Button
                  variant='outline'
                  onClick={() => router.push("/admin/blog")}
                >
                  <Edit className='h-4 w-4' />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Job Vacancies Management Card */}
          <Card className='border-2 hover:border-primary/50 transition-colors'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <div className='p-3 rounded-lg bg-green-500/10'>
                  <Briefcase className='h-6 w-6 text-green-500' />
                </div>
                <Badge variant='secondary' className='text-xs'>
                  {stats.jobs.active} Active
                </Badge>
              </div>
              <CardTitle className='text-2xl mt-4'>Job Vacancies</CardTitle>
              <CardDescription>Post and manage job openings</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-3 gap-2 text-center'>
                <div>
                  <div className='text-2xl font-bold'>{stats.jobs.total}</div>
                  <div className='text-xs text-muted-foreground'>Total</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-blue-600'>
                    {stats.jobs.totalApplications}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Applications
                  </div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-gray-600'>
                    {stats.jobs.inactive}
                  </div>
                  <div className='text-xs text-muted-foreground'>Inactive</div>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button
                  className='flex-1'
                  onClick={() => router.push("/admin/jobs/new")}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  New Job
                </Button>
                <Button
                  variant='outline'
                  onClick={() => router.push("/admin/jobs")}
                >
                  <Edit className='h-4 w-4' />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Recent Applications */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <div>
                <CardTitle className='text-lg'>Recent Applications</CardTitle>
                <CardDescription className='text-xs'>
                  Latest submissions
                </CardDescription>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => router.push("/admin/applications")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className='text-center py-8 text-muted-foreground'>
                  <Clock className='h-8 w-8 mx-auto mb-2 animate-spin' />
                  Loading...
                </div>
              ) : recentApplications.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>
                  <FileText className='h-12 w-12 mx-auto mb-2 opacity-50' />
                  <p className='text-sm'>No applications yet</p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {recentApplications.map((app) => (
                    <Link
                      key={app.id}
                      href={`/admin/applications`}
                      className='flex items-start justify-between p-3 hover:bg-muted rounded-lg transition-colors group'
                    >
                      <div className='flex-1 min-w-0'>
                        <div className='font-semibold truncate group-hover:text-primary transition-colors'>
                          {app.fullName}
                        </div>
                        <div className='text-xs text-muted-foreground truncate'>
                          {app.email}
                        </div>
                        {app.job && (
                          <div className='text-xs text-muted-foreground mt-1'>
                            <Briefcase className='h-3 w-3 inline mr-1' />
                            {app.job.title}
                          </div>
                        )}
                      </div>
                      <div className='flex flex-col items-end gap-1 ml-2'>
                        {getStatusBadge(app.status)}
                        <div className='text-xs text-muted-foreground whitespace-nowrap'>
                          {formatDate(app.createdAt)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Blog Posts */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <div>
                <CardTitle className='text-lg'>Published Blog Posts</CardTitle>
                <CardDescription className='text-xs'>
                  Latest published content
                </CardDescription>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => router.push("/admin/blog")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className='text-center py-8 text-muted-foreground'>
                  <Clock className='h-8 w-8 mx-auto mb-2 animate-spin' />
                  Loading...
                </div>
              ) : recentBlogPosts.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>
                  <BookOpen className='h-12 w-12 mx-auto mb-2 opacity-50' />
                  <p className='text-sm mb-3'>No published posts yet</p>
                  <Button
                    size='sm'
                    onClick={() => router.push("/admin/blog/new")}
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Create First Post
                  </Button>
                </div>
              ) : (
                <div className='space-y-3'>
                  {recentBlogPosts.map((post) => (
                    <div
                      key={post.id}
                      className='flex flex-col gap-2 p-3 hover:bg-muted rounded-lg transition-colors group border'
                    >
                      <div className='flex items-start justify-between gap-2'>
                        <div className='flex-1 min-w-0'>
                          <div className='font-semibold group-hover:text-primary transition-colors line-clamp-2 leading-snug'>
                            {post.title}
                          </div>
                        </div>
                        <div className='flex items-center gap-1 flex-shrink-0'>
                          {getStatusBadge(post.status)}
                        </div>
                      </div>
                      <div className='flex items-center justify-between gap-2'>
                        <div className='text-xs text-muted-foreground'>
                          {post.category.replace(/_/g, " ")} • Published{" "}
                          {formatDate(post.publishedAt || post.createdAt)}
                        </div>
                        <div className='flex items-center gap-1 flex-shrink-0'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-7 w-7 p-0'
                            onClick={() => handleViewPost(post.slug)}
                            title='View post'
                          >
                            <ExternalLink className='h-3.5 w-3.5' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-7 w-7 p-0'
                            onClick={() => handleQuickEdit(post.id)}
                            title='Edit post'
                          >
                            <Edit className='h-3.5 w-3.5' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-7 w-7 p-0 text-destructive hover:text-destructive'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePost(post.id, post.title);
                            }}
                            title='Delete post'
                          >
                            <Trash2 className='h-3.5 w-3.5' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Job Vacancies */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div>
              <CardTitle className='text-lg'>Job Vacancies</CardTitle>
              <CardDescription className='text-xs'>
                Active and recent job postings
              </CardDescription>
            </div>
            <div className='flex gap-2'>
              <Button size='sm' onClick={() => router.push("/admin/jobs/new")}>
                <Plus className='mr-2 h-4 w-4' />
                New Job
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => router.push("/admin/jobs")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='text-center py-8 text-muted-foreground'>
                <Clock className='h-8 w-8 mx-auto mb-2 animate-spin' />
                Loading...
              </div>
            ) : recentJobs.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <Briefcase className='h-12 w-12 mx-auto mb-2 opacity-50' />
                <p className='text-sm mb-3'>No job postings yet</p>
                <Button
                  size='sm'
                  onClick={() => router.push("/admin/jobs/new")}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Create First Job
                </Button>
              </div>
            ) : (
              <div className='grid gap-3 md:grid-cols-2'>
                {recentJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/admin/jobs/${job.id}`}
                    className='flex items-start justify-between p-4 border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-all group'
                  >
                    <div className='flex-1 min-w-0'>
                      <div className='font-semibold truncate group-hover:text-primary transition-colors flex items-center gap-2'>
                        {job.title}
                        <Badge
                          variant={job.isActive ? "default" : "secondary"}
                          className='text-xs'
                        >
                          {job.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className='text-xs text-muted-foreground mt-1'>
                        {job.companyName} • {job.location}
                      </div>
                      <div className='flex items-center gap-3 mt-2 text-xs text-muted-foreground'>
                        <span className='flex items-center gap-1'>
                          <Users className='h-3 w-3' />
                          {job._count.applications} applications
                        </span>
                        <span className='flex items-center gap-1'>
                          <Calendar className='h-3 w-3' />
                          {formatDate(job.createdAt)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className='h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-2 flex-shrink-0' />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
