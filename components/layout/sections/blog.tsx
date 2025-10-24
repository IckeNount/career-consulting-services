"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useEffect, useState } from "react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  coverImage: string;
  publishedAt: string | null;
  createdAt: string;
}

export const BlogSection = () => {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Fetch only published posts for homepage
      const response = await fetch("/api/v1/blog?limit=6&status=PUBLISHED");

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

  const formatDate = (date: string | null, createdAt: string) => {
    const dateToFormat = date || createdAt;
    return new Date(dateToFormat).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, " ");
  };

  return (
    <section id='blog' className='container py-24 sm:py-32'>
      {/* Section Label -> Headline -> Subtext */}
      <div className='text-center mb-12'>
        <h2 className='text-lg text-primary mb-2 tracking-wider'>
          Read the Stories
        </h2>
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>
          Learn from Others Just Like You
        </h2>
        <p className='text-xl text-muted-foreground md:w-1/2 mx-auto'>
          Tips, vlogs, and honest advice from teachers and workers who’ve been
          where you&apos;re going.
        </p>
      </div>

      {/* Auto-playing Carousel */}
      <div className='relative px-12'>
        {loading ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Loading blog posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              No blog posts available yet.
            </p>
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
            className='w-full'
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {posts.map((post) => (
                <CarouselItem
                  key={post.slug}
                  className='md:basis-1/2 lg:basis-1/3'
                >
                  <Card className='overflow-hidden hover:shadow-lg transition-shadow h-full'>
                    {/* Image Thumbnail */}
                    <div className='relative h-48 w-full overflow-hidden'>
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className='object-cover transition-transform hover:scale-105 duration-300'
                      />
                      <div className='absolute top-3 right-3'>
                        <span className='bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold'>
                          {formatCategory(post.category)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className='p-6'>
                      <p className='text-sm text-muted-foreground mb-3'>
                        {formatDate(post.publishedAt, post.createdAt)}
                      </p>
                      <h3 className='text-xl font-bold mb-3 line-clamp-2'>
                        {post.title}
                      </h3>
                      <p className='text-muted-foreground mb-4 line-clamp-3'>
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className='text-primary font-semibold hover:underline inline-flex items-center group'
                      >
                        Read More
                        <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                      </Link>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='hidden md:flex' />
            <CarouselNext className='hidden md:flex' />
          </Carousel>
        )}
      </div>

      {/* CTA Button */}
      <div className='text-center mt-12'>
        <Button size='lg' asChild>
          <Link href='/blog'>
            Start Exploring
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
      </div>
    </section>
  );
};
