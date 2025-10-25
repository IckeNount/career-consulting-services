import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "English Teacher in Thailand",
    comment:
      "KTECCS made my dream of teaching abroad a reality! From visa assistance to job placement, everything was handled professionally. I've been teaching in Bangkok for 2 years now and couldn't be happier.",
    rating: 5.0,
    status: "PUBLISHED",
    order: 1,
    publishedAt: new Date("2025-01-15"),
  },
  {
    name: "Michael Chen",
    title: "Software Engineer in Germany",
    comment:
      "The relocation support was outstanding. KTECCS helped me navigate the Blue Card process and even assisted with apartment hunting. Within 3 months, I was settled in Berlin with a great job.",
    rating: 5.0,
    status: "PUBLISHED",
    order: 2,
    publishedAt: new Date("2025-02-20"),
  },
  {
    name: "Emma Rodriguez",
    title: "ESL Teacher in Poland",
    comment:
      "I was nervous about moving to Europe, but KTECCS supported me every step of the way. The cultural training and visa guidance were invaluable. Krakow has become my second home!",
    rating: 4.8,
    status: "PUBLISHED",
    order: 3,
    publishedAt: new Date("2025-03-10"),
  },
  {
    name: "David Park",
    title: "International Business Consultant",
    comment:
      "Professional, efficient, and genuinely caring. KTECCS didn't just help me find a job—they helped me start a new chapter in my life. Highly recommend their services!",
    rating: 5.0,
    status: "PUBLISHED",
    order: 4,
    publishedAt: new Date("2025-04-05"),
  },
  {
    name: "Lisa Thompson",
    title: "University Lecturer in Germany",
    comment:
      "The attention to detail was impressive. From contract review to housing recommendations, KTECCS covered everything. My transition to teaching in Munich was seamless.",
    rating: 4.9,
    status: "PUBLISHED",
    order: 5,
    publishedAt: new Date("2025-05-12"),
  },
  {
    name: "James Wilson",
    title: "Teacher Trainer in Thailand",
    comment:
      "After 3 years working with KTECCS, I can confidently say they're the best in the business. They've helped me advance my career and provided ongoing support throughout my journey.",
    rating: 5.0,
    status: "PUBLISHED",
    order: 6,
    publishedAt: new Date("2025-06-18"),
  },
  {
    name: "Anna Kowalski",
    title: "Marketing Manager in Poland",
    comment:
      "The job opportunities presented were exactly what I was looking for. KTECCS understood my career goals and matched me with a perfect position in Warsaw. Forever grateful!",
    rating: 4.7,
    status: "PUBLISHED",
    order: 7,
    publishedAt: new Date("2025-07-22"),
  },
  {
    name: "Robert Kim",
    title: "Data Analyst in Germany",
    comment:
      "KTECCS turned what could have been a stressful process into an exciting adventure. Their expertise in German work visas saved me months of hassle. Thank you for everything!",
    rating: 5.0,
    status: "PUBLISHED",
    order: 8,
    publishedAt: new Date("2025-08-30"),
  },
];

async function seedTestimonials() {
  console.log("🌱 Seeding testimonials...");

  try {
    // Clear existing testimonials
    const deleteResult = await prisma.testimonial.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.count} existing testimonials`);

    // Create new testimonials
    const createdTestimonials = await Promise.all(
      testimonials.map((testimonial) =>
        prisma.testimonial.create({
          data: testimonial,
        })
      )
    );

    console.log(`✅ Created ${createdTestimonials.length} testimonials`);
    console.log("\n📊 Testimonials Summary:");
    createdTestimonials.forEach((t) => {
      console.log(`   - ${t.name} (${t.title}) - Rating: ${t.rating}`);
    });
  } catch (error) {
    console.error("❌ Error seeding testimonials:", error);
    throw error;
  }
}

// Run the seed function
seedTestimonials()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
