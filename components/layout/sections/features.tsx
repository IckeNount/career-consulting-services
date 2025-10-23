import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "TabletSmartphone",
    title: "End-to-End Support",
    description:
      "From job matching to visas, housing, and relocation, we take care of the full process.",
  },
  {
    icon: "BadgeCheck",
    title: "We Speak Your Language",
    description:
      "We know how hard it is to move abroad. Our team offers patient, clear communication.",
  },
  {
    icon: "Goal",
    title: "Trained & Prepared",
    description:
      "We offer free coaching for first-time teachers and workers abroad.",
  },
  {
    icon: "PictureInPicture",
    title: "Paperwork? Handled.",
    description:
      "From teaching licenses to work permits, we make sure nothing gets missed.",
  },
  {
    icon: "MousePointerClick",
    title: "Help When You Need It Most",
    description:
      "From airport pickups to emergency loans, we're here when others aren't.",
  },
  {
    icon: "Newspaper",
    title: "Trusted Since 2019",
    description:
      "Hundreds of successful placements and growing. You’re in safe hands.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id='features' className='container py-24 sm:py-32'>
      <h2 className='text-lg text-primary text-center mb-2 tracking-wider'>
        Why KTECCS?
      </h2>

      <h2 className='text-3xl md:text-4xl text-center font-bold mb-4'>
        What makes us different?
      </h2>

      <h3 className='md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8'>
        We&apos;re more than a recruiter. We guide you through every step of
        working or teaching abroad.
      </h3>

      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className='h-full bg-background border-0 shadow-none'>
              <CardHeader className='flex justify-center items-center'>
                <div className='bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4'>
                  <Icon
                    name={icon as keyof typeof icons}
                    size={24}
                    color='hsl(var(--primary))'
                    className='text-primary'
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className='text-muted-foreground text-center'>
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
