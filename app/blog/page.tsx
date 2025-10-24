"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  coverImage: string;
  author: string;
  readTime: string;
  publishedAt: string | null;
  createdAt: string;
}

const categories = [
  "All",
  "Teaching",
  "Visas",
  "Relocation",
  "Career Tips",
  "Interviews",
  "Culture",
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Fetch only published posts for public blog page
      const response = await fetch("/api/v1/blog?status=PUBLISHED");

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

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const categoryMap: Record<string, string> = {
      All: "ALL",
      Teaching: "TEACHING",
      Visas: "VISAS",
      Relocation: "RELOCATION",
      "Career Tips": "CAREER_TIPS",
      Interviews: "INTERVIEWS",
      Culture: "CULTURE",
    };

    const matchesCategory =
      selectedCategory === "All" ||
      post.category === categoryMap[selectedCategory];
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: string | null) => {
    if (!date) return "Draft";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, " ");
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <section className='bg-muted/50 py-20'>
        <div className='container max-w-4xl text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            Resources & Insights
          </h1>
          <p className='text-xl text-muted-foreground mb-8'>
            Expert advice and practical guides for your international career
            journey
          </p>

          {/* Search Bar */}
          <div className='relative max-w-md mx-auto'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              type='text'
              placeholder='Search articles...'
              className='pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className='container py-8'>
        <div className='flex flex-wrap gap-2 justify-center'>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className='container pb-24'>
        {loading ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground text-lg'>Loading articles...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground text-lg'>
              No articles found matching your search.
            </p>
          </div>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredPosts.map((post) => (
              <Card
                key={post.slug}
                className='overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full'
              >
                {/* Image */}
                <div className='relative h-48 w-full overflow-hidden'>
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className='object-cover transition-transform hover:scale-105 duration-300'
                  />
                  <div className='absolute top-3 right-3'>
                    <Badge className='bg-primary text-primary-foreground'>
                      {formatCategory(post.category)}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <CardContent className='p-6 flex-1 flex flex-col'>
                  <div className='flex items-center gap-4 text-sm text-muted-foreground mb-3'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='h-4 w-4' />
                      <span>
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </div>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h2 className='text-xl font-bold mb-3 line-clamp-2'>
                    {post.title}
                  </h2>

                  <p className='text-muted-foreground mb-4 line-clamp-3 flex-1'>
                    {post.excerpt}
                  </p>

                  <div className='flex items-center justify-between pt-4 border-t'>
                    <span className='text-sm text-muted-foreground'>
                      By {post.author}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className='text-primary font-semibold hover:underline inline-flex items-center group'
                    >
                      Read
                      <ArrowRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-1' />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className='bg-muted/50 py-16'>
        <div className='container text-center max-w-2xl'>
          <h2 className='text-3xl font-bold mb-4'>
            Ready to Start Your Journey?
          </h2>
          <p className='text-lg text-muted-foreground mb-8'>
            Get personalized guidance for your international career. Our team is
            here to help you every step of the way.
          </p>
          <Button size='lg' asChild>
            <Link href='/apply'>
              Apply Now
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
