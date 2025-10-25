import { OurServicesSection } from "@/components/layout/sections/our-services";
import { JobVacancySection } from "@/components/layout/sections/job-vacancy";
import { ContactSection } from "@/components/layout/sections/contact";
import { FAQSection } from "@/components/layout/sections/faq";
import { WhyChooseUsSection } from "@/components/layout/sections/why-choose-us";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { WhoWeHelpSection } from "@/components/layout/sections/who-we-help";
import { TeamSection } from "@/components/layout/sections/team";
import { TestimonialSection } from "@/components/layout/sections/testimonial";
import { BlogSection } from "@/components/layout/sections/blog";

export const metadata = {
  title: "Shadcn - Landing template",
  description: "Free Shadcn landing page for developers",
  openGraph: {
    type: "website",
    url: "https://github.com/nobruf/shadcn-landing-page.git",
    title: "Shadcn - Landing template",
    description: "Free Shadcn landing page for developers",
    images: [
      {
        url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
        width: 1200,
        height: 630,
        alt: "Shadcn - Landing template",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://github.com/nobruf/shadcn-landing-page.git",
    title: "Shadcn - Landing template",
    description: "Free Shadcn landing page for developers",
    images: [
      "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
    ],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <OurServicesSection />
      <WhyChooseUsSection />
      <WhoWeHelpSection />
      <TestimonialSection />
      <BlogSection />
      <TeamSection />
      <JobVacancySection />
      <ContactSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
