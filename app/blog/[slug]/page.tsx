import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Calendar, Clock, Eye } from "lucide-react";
import { MasonryGallery } from "@/components/ui/masonry-gallery";
import { sanitizeHtml } from "@/lib/sanitize-html";
import prisma from "@/lib/db/prisma";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
  };
}

async function getBlogPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      authorAdmin: {
        select: {
          name: true,
          email: true,
        },
      },
      media: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  // Increment view count
  if (post) {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
  }

  return post;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

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

  return (
    <main className='container mx-auto px-4 py-8 max-w-4xl'>
      {/* Header */}
      <div className='mb-8'>
        <Badge
          className={
            categoryColors[post.category] || "bg-gray-100 text-gray-800"
          }
        >
          {post.category.replace(/_/g, " ")}
        </Badge>

        <h1 className='text-4xl md:text-5xl font-bold mt-4 mb-6'>
          {post.title}
        </h1>

        <p className='text-xl text-muted-foreground mb-6'>{post.excerpt}</p>

        {/* Meta Info */}
        <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground'>
          <div className='flex items-center gap-2'>
            <Avatar className='h-10 w-10'>
              <div className='bg-primary text-primary-foreground h-full w-full flex items-center justify-center'>
                {post.author[0]}
              </div>
            </Avatar>
            <span className='font-medium'>{post.author}</span>
          </div>

          <div className='flex items-center gap-1'>
            <Calendar className='h-4 w-4' />
            <span>
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
            </span>
          </div>

          <div className='flex items-center gap-1'>
            <Clock className='h-4 w-4' />
            <span>{post.readTime}</span>
          </div>

          <div className='flex items-center gap-1'>
            <Eye className='h-4 w-4' />
            <span>{post.views} views</span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className='mb-8 rounded-lg overflow-hidden relative h-[400px]'>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className='object-cover'
            priority
          />
        </div>
      )}

      {/* Content */}
      <article className='prose prose-lg dark:prose-invert max-w-none'>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
      </article>

      {/* Media Gallery */}
      {post.media && post.media.length > 0 && (
        <MasonryGallery media={post.media} initialDisplayCount={6} />
      )}

      {/* Footer */}
      <div className='mt-12 pt-8 border-t'>
        <div className='flex flex-wrap gap-2'>
          <span className='text-sm text-muted-foreground'>Last updated:</span>
          <span className='text-sm font-medium'>
            {new Date(post.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </main>
  );
}
