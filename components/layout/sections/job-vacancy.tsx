import { CompanyLogo } from "@/components/icons/company-logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const JobVacancySection = () => {
  return (
    <section id='job-vacancy' className='py-12 '>
      <hr className='border-secondary' />
      <div className='container py-20 sm:py-20'>
        <div className='lg:w-[60%] mx-auto'>
          <Card className='bg-background border-none shadow-none text-center flex flex-col items-center justify-center'>
            <CardHeader>
              <CardTitle className='text-4xl md:text-5xl font-bold flex flex-col items-center'>
                <CompanyLogo width={80} height={80} className='mb-4' />
                <div>
                  Your
                  <span className='text-transparent pl-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text'>
                    New Career{" "}
                  </span>
                  Could Start Here
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className='lg:w-[80%] text-xl text-muted-foreground'>
              Teaching or working overseas is closer than you think. We&apos;ll
              guide you all the way.
            </CardContent>

            <CardFooter>
              <Button asChild>
                <a href='/jobs'>See Available Jobs</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <hr className='border-secondary' />
    </section>
  );
};
