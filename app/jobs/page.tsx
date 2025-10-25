import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  description: string;
  companyName: string;
  location: string;
  salaryRange: string | null;
  requirements: string;
  jobType: "FULL_TIME" | "CONTRACT" | "SUBSTITUTE";
  applicationDeadline: string | null;
  isActive: boolean;
  createdAt: string;
  _count: {
    applications: number;
  };
}

async function getJobs(): Promise<Job[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/v1/jobs`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch jobs");
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

const jobTypeLabels = {
  FULL_TIME: "Full-time",
  CONTRACT: "Contract",
  SUBSTITUTE: "Substitute Teacher",
};

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className='min-h-screen bg-background'>
      <div className='container py-20'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            Available{" "}
            <span className='text-transparent bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text'>
              Job Opportunities
            </span>
          </h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            Explore exciting teaching and career opportunities overseas. Find
            your perfect role and start your journey today.
          </p>
        </div>

        {jobs.length === 0 ? (
          <Card className='max-w-2xl mx-auto'>
            <CardContent className='py-12 text-center'>
              <p className='text-lg text-muted-foreground mb-4'>
                No job vacancies available at the moment.
              </p>
              <p className='text-sm text-muted-foreground'>
                Check back soon for new opportunities!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {jobs.map((job) => (
              <Card key={job.id} className='flex flex-col'>
                <CardHeader>
                  <div className='flex items-start justify-between gap-2 mb-2'>
                    <Badge variant='secondary'>
                      {jobTypeLabels[job.jobType]}
                    </Badge>
                    {job.applicationDeadline && (
                      <span className='text-xs text-muted-foreground'>
                        Deadline:{" "}
                        {new Date(job.applicationDeadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <CardTitle className='text-xl'>{job.title}</CardTitle>
                  <CardDescription className='font-semibold text-foreground'>
                    {job.companyName}
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex-grow'>
                  <div className='space-y-3'>
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Location
                      </p>
                      <p className='text-sm'>{job.location}</p>
                    </div>
                    {job.salaryRange && (
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>
                          Salary Range
                        </p>
                        <p className='text-sm'>{job.salaryRange}</p>
                      </div>
                    )}
                    <div>
                      <p className='text-sm font-medium text-muted-foreground mb-1'>
                        Description
                      </p>
                      <p className='text-sm line-clamp-3'>{job.description}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className='w-full'>
                    <Link href={`/apply?jobId=${job.id}`}>Apply Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
