import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

enum ProService {
  YES = 1,
  NO = 0,
}
interface ServiceProps {
  title: string;
  pro: ProService;
  description: string;
}
const serviceList: ServiceProps[] = [
  {
    title: "Teachers",
    description:
      "Get placed in Thai schools with visa, license, and housing support.",
    pro: 1,
  },
  {
    title: "Industry Workers",
    description: "Work in Poland or Germany with full relocation help.",
    pro: 0,
  },
  {
    title: "Visa & Travel Support",
    description: "We simplify visas for Europe, Korea, Dubai, and more.",
    pro: 0,
  },
  {
    title: "New Grads & Gap Year",
    description: "Explore teaching or travel work, no experience needed.",
    pro: 0,
  },
];

export const ServicesSection = () => {
  return (
    <section id='services' className='container py-24 sm:py-32'>
      <h2 className='text-lg text-primary text-center mb-2 tracking-wider'>
        Who We Help
      </h2>

      <h2 className='text-3xl md:text-4xl text-center font-bold mb-4'>
        We Help You Take the Leap Abroad{" "}
      </h2>
      <h3 className='md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8'>
        Whether you&apos;re looking to teach, work, travel, or explore something
        new after graduation, We&apos;re here to support your journey with full
        relocation help, coaching, and visa services.
      </h3>
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'></div>

      <div className='grid sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-[60%] mx-auto'>
        {serviceList.map(({ title, description, pro }) => (
          <Card
            key={title}
            className='bg-muted/60 dark:bg-card h-full relative'
          >
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <Badge
              data-pro={ProService.YES === pro}
              variant='secondary'
              className='absolute -top-2 -right-3 data-[pro=false]:hidden'
            >
              Most Popular
            </Badge>
          </Card>
        ))}
      </div>
    </section>
  );
};
