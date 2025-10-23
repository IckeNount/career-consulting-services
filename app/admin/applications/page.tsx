"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

type ApplicationStatus = "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";

type Application = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  currentLocation: string;
  desiredCountry: string;
  desiredPosition: string;
  yearsExperience: number;
  currentSalary: number | null;
  expectedSalary: number;
  educationLevel: string;
  status: ApplicationStatus;
  createdAt: string;
  skills: string[];
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  resumeUrl?: string;
  coverLetterUrl?: string;
  portfolioUrl?: string;
  notes?: string;
};

const statusColors = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  REVIEWING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/v1/applications");
      if (!response.ok) throw new Error("Failed to fetch applications");

      const result = await response.json();
      setApplications(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-background p-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-background p-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center justify-center h-64'>
            <div className='text-center'>
              <p className='text-red-600 dark:text-red-400 mb-4'>{error}</p>
              <Button onClick={fetchApplications}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/admin/dashboard'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className='text-4xl font-bold'>Applications</h1>
              <p className='text-muted-foreground mt-2'>
                {applications.length} total applications
              </p>
            </div>
          </div>
          <Button onClick={fetchApplications}>Refresh</Button>
        </div>

        {/* Applications Grid */}
        {applications.length === 0 ? (
          <Card>
            <CardContent className='flex items-center justify-center h-64'>
              <div className='text-center'>
                <p className='text-muted-foreground mb-4'>
                  No applications yet
                </p>
                <Button variant='outline' asChild>
                  <Link href='/apply'>Create Test Application</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-6 md:grid-cols-1'>
            {applications.map((app) => (
              <Card key={app.id} className='hover:shadow-lg transition-shadow'>
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div>
                      <CardTitle className='text-2xl'>
                        {app.firstName} {app.lastName}
                      </CardTitle>
                      <CardDescription className='mt-2'>
                        Applied for:{" "}
                        <span className='font-semibold'>
                          {app.desiredPosition}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge className={statusColors[app.status]}>
                      {app.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Contact Information */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex items-center gap-2 text-sm'>
                      <Mail className='h-4 w-4 text-muted-foreground' />
                      <a
                        href={`mailto:${app.email}`}
                        className='text-blue-600 dark:text-blue-400 hover:underline'
                      >
                        {app.email}
                      </a>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <Phone className='h-4 w-4 text-muted-foreground' />
                      <span>{app.phone}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <MapPin className='h-4 w-4 text-muted-foreground' />
                      <span>
                        {app.currentLocation} → {app.desiredCountry}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <Calendar className='h-4 w-4 text-muted-foreground' />
                      <span>Applied: {formatDate(app.createdAt)}</span>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t'>
                    <div>
                      <p className='text-xs text-muted-foreground mb-1'>
                        Experience
                      </p>
                      <p className='font-semibold'>
                        {app.yearsExperience} years
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground mb-1'>
                        Education
                      </p>
                      <p className='font-semibold'>
                        {app.educationLevel.replace("_", " ")}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground mb-1'>
                        Current Salary
                      </p>
                      <p className='font-semibold'>
                        {formatCurrency(app.currentSalary)}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground mb-1'>
                        Expected Salary
                      </p>
                      <p className='font-semibold'>
                        {formatCurrency(app.expectedSalary)}
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  {app.skills && app.skills.length > 0 && (
                    <div>
                      <p className='text-sm font-semibold mb-2'>Skills:</p>
                      <div className='flex flex-wrap gap-2'>
                        {app.skills.map((skill, idx) => (
                          <Badge key={idx} variant='secondary'>
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {app.languages && app.languages.length > 0 && (
                    <div>
                      <p className='text-sm font-semibold mb-2'>Languages:</p>
                      <div className='flex flex-wrap gap-2'>
                        {app.languages.map((lang, idx) => (
                          <Badge key={idx} variant='outline'>
                            {lang.language} ({lang.proficiency})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  <div className='flex flex-wrap gap-2 pt-4 border-t'>
                    {app.resumeUrl && (
                      <Button variant='outline' size='sm' asChild>
                        <a
                          href={app.resumeUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          View Resume
                        </a>
                      </Button>
                    )}
                    {app.coverLetterUrl && (
                      <Button variant='outline' size='sm' asChild>
                        <a
                          href={app.coverLetterUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          View Cover Letter
                        </a>
                      </Button>
                    )}
                    {app.portfolioUrl && (
                      <Button variant='outline' size='sm' asChild>
                        <a
                          href={app.portfolioUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          View Portfolio
                        </a>
                      </Button>
                    )}
                    <Button variant='default' size='sm' asChild>
                      <Link href={`/admin/applications/${app.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>

                  {/* Notes */}
                  {app.notes && (
                    <div className='pt-4 border-t'>
                      <p className='text-sm font-semibold mb-1'>
                        Additional Notes:
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {app.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
