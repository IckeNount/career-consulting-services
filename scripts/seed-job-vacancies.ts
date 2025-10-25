import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const mockJobs = [
  {
    title: "ESL Teacher - Elementary School",
    companyName: "Beijing International Primary School",
    location: "Beijing, China",
    jobType: "FULL_TIME" as const,
    salaryRange: "$2,500 - $3,500 USD/month",
    description: `We are seeking enthusiastic ESL teachers for our elementary program in Beijing. Our school provides a nurturing environment where students aged 6-12 develop strong English language skills through interactive and engaging lessons.

## Key Responsibilities
- Teach English to elementary students (ages 6-12)
- Develop engaging lesson plans aligned with curriculum standards
- Create a positive and inclusive classroom environment
- Assess student progress and provide regular feedback
- Participate in school events and parent-teacher conferences
- Collaborate with Chinese teaching assistants

## What We Offer
**Competitive Compensation Package:**
- Salary: $2,500 - $3,500 USD/month (tax-free)
- Housing allowance: ¥3,000/month OR free apartment
- Flight reimbursement: up to $1,500 annually
- End-of-contract bonus

**Comprehensive Benefits:**
- Full health insurance coverage
- Z visa sponsorship and support
- Chinese public holidays + 4 weeks paid vacation
- Professional development opportunities
- Mandarin language classes (optional)
- Relocation assistance

**Working Conditions:**
- 20-25 teaching hours per week
- Maximum 40 hours total work time
- Modern classrooms with smart boards
- Small class sizes (15-20 students)
- Supportive international teaching team`,
    requirements: `- Bachelor's degree (any field) required
- TEFL/TESOL/CELTA certificate (120+ hours minimum)
- 2+ years teaching experience (young learners preferred)
- Native English speaker or equivalent fluency
- Clean criminal background check (FBI/police clearance)
- Valid passport from English-speaking country (USA, UK, Canada, Australia, NZ, Ireland, South Africa)
- Health certificate
- Degree and documents must be notarized/apostilled`,
    isActive: true,
    applicationDeadline: new Date("2025-12-31"),
  },
  {
    title: "High School English Literature Teacher",
    companyName: "Shanghai Elite Academy",
    location: "Shanghai, China",
    jobType: "FULL_TIME" as const,
    salaryRange: "$3,000 - $4,500 USD/month",
    description: `Join our prestigious international high school in Shanghai to teach English Literature and prepare students for AP, IB, or A-Level examinations. We offer a challenging academic environment with excellent resources, supportive colleagues, and competitive compensation.

## About the Position
We're seeking an experienced English Literature teacher for our grades 9-12 program. You'll work with motivated students preparing for university admission to top institutions worldwide.

## Key Responsibilities
- Teach English Literature courses (grades 9-12)
- Prepare students for AP English, IB English, or A-Level Literature examinations
- Design comprehensive curriculum aligned with international standards
- Provide academic counseling and college application essay support
- Lead literary clubs, drama productions, or debate team
- Collaborate with international faculty team
- Participate in curriculum development

## What We Offer
**Generous Compensation:**
- Salary: $3,000 - $4,500 USD/month (based on experience)
- Housing: Modern 2-bedroom apartment OR ¥5,000/month stipend
- Annual round-trip flight allowance (¥12,000)
- Signing bonus: ¥10,000 after completion of first year
- Performance bonuses available

**Excellent Benefits:**
- Comprehensive health and dental insurance
- Tuition discount (50%) for dependent children
- Professional development budget (¥5,000/year)
- Z visa sponsorship with full support
- Summer break (8 weeks) + winter break (3 weeks)
- Access to school gym and facilities

**Working Environment:**
- 18-20 teaching hours per week
- Small class sizes (12-18 students)
- State-of-the-art facilities and technology
- Well-resourced library and learning center
- International teaching community`,
    requirements: `- Bachelor's degree in English, Literature, Education, or related field (required)
- Master's degree preferred
- Valid teaching certification/license (QTS, state license, etc.) highly preferred
- 3+ years high school teaching experience required
- Experience with AP, IB, or A-Level curriculum strongly preferred
- TEFL/TESOL/CELTA certificate (if not certified teacher)
- Native English speaker or C2 level proficiency
- Strong knowledge of British and American literature
- Excellent classroom management and communication skills
- Clean criminal background check
- Degree and teaching credentials must be notarized/apostilled`,
    isActive: true,
    applicationDeadline: new Date("2025-11-30"),
  },
  {
    title: "Business English Instructor",
    companyName: "Guangzhou Corporate Training Center",
    location: "Guangzhou, China",
    jobType: "FULL_TIME" as const,
    salaryRange: "$2,800 - $4,000 USD/month",
    description: `Join our dynamic corporate training center specializing in Business English for professionals. We deliver customized training programs to employees at Fortune 500 companies and growing Chinese enterprises.

## Position Overview
Teach Business English to adult professionals from diverse industries including finance, technology, manufacturing, and international trade. Classes are small (6-12 participants) and focus on practical, workplace-relevant communication skills.

## Teaching Focus Areas
- Business communication and professional presentations
- Meeting facilitation and negotiation techniques
- Business email and report writing
- Industry-specific vocabulary and terminology
- Cross-cultural business communication
- Interview preparation and networking
- Conference call/video meeting skills

## Schedule & Format
- Monday to Friday (flexible scheduling)
- Mix of on-site corporate locations and online sessions
- 20-25 teaching hours per week
- Occasional weekend workshops (additional compensation)
- Custom course design based on client needs

## What Makes This Role Unique
- Work with motivated adult learners
- Variety of industries and topics
- Flexible schedule with daytime hours
- Professional corporate environments
- Opportunity to develop specialized expertise

## Compensation & Benefits
**Salary Package:**
- Base salary: $2,800 - $4,000 USD/month
- Performance bonuses based on student feedback
- Course development bonuses
- Transportation allowance: ¥800/month

**Benefits:**
- Lunch provided daily at corporate cafeterias
- Health and accident insurance
- Z visa sponsorship
- Paid Chinese national holidays
- Contract completion bonus (1 month salary)
- Training and professional development`,
    requirements: `- Bachelor's degree required (Business, MBA, Communications, or English preferred)
- TEFL/TESOL/CELTA certificate (120+ hours) required
- 3+ years Business English teaching experience required
- Corporate training or business background highly valued
- Experience teaching professionals and executives
- Excellent presentation and facilitation skills
- Professional appearance and demeanor
- Native English speaker or C2 level proficiency
- Comfortable with technology (Zoom, Teams, online platforms)
- Flexible and adaptable to client needs
- Clean criminal background check
- Strong interpersonal and communication skills`,
    isActive: true,
    applicationDeadline: new Date("2025-12-15"),
  },
  {
    title: "IELTS/TOEFL Test Prep Teacher",
    companyName: "Chengdu Language Academy",
    location: "Chengdu, China",
    jobType: "FULL_TIME" as const,
    salaryRange: "$2,600 - $3,800 USD/month",
    description: `Join our premier test preparation center in Chengdu, specializing in IELTS and TOEFL training. We help Chinese students achieve their target scores for international university applications with a proven track record of success.

## About the Role
Teach IELTS and TOEFL preparation courses to motivated students preparing for university admission. You'll work with small classes (8-15 students) and provide targeted instruction in test-taking strategies.

## Main Responsibilities
- Teach IELTS and/or TOEFL preparation courses (all levels)
- Focus on all four skills: Reading, Writing, Listening, Speaking
- Provide individualized feedback and test-taking strategies
- Track student progress with regular assessments
- Conduct mock tests and detailed scoring/feedback
- Stay current with test format changes and trends
- Develop supplementary materials and practice exercises
- Offer one-on-one tutoring sessions (optional, additional pay)

## What Makes This Position Special
- Work with highly motivated students
- Clear success metrics (student score improvements)
- Structured curriculum with flexibility
- Performance bonuses based on student results
- Opportunities for professional development

## Compensation & Benefits
**Salary Package:**
- Base salary: $2,600 - $3,800 USD/month (based on experience)
- Performance bonuses (up to ¥5,000/month based on student scores)
- Private tutoring opportunities (¥200-300/hour)

**Housing & Travel:**
- Free furnished apartment (1-bedroom, modern)
- OR housing allowance ¥2,500/month
- Annual flight reimbursement (¥10,000)

**Additional Benefits:**
- Comprehensive health insurance
- Z visa sponsorship with full support
- Paid Chinese holidays + 3 weeks vacation
- Free Mandarin language classes
- Career advancement to senior teacher/trainer roles
- Professional development workshops`,
    requirements: `- Bachelor's degree required (any field)
- TEFL/TESOL/CELTA certificate (120+ hours) required
- IELTS score 8.0+ OR TOEFL iBT score 110+ required (must provide official scores)
- 2+ years test preparation teaching experience preferred
- Native English speaker or C2 level proficiency
- Strong knowledge of IELTS/TOEFL test formats and scoring criteria
- Excellent analytical and feedback skills
- Patient, encouraging, and detail-oriented
- Ability to motivate students and build confidence
- Clean criminal background check
- Degree and documents must be notarized/apostilled`,
    isActive: true,
    applicationDeadline: new Date("2025-12-20"),
  },
  {
    title: "Kindergarten English Teacher",
    companyName: "Shenzhen Children's International Kindergarten",
    location: "Shenzhen, China",
    jobType: "FULL_TIME" as const,
    salaryRange: "$2,200 - $3,200 USD/month",
    description: `Join our warm and welcoming international kindergarten in Shenzhen! We're seeking energetic and creative teachers who love working with young children and want to help them develop English language skills through play-based learning.

## About the Position
Work with adorable children aged 3-6 years in a fun, safe, and nurturing bilingual environment. Our curriculum emphasizes holistic child development through stories, songs, games, arts and crafts, and hands-on activities.

## Daily Activities & Responsibilities
- Lead engaging circle time and group activities
- Teach phonics, vocabulary, colors, numbers, and basic grammar
- Organize creative arts and crafts projects
- Supervise outdoor play time and physical activities
- Read interactive stories and teach songs
- Monitor child development, safety, and wellbeing
- Communicate regularly with parents (via WeChat)
- Maintain a clean, organized classroom
- Participate in school events and performances

## Ideal Candidate Qualities
- **Patient and nurturing** personality
- **High energy and enthusiasm** for teaching young children
- **Creative and adaptable** teaching style
- **Strong communication** skills with children and parents
- **Team player** who collaborates well with Chinese teachers
- **Genuine love** for working with children
- Cultural sensitivity and openness

## Work Environment
- Small class sizes (12-18 children with Chinese assistant)
- Monday to Friday, 8:00 AM - 5:00 PM
- Teaching hours: approximately 25 hours/week
- Planning time and breaks provided
- Modern, colorful classrooms with age-appropriate resources

## Compensation & Benefits
**Salary:**
- $2,200 - $3,200 USD/month (based on experience)
- Housing allowance: ¥2,500/month

**Time Off:**
- Chinese public holidays (fully paid)
- Summer vacation (6-8 weeks, partially paid)
- Winter break (3-4 weeks for Chinese New Year)

**Additional Benefits:**
- Health insurance coverage
- Z visa sponsorship with full support
- Flight reimbursement: ¥8,000 annually
- Contract completion bonus
- Friendly, supportive work environment
- Professional development opportunities`,
    requirements: `- Bachelor's degree required (Education, Child Development, or any field)
- TEFL/TESOL certificate (120+ hours) required
- 1+ year experience teaching young children (ages 3-6)
- Native English speaker preferred (or near-native fluency)
- Energetic, patient, and nurturing personality
- Ability to create engaging, age-appropriate lessons
- Clean criminal background check required
- Health certificate required (can obtain in China)
- Passion for early childhood education
- Degree must be notarized/apostilled`,
    isActive: true,
    applicationDeadline: new Date("2026-01-15"),
  },
  {
    title: "Online English Teacher (Remote - Part Time)",
    companyName: "China Online Education Platform",
    location: "Remote (Teach from Anywhere)",
    jobType: "CONTRACT" as const,
    salaryRange: "$18 - $25 USD/hour",
    description: `Join our rapidly growing online education platform and teach English to Chinese students from the comfort of your home! Enjoy ultimate flexibility with competitive hourly rates and the ability to work from anywhere in the world.

## Position Overview
Teach engaging one-on-one or small group classes (2-4 students) via our user-friendly interactive platform. Students range from young learners (ages 5-12) to teenagers and adults, with comprehensive curriculum materials provided.

## Ultimate Schedule Flexibility
- **Choose your own hours** - Be your own boss!
- **Peak demand times:** 6-9 AM & 6-9 PM Beijing Time (great for early birds or night owls)
- **Minimum commitment:** Only 10 hours/week
- **Maximum:** Up to 30 hours/week
- Book classes up to 2 weeks in advance
- Perfect for digital nomads, parents, or side income

## Our Teaching Platform
- Intuitive, easy-to-use interface (minimal tech skills needed)
- **All curriculum and materials provided** - No lesson planning!
- Interactive whiteboard and multimedia tools
- Automatic session recording for quality assurance
- 24/7 technical support team
- Mobile app for on-the-go schedule management

## What Makes This Different
- **No commute** - Teach in your pajamas if you want!
- **Global opportunities** - Teach students across China
- **Performance-based growth** - Top teachers earn $25+/hour
- **Supportive community** - Online teacher forums and mentorship
- **Quick start** - Begin teaching within 1-2 weeks

## Compensation Structure
**Hourly Rates (Based on Qualifications):**
- Entry level: $18-20/hour
- Experienced: $20-23/hour
- Expert level: $23-25/hour

**Additional Earnings:**
- Performance bonuses (up to $500/month)
- Peak hour incentives (+$2/hour for high-demand slots)
- Referral bonuses ($100 per teacher referred)
- Student retention bonuses

**Payment:**
- Weekly or bi-weekly payments
- PayPal, Wise, or direct bank transfer
- Transparent earning tracking dashboard

## Quick Application Process
1. Submit online application with resume
2. Complete 15-minute demo lesson via video
3. Complete platform training (2-3 hours, self-paced)
4. Start teaching and earning!`,
    requirements: `- Bachelor's degree required (any field)
- TEFL/TESOL/CELTA certificate preferred (but not required for exceptional candidates)
- 1+ year teaching experience (online or in-person)
- Native English speaker OR C2 level English proficiency
- **Technical Requirements:**
  - Stable internet connection (minimum 20 Mbps download/upload)
  - Desktop or laptop computer (Windows/Mac)
  - HD webcam and microphone/headset
  - Quiet teaching space with good lighting
  - Neutral background (or virtual background capability)
- Self-motivated, reliable, and punctual
- Engaging and enthusiastic teaching style
- Comfortable with technology and online platforms
- Professional appearance and demeanor
- Ability to work independently
- Available during peak Beijing hours (preferred but not required)`,
    isActive: true,
    applicationDeadline: new Date("2026-02-28"),
  },
];

async function main() {
  console.log("🏢 Seeding job vacancies...");

  for (const job of mockJobs) {
    const existingJob = await prisma.jobVacancy.findFirst({
      where: {
        title: job.title,
        companyName: job.companyName,
      },
    });

    if (existingJob) {
      console.log(`📝 Updating existing job: ${job.title}`);
      await prisma.jobVacancy.update({
        where: { id: existingJob.id },
        data: job,
      });
    } else {
      console.log(`✨ Creating new job: ${job.title}`);
      await prisma.jobVacancy.create({
        data: job,
      });
    }
  }

  console.log("✅ Job vacancies seeded successfully!");
  console.log(`📊 Total jobs: ${mockJobs.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding job vacancies:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
