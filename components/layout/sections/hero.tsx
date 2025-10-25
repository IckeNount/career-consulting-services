"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// Organize images into swipeable groups
const IMAGE_GROUPS = [
  [
    {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=800&fit=crop",
      span: "row-span-2",
      alt: "Team collaboration",
    },
    {
      src: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&h=400&fit=crop",
      span: "row-span-1",
      alt: "Professional workspace",
    },
    {
      src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop",
      span: "row-span-1",
      alt: "Students learning",
    },
    {
      src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=400&fit=crop",
      span: "row-span-1",
      alt: "Business meeting",
    },
    {
      src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop",
      span: "row-span-1",
      alt: "Office collaboration",
    },
    {
      src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=800&fit=crop",
      span: "row-span-2",
      alt: "Working together",
    },
  ],
  [
    {
      src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=800&fit=crop",
      span: "row-span-2",
      alt: "Team meeting",
    },
    {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      span: "row-span-1",
      alt: "Brainstorming",
    },
    {
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop",
      span: "row-span-1",
      alt: "Professional portrait",
    },
    {
      src: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=400&fit=crop",
      span: "row-span-1",
      alt: "Teamwork",
    },
    {
      src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
      span: "row-span-1",
      alt: "Office space",
    },
    {
      src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=800&fit=crop",
      span: "row-span-2",
      alt: "Business professional",
    },
  ],
  [
    {
      src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=800&fit=crop",
      span: "row-span-2",
      alt: "Modern workplace",
    },
    {
      src: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=600&h=400&fit=crop",
      span: "row-span-1",
      alt: "Laptop work",
    },
    {
      src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop",
      span: "row-span-1",
      alt: "Coding",
    },
    {
      src: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=600&h=400&fit=crop",
      span: "row-span-1",
      alt: "Workshop",
    },
    {
      src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
      span: "row-span-1",
      alt: "Analysis",
    },
    {
      src: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&h=800&fit=crop",
      span: "row-span-2",
      alt: "Confident professional",
    },
  ],
];

export const HeroSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-swipe functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentGroup((prev) => (prev + 1) % IMAGE_GROUPS.length);
    }, 6000); // Switch groups every 6 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNextGroup = () => {
    setIsAutoPlaying(false);
    setCurrentGroup((prev) => (prev + 1) % IMAGE_GROUPS.length);
  };

  const goToPrevGroup = () => {
    setIsAutoPlaying(false);
    setCurrentGroup(
      (prev) => (prev - 1 + IMAGE_GROUPS.length) % IMAGE_GROUPS.length
    );
  };

  const goToGroup = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentGroup(index);
  };

  return (
    <section className='container w-full'>
      <div className='grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32'>
        <div className='text-center space-y-8'>
          <Badge variant='outline' className='text-sm py-2'>
            <span className='mr-2 text-primary'>
              <Badge>New</Badge>
            </span>
            <span> Explore Our Updated Platform </span>
          </Badge>

          <div className='max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold'>
            <h1>
              Start Your
              <span className='text-transparent px-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text'>
                Career Abroad
              </span>
              with Confidence
            </h1>
          </div>

          <p className='max-w-screen-sm mx-auto text-xl text-muted-foreground'>
            {`Teaching and working opportunities in Thailand, Poland, and Germany, plus full visa and relocation support.`}
          </p>

          <div className='space-y-4 md:space-y-0 md:space-x-4'>
            <Button className='w-5/6 md:w-1/4 font-bold group/arrow'>
              Apply Now
              <ArrowRight className='size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform' />
            </Button>

            <Button
              asChild
              variant='secondary'
              className='w-5/6 md:w-1/4 font-bold'
            >
              <Link
                href='https://github.com/nobruf/shadcn-landing-page.git'
                target='_blank'
              >
                Github respository
              </Link>
            </Button>
          </div>
        </div>

        <div className='relative group/hero mt-14 w-full'>
          <div className='absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl'></div>

          {/* Swipeable Masonry Grid Container */}
          <div className='relative w-full md:w-[1200px] mx-auto overflow-hidden'>
            <div className='relative' style={{ minHeight: "600px" }}>
              {IMAGE_GROUPS.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    groupIndex === currentGroup
                      ? "opacity-100 translate-x-0"
                      : groupIndex < currentGroup
                      ? "opacity-0 -translate-x-full"
                      : "opacity-0 translate-x-full"
                  }`}
                >
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[200px]'>
                    {group.map((image, index) => (
                      <div
                        key={index}
                        className={`${image.span} relative overflow-hidden rounded-lg border-2 border-primary/30 hover:border-primary transition-all duration-500 cursor-pointer group/item`}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                          transform:
                            hoveredIndex === index ? "scale(0.98)" : "scale(1)",
                        }}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className='object-cover transition-transform duration-700 group-hover/item:scale-110'
                          sizes='(max-width: 768px) 50vw, 33vw'
                          priority={groupIndex === 0 && index < 3}
                        />

                        {/* Primary Color Overlay (default state) */}
                        <div className='absolute inset-0 bg-primary/40 mix-blend-color group-hover/item:opacity-0 transition-opacity duration-500'></div>

                        {/* Text Overlay on Hover */}
                        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500'>
                          <div className='absolute bottom-3 left-3 right-3'>
                            <p className='text-white text-sm font-semibold drop-shadow-lg'>
                              {image.alt}
                            </p>
                          </div>
                        </div>

                        {/* Animated glow on hover */}
                        <div className='absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 pointer-events-none'>
                          <div className='absolute inset-0 shadow-[inset_0_0_20px_rgba(var(--primary),0.3)] rounded-lg'></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevGroup}
              className='absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background p-3 rounded-full opacity-0 group-hover/hero:opacity-100 transition-all duration-300 shadow-lg hover:scale-110'
              aria-label='Previous group'
            >
              <ChevronLeft className='w-5 h-5' />
            </button>

            <button
              onClick={goToNextGroup}
              className='absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background p-3 rounded-full opacity-0 group-hover/hero:opacity-100 transition-all duration-300 shadow-lg hover:scale-110'
              aria-label='Next group'
            >
              <ChevronRight className='w-5 h-5' />
            </button>

            {/* Group Indicators */}
            <div className='absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10'>
              {IMAGE_GROUPS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToGroup(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentGroup
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to group ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className='absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg pointer-events-none'></div>
        </div>
      </div>
    </section>
  );
};
