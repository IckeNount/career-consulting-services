"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

interface Testimonial {
  id: string;
  name: string;
  title: string;
  comment: string;
  mediaUrl: string | null;
  mediaType: "PHOTO" | "VIDEO" | null;
}

export const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/v1/testimonials?status=PUBLISHED&limit=20");
      const data = await response.json();
      
      if (data.success) {
        setTestimonials(data.testimonials);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="testimonials" className="container py-24 sm:py-32">
        <div className="text-center">
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }

  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="text-center mb-12">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Testimonials
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
          Success Stories From Our Clients
        </h2>
        
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Hear from professionals who&apos;ve successfully started their careers abroad with our support
        </p>
      </div>

      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="relative w-[80%] sm:w-[90%] lg:max-w-screen-xl mx-auto"
      >
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem
              key={testimonial.id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card className="bg-muted/50 dark:bg-card h-full flex flex-col">
                {/* Media Display */}
                {testimonial.mediaUrl && (
                  <div className="relative aspect-video bg-muted overflow-hidden rounded-t-lg">
                    {testimonial.mediaType === "VIDEO" ? (
                      <video
                        src={testimonial.mediaUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={testimonial.mediaUrl}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}

                <CardContent className="pt-6 pb-4 flex-1">
                  <p className="text-muted-foreground italic mb-4">
                    &ldquo;{testimonial.comment}&rdquo;
                  </p>
                </CardContent>

                <CardHeader className="pt-0">
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.title}
                  </p>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};
