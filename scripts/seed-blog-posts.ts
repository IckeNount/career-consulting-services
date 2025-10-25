import { PrismaClient, BlogCategory, BlogStatus } from "@prisma/client";

const prisma = new PrismaClient();

const mockBlogPosts = [
  {
    slug: "ultimate-guide-teaching-english-china",
    title: "The Ultimate Guide to Teaching English in China",
    excerpt:
      "Discover everything you need to know about teaching English in China, from visa requirements to salary expectations and cultural insights.",
    content: `# Teaching English in China: Your Complete Guide

China offers incredible opportunities for English teachers looking to immerse themselves in a rich culture while building their career. With competitive salaries, low cost of living, and growing demand for English education, it's no wonder thousands of teachers choose China every year.

## Why Teach in China?

### Competitive Salaries
Teachers in China can expect to earn between $1,500-$3,000 USD per month, with many schools offering additional benefits like housing allowances, flight reimbursements, and health insurance.

### Cultural Immersion
Living in China provides an unparalleled opportunity to experience one of the world's oldest civilizations, learn Mandarin, and explore diverse landscapes from bustling cities to serene countryside.

### Career Growth
Teaching in China looks excellent on your resume and provides valuable international teaching experience that can open doors worldwide.

## Requirements

- Bachelor's degree (in any field)
- TEFL/TESOL certificate (120+ hours)
- Native English speaker or near-native fluency
- Clean criminal background check
- Passport from an English-speaking country

## Getting Started

The process typically takes 2-3 months from application to arrival. We guide you through every step, from finding the perfect position to securing your visa and preparing for your move.

Ready to start your adventure? Contact us today to learn more about current opportunities!`,
    coverImage:
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200",
    category: "TEACHING" as BlogCategory,
    status: "PUBLISHED" as BlogStatus,
    author: "KTECCS Team",
    readTime: "8 min read",
    metaTitle: "Teaching English in China - Complete Guide 2025",
    metaDescription:
      "Comprehensive guide to teaching English in China. Learn about requirements, salaries, visa process, and career opportunities.",
    publishedAt: new Date("2025-10-20"),
    media: [
      {
        url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
        type: "IMAGE" as const,
        caption: "Teacher with students in a Chinese classroom",
        order: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
        type: "IMAGE" as const,
        caption: "Modern Chinese school building",
        order: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
        type: "IMAGE" as const,
        caption: "Books and learning materials",
        order: 2,
      },
      {
        url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
        type: "IMAGE" as const,
        caption: "International students studying together",
        order: 3,
      },
    ],
  },
  {
    slug: "z-visa-guide-working-china",
    title: "Z Visa Guide: Everything You Need to Know About Working in China",
    excerpt:
      "Navigate the Chinese work visa process with confidence. Learn about requirements, application steps, and common pitfalls to avoid.",
    content: `# Understanding the Z Visa: Your Gateway to Working in China

The Z visa is China's work visa, required for anyone planning to work legally in the country. While the process can seem daunting, understanding the requirements and timeline makes it manageable.

## What is a Z Visa?

The Z visa is a single-entry visa that allows you to enter China to convert it into a work residence permit. It's the first step in your legal employment journey in China.

## Required Documents

1. **Passport** - Valid for at least 6 months with 2+ blank pages
2. **Work Permit Notification Letter** - Issued by your employer
3. **Invitation Letter** - From your employing school/company
4. **Health Check** - Completed within 6 months
5. **Criminal Background Check** - Apostilled/authenticated
6. **Degree Certificate** - Apostilled/authenticated
7. **TEFL Certificate** - If teaching English

## The Process

### Step 1: Document Preparation (4-8 weeks)
Gather and authenticate all required documents. This is often the longest part of the process.

### Step 2: Work Permit Application (2-3 weeks)
Your employer applies for your work permit in China.

### Step 3: Z Visa Application (1 week)
Apply at your nearest Chinese embassy/consulate.

### Step 4: Entry and Conversion (Within 30 days)
Enter China and convert to residence permit within 30 days.

## Common Mistakes to Avoid

- Starting document gathering too late
- Not getting proper authentication/apostille
- Incomplete health checks
- Expired documents

## Tips for Success

1. Start early - Begin 3 months before your planned start date
2. Use professional authentication services
3. Keep copies of everything
4. Stay in communication with your employer

Need help with your Z visa? Our team specializes in guiding teachers through the entire process. Contact us today!`,
    coverImage:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200",
    category: "VISAS" as BlogCategory,
    status: "PUBLISHED" as BlogStatus,
    author: "KTECCS Team",
    readTime: "10 min read",
    metaTitle: "Z Visa Guide for China - Work Visa Requirements 2025",
    metaDescription:
      "Complete guide to obtaining a Z visa for working in China. Step-by-step process, requirements, and timeline explained.",
    publishedAt: new Date("2025-10-18"),
    media: [
      {
        url: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800",
        type: "IMAGE" as const,
        caption: "Passport and visa documentation",
        order: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800",
        type: "IMAGE" as const,
        caption: "Chinese consulate building",
        order: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1554224311-beee460c201f?w=800",
        type: "IMAGE" as const,
        caption: "Document authentication process",
        order: 2,
      },
      {
        url: "https://images.unsplash.com/photo-1586892478025-2b5472316f22?w=800",
        type: "IMAGE" as const,
        caption: "Airport arrival in China",
        order: 3,
      },
      {
        url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
        type: "IMAGE" as const,
        caption: "Work permit paperwork",
        order: 4,
      },
    ],
  },
  {
    slug: "relocating-to-china-what-to-expect",
    title: "Relocating to China: What to Expect in Your First Month",
    excerpt:
      "From apartment hunting to opening a bank account, here's what you need to know to settle into your new life in China smoothly.",
    content: `# Your First Month in China: A Survival Guide

Moving to a new country is exciting but can also be overwhelming. Here's what to expect and how to navigate your first month in China successfully.

## Week 1: Essential Setup

### Accommodation
Most schools provide temporary housing for your first week. Use this time to:
- Explore your neighborhood
- Locate essential stores (grocery, pharmacy)
- Download WeChat and Alipay
- Get a local SIM card

### Important Apps
- **WeChat** - China's everything app (messaging, payments, more)
- **Alipay** - Alternative payment platform
- **Didi** - Chinese Uber
- **Meituan** - Food delivery
- **Google Translate** - Essential for communication

## Week 2: Banking and Payments

Opening a Chinese bank account requires:
- Your passport
- Residence permit (or temporary registration)
- Chinese phone number
- School employment letter

Popular banks for foreigners:
- Bank of China
- ICBC
- China Construction Bank

## Week 3: Getting Around

### Public Transportation
Chinese cities have excellent public transport:
- Metro/Subway - Fast and affordable
- Bus - Extensive network
- Bike sharing - Convenient for short trips
- Taxis/Didi - Readily available

### Transportation Cards
Get a local transport card (像一卡通) for easy metro and bus access. Most cities allow WeChat/Alipay payments too.

## Week 4: Cultural Adjustment

### Language Barrier
While many young Chinese speak some English, learning basic Mandarin phrases helps:
- 你好 (Nǐ hǎo) - Hello
- 谢谢 (Xièxie) - Thank you
- 多少钱? (Duōshǎo qián?) - How much?
- 不要辣 (Búyào là) - Not spicy

### Food and Dining
Chinese food varies greatly by region. Don't be afraid to try new things, but know your spice tolerance!

### Social Life
Join expat groups on WeChat and Facebook to meet other foreigners. Many cities have active expat communities with regular meetups.

## Cultural Tips

1. **Cash is rare** - WeChat Pay and Alipay are everywhere
2. **VPN** - Essential for accessing Western websites
3. **Squat toilets** - Common in public places
4. **Loud is normal** - Chinese culture is more boisterous than Western
5. **Personal space** - Different concept here

## Healthcare

Register at a local hospital or clinic early. Many cities have international hospitals with English-speaking staff. Keep your health insurance card handy.

## Making Friends

Chinese people are generally friendly and curious about foreigners. Don't be surprised by:
- Questions about age, salary, or marital status (not considered rude)
- Photo requests
- Help from strangers
- Invitations to family dinners

## Ready to Make the Move?

We help teachers navigate every step of relocation, from visa processing to settling in. Contact us to learn how we can support your China journey!`,
    coverImage:
      "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200",
    category: "RELOCATION" as BlogCategory,
    status: "PUBLISHED" as BlogStatus,
    author: "KTECCS Team",
    readTime: "7 min read",
    metaTitle: "Relocating to China - First Month Survival Guide",
    metaDescription:
      "Everything you need to know about your first month living in China, from banking to transportation and cultural adjustment.",
    publishedAt: new Date("2025-10-15"),
    media: [
      {
        url: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800",
        type: "IMAGE" as const,
        caption: "Chinese city skyline at dusk",
        order: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800",
        type: "IMAGE" as const,
        caption: "WeChat and Alipay mobile payment",
        order: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1570284613060-766c33850e00?w=800",
        type: "IMAGE" as const,
        caption: "Chinese metro station",
        order: 2,
      },
      {
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
        type: "IMAGE" as const,
        caption: "Local Chinese restaurant",
        order: 3,
      },
    ],
  },
  {
    slug: "ace-your-teaching-interview",
    title: "How to Ace Your Teaching Interview in China",
    excerpt:
      "Stand out from other candidates with these proven interview tips and common questions asked by Chinese schools.",
    content: `# Ace Your Teaching Interview: Tips from Recruiters

Landing a teaching job in China starts with a great interview. Here's what Chinese schools look for and how to prepare.

## Interview Format

Most interviews are conducted via:
- Video call (Zoom, WeChat, Skype)
- Duration: 20-45 minutes
- 1-3 interviewers (usually including the hiring manager)

## What Schools Look For

### Professional Appearance
Even for video interviews, dress professionally. It shows respect and seriousness about the position.

### Teaching Philosophy
Be ready to discuss:
- Your teaching style
- How you handle different learning styles
- Classroom management approach
- Experience with young learners (if applicable)

### Cultural Awareness
Show you've researched:
- Chinese education system
- Local culture and customs
- The specific city/region
- The school's values and mission

### Enthusiasm
Schools want teachers who are excited about:
- Living in China
- Cultural exchange
- Making a difference in students' lives

## Common Interview Questions

### About You
1. "Tell me about yourself"
2. "Why do you want to teach in China?"
3. "What do you know about our school?"
4. "What are your strengths and weaknesses as a teacher?"

### Teaching Experience
1. "Describe your teaching style"
2. "How do you handle classroom management?"
3. "What's your experience with different age groups?"
4. "How do you engage students of varying abilities?"

### Situational Questions
1. "How would you handle a disruptive student?"
2. "What would you do if a lesson plan isn't working?"
3. "How do you incorporate technology in teaching?"
4. "How would you handle a language barrier?"

### About China
1. "What do you know about Chinese culture?"
2. "How do you plan to adapt to living abroad?"
3. "What are your long-term career goals?"
4. "Are you comfortable with the contract terms?"

## Sample Demo Lesson

Many interviews include a 5-10 minute demo lesson. Prepare:
- A simple, engaging topic (colors, animals, numbers)
- Visual aids or props
- Interactive elements
- Clear instructions
- Enthusiastic delivery

### Demo Lesson Tips
- Keep it simple and fun
- Use TPR (Total Physical Response)
- Include student participation
- Show personality
- Stay within time limit

## Questions to Ask Them

Asking thoughtful questions shows genuine interest:
1. "What's a typical day like for teachers?"
2. "What professional development opportunities exist?"
3. "How does the school support foreign teachers?"
4. "What's the student population like?"
5. "What resources are available for lesson planning?"
6. "Can you tell me about the local community?"

## Red Flags to Watch For

- Vague contract terms
- Unrealistic promises
- Pressure to decide immediately
- Lack of specific information
- No written contract offered
- Unclear salary breakdown

## After the Interview

### Follow-up
Send a thank-you email within 24 hours:
- Express appreciation for their time
- Reiterate your interest
- Mention a specific detail from the interview
- Keep it concise and professional

### Next Steps
If offered the position:
- Request contract in writing
- Review carefully (salary, hours, benefits)
- Ask for clarification on anything unclear
- Don't rush your decision

## Technical Preparation

Before your video interview:
- Test your internet connection
- Check camera and microphone
- Find a quiet, well-lit location
- Have backup device ready
- Close unnecessary programs
- Ensure professional background

## Final Tips

1. **Be yourself** - Authenticity matters
2. **Stay positive** - Even discussing challenges
3. **Show flexibility** - Adapt to cultural differences
4. **Demonstrate passion** - For teaching and China
5. **Follow instructions** - If they ask for documents, provide them promptly

## We're Here to Help

Our team can provide interview coaching, help you understand contract terms, and answer questions about specific schools. We want you to find the perfect position!

Ready to start interviewing? Contact us today to explore current teaching opportunities in China!`,
    coverImage:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200",
    category: "INTERVIEWS" as BlogCategory,
    status: "PUBLISHED" as BlogStatus,
    author: "KTECCS Team",
    readTime: "12 min read",
    metaTitle: "Teaching Interview Tips - Land Your China Job",
    metaDescription:
      "Master your teaching interview with tips on common questions, demo lessons, and what Chinese schools look for in candidates.",
    publishedAt: new Date("2025-10-12"),
    media: [
      {
        url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800",
        type: "IMAGE" as const,
        caption: "Professional video interview setup",
        order: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
        type: "IMAGE" as const,
        caption: "Business professional attire for interview",
        order: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
        type: "IMAGE" as const,
        caption: "Preparing teaching materials",
        order: 2,
      },
      {
        url: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800",
        type: "IMAGE" as const,
        caption: "Working on laptop for virtual interview",
        order: 3,
      },
    ],
  },
  {
    slug: "understanding-chinese-work-culture",
    title: "Understanding Chinese Work Culture: A Teacher's Guide",
    excerpt:
      "Learn about Chinese workplace expectations, communication styles, and how to build positive relationships with colleagues.",
    content: `# Chinese Work Culture: What Foreign Teachers Need to Know

Understanding Chinese work culture helps you integrate smoothly and build strong relationships with colleagues. Here's what to expect.

## Hierarchy and Respect

### Understanding Structure
Chinese workplaces often have clear hierarchies:
- Respect for authority is paramount
- Senior colleagues are highly regarded
- Decisions flow from top down
- Address supervisors formally

### Showing Respect
- Use formal titles (Teacher Li, Principal Wang)
- Stand when seniors enter the room
- Listen more than speak in meetings
- Accept criticism gracefully

## Communication Style

### Indirect Communication
Chinese colleagues often communicate indirectly:
- "Maybe" often means "no"
- Silence can indicate disagreement
- Direct confrontation is avoided
- Saving face is crucial

### Reading Between Lines
Pay attention to:
- Tone of voice
- Body language
- What's not said
- Group consensus

## Face (面子 - Miànzi)

### What is Face?
Face is reputation, dignity, and respect in social interactions. Maintaining face is crucial in Chinese culture.

### Giving Face
- Praise publicly
- Acknowledge achievements
- Show respect to seniors
- Avoid public criticism

### Losing Face
Avoid:
- Public disagreement
- Pointing out mistakes publicly
- Refusing requests directly
- Embarrassing others

## Work Hours and Expectations

### Schedule
- Typical hours: 8:30 AM - 5:30 PM
- Lunch break: 12:00 - 2:00 PM (often longer)
- After-school activities may extend your day
- Weekend events possible

### Punctuality
Chinese schools value punctuality:
- Arrive 10-15 minutes early
- Notify immediately if running late
- Plan for traffic and delays
- Meeting attendance is mandatory

## Meetings and Decision Making

### Meeting Etiquette
- Wait to be seated
- Senior members speak first
- Take notes
- Don't interrupt
- Stay until dismissed

### Decision Process
- Consensus-based
- Takes time
- May seem inefficient to Westerners
- Patience is valued

## Relationships and Guanxi (关系)

### Building Guanxi
Relationships are crucial in Chinese culture:
- Attend social events
- Accept dinner invitations
- Exchange small gifts
- Show genuine interest
- Be reliable and trustworthy

### Gift Giving
Common occasions:
- Chinese New Year
- Mid-Autumn Festival
- Return from trips
- Express gratitude

Gift etiquette:
- Wrap gifts nicely
- Give and receive with both hands
- Avoid: clocks, white items, sharp objects
- Good choices: local specialties, tea, fruit

## Teaching Expectations

### Chinese Teaching Style
Understanding differences helps:
- More structured and formal
- Teacher-centered
- Emphasis on memorization
- Respect for textbooks
- Frequent testing

### Your Role
Balance Western methods with local expectations:
- Be creative but structured
- Interactive but maintain authority
- Fun but educational
- Flexible but consistent

## Common Challenges and Solutions

### Challenge: Language Barrier
**Solution**: Learn basic Mandarin, use translation apps, find a bilingual colleague

### Challenge: Different Teaching Philosophy
**Solution**: Compromise, adapt gradually, communicate clearly, show respect for local methods

### Challenge: Unclear Expectations
**Solution**: Ask questions, observe colleagues, seek clarification, document important points

### Challenge: Work-Life Balance
**Solution**: Set boundaries politely, prioritize tasks, learn to say no gracefully

## Chinese Holidays and Festivals

### Major Holidays
- **Chinese New Year** (late Jan/Feb) - 1-2 week break
- **Tomb Sweeping Day** (April) - 3 days
- **Labor Day** (May 1) - 3-5 days
- **Dragon Boat Festival** (June) - 3 days
- **Mid-Autumn Festival** (Sept) - 3 days
- **National Day** (Oct 1) - 7 days (Golden Week)

### School Year
- Fall semester: September - January
- Spring semester: February/March - June/July
- Summer/winter breaks vary by school

## Professional Development

### Growth Opportunities
- Training workshops
- Teaching conferences
- Online courses
- Peer observations
- Mentorship programs

### Career Advancement
Show initiative:
- Volunteer for extra responsibilities
- Propose new ideas
- Mentor new teachers
- Learn Mandarin
- Understand local curriculum

## Building Positive Relationships

### With Chinese Teachers
- Offer to collaborate
- Share teaching resources
- Ask for advice
- Invite them for coffee
- Show cultural curiosity

### With Students
- Learn their names (Chinese and English)
- Show genuine interest
- Be consistent and fair
- Celebrate their culture
- Maintain professional boundaries

### With Parents
- Be available and responsive
- Communicate progress regularly
- Show respect and professionalism
- Understand their high expectations
- Be patient and understanding

## Dos and Don'ts

### Do:
✅ Be punctual
✅ Dress professionally
✅ Show respect to seniors
✅ Participate in school events
✅ Learn basic Mandarin
✅ Be patient and flexible
✅ Ask questions when unclear

### Don't:
❌ Criticize publicly
❌ Refuse invitations without good reason
❌ Discuss sensitive topics (politics, Taiwan)
❌ Show frustration openly
❌ Break commitments
❌ Complain constantly
❌ Act superior

## Your Cultural Bridge Role

As a foreign teacher, you're a cultural ambassador:
- Share your culture respectfully
- Learn about Chinese culture
- Find common ground
- Be open-minded
- Build bridges between cultures

## Conclusion

Adapting to Chinese work culture takes time and patience. Embrace differences, maintain flexibility, and show respect. Most colleagues appreciate foreigners who make effort to understand and adapt to local customs.

## Need Support?

Navigating a new work culture can be challenging. Our team provides ongoing support to help teachers thrive in Chinese schools. Contact us to learn more!`,
    coverImage:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200",
    category: "CULTURE" as BlogCategory,
    status: "PUBLISHED" as BlogStatus,
    author: "KTECCS Team",
    readTime: "15 min read",
    metaTitle: "Chinese Work Culture Guide for Foreign Teachers",
    metaDescription:
      "Essential guide to understanding Chinese workplace culture, communication styles, and building relationships in Chinese schools.",
    publishedAt: new Date("2025-10-08"),
    media: [
      {
        url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800",
        type: "IMAGE" as const,
        caption: "Professional team meeting in Chinese office",
        order: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
        type: "IMAGE" as const,
        caption: "Business handshake and professional respect",
        order: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800",
        type: "IMAGE" as const,
        caption: "Teachers collaborating in Chinese school",
        order: 2,
      },
      {
        url: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800",
        type: "IMAGE" as const,
        caption: "Gift exchange during Chinese festival",
        order: 3,
      },
      {
        url: "https://images.unsplash.com/photo-1475669698648-2f144fcaaeb1?w=800",
        type: "IMAGE" as const,
        caption: "Traditional Chinese tea ceremony",
        order: 4,
      },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding blog posts...");

  // Check if admin user exists to set as author
  const adminUser = await prisma.adminUser.findFirst();
  const authorId = adminUser?.id || null;

  for (const post of mockBlogPosts) {
    const { media, ...postData } = post;

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
    });

    if (existingPost) {
      console.log(`📝 Updating existing post: ${post.title}`);

      // Delete existing media first
      await prisma.blogMedia.deleteMany({
        where: { postId: existingPost.id },
      });

      // Update post and create new media
      await prisma.blogPost.update({
        where: { slug: post.slug },
        data: {
          ...postData,
          authorId,
          media: media
            ? {
                create: media,
              }
            : undefined,
        },
      });
    } else {
      console.log(`✨ Creating new post: ${post.title}`);
      await prisma.blogPost.create({
        data: {
          ...postData,
          authorId,
          media: media
            ? {
                create: media,
              }
            : undefined,
        },
      });
    }
  }

  console.log("✅ Blog posts seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding blog posts:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
