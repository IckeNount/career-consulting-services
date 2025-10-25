"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Check,
  X,
  Eye,
  Clock,
  FileEdit,
} from "lucide-react";
import Link from "next/link";
import { apiClient, ApiError } from "@/lib/api/client";
import type { ApplicationStatus } from "@/lib/api/contracts/applications";

type Application = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  residence: string;
  religion: string;
  maritalStatus: string;
  hasPassport: boolean;
  passportNumber?: string | null;
  startDate: string;
  educationLevel: string;
  torFile?: string | null;
  diplomaFile?: string | null;
  resumeFile?: string | null;
  hasExperience: boolean;
  experience?: string | null;
  languages: string;
  englishLevel: string;
  skills?: string | null;
  motivation: string;
  referralSource: string;
  consent: boolean;
  status: ApplicationStatus;
  createdAt: string;
  reviewNotes?: string | null;
  jobId?: string | null;
  job?: {
    id: string;
    title: string;
    companyName: string;
    location: string;
  } | null;
};

const statusColors = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  REVIEWING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function ApplicationsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobInfo, setJobInfo] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [editingNotes, setEditingNotes] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
    if (jobId) {
      fetchJobInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchJobInfo = async () => {
    try {
      const result = await apiClient.jobs.get(jobId!);
      setJobInfo(result.data);
    } catch (err) {
      console.error("Failed to fetch job info", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const result = await apiClient.applications.list(
        jobId ? { jobId } : undefined
      );

      setApplications(result.data || []);

      // Initialize review notes state
      const notesMap: Record<string, string> = {};
      (result.data || []).forEach((app: any) => {
        if (app.reviewNotes) {
          notesMap[app.id] = app.reviewNotes;
        }
      });
      setReviewNotes(notesMap);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`${err.message} (${err.status})`);
      } else {
        setError("Failed to load applications");
      }
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

  const updateApplicationStatus = async (
    applicationId: string,
    newStatus: ApplicationStatus,
    notes?: string
  ) => {
    setUpdatingStatus(applicationId);
    try {
      await apiClient.applications.update(applicationId, {
        status: newStatus,
        ...(notes !== undefined && { reviewNotes: notes }),
      });

      // Refresh applications after update
      await fetchApplications();
      setEditingNotes(null);
    } catch (err) {
      console.error("Error updating status:", err);

      if (err instanceof ApiError) {
        alert(`Failed to update: ${err.message} (Status: ${err.status})`);
      } else {
        alert("Failed to update application status");
      }
    } finally {
      setUpdatingStatus(null);
    }
  };

  const saveReviewNotes = async (applicationId: string) => {
    await updateApplicationStatus(
      applicationId,
      applications.find((app) => app.id === applicationId)?.status || "PENDING",
      reviewNotes[applicationId] || ""
    );
  };

  const getStatusButton = (
    appId: string,
    currentStatus: ApplicationStatus,
    targetStatus: ApplicationStatus,
    label: string,
    icon: any,
    variant: "default" | "outline" | "destructive" | "secondary" = "outline"
  ) => {
    const Icon = icon;
    const isCurrentStatus = currentStatus === targetStatus;
    const isUpdating = updatingStatus === appId;

    return (
      <Button
        variant={isCurrentStatus ? "default" : variant}
        size='sm'
        onClick={() => updateApplicationStatus(appId, targetStatus)}
        disabled={isCurrentStatus || isUpdating}
        className='gap-1'
      >
        <Icon className='h-3 w-3' />
        {label}
      </Button>
    );
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
              <h1 className='text-4xl font-bold'>
                {jobInfo ? `Applications for ${jobInfo.title}` : "Applications"}
              </h1>
              <p className='text-muted-foreground mt-2'>
                {jobInfo && (
                  <span>
                    {jobInfo.companyName} • {jobInfo.location} <br />
                  </span>
                )}
                {applications.length} total application
                {applications.length !== 1 ? "s" : ""}
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
                      <CardTitle className='text-2xl'>{app.fullName}</CardTitle>
                      <CardDescription className='mt-2'>
                        {app.job ? (
                          <>
                            Applied for:{" "}
                            <span className='font-semibold'>
                              {app.job.title}
                            </span>
                            <br />
                            {app.job.companyName} • {app.job.location}
                          </>
                        ) : (
                          <>General Application</>
                        )}
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
                        {app.nationality} • Currently in {app.residence}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <Calendar className='h-4 w-4 text-muted-foreground' />
                      <span>Applied: {formatDate(app.createdAt)}</span>
                    </div>
                  </div>

                  {/* Personal Details */}
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t'>
                    <div>
                      <p className='text-xs text-muted-foreground mb-1'>
                        Education
                      </p>
                      <p className='font-semibold text-sm'>
                        {app.educationLevel}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground mb-1'>
                        English Level
                      </p>
                      <p className='font-semibold text-sm'>
                        {app.englishLevel}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground mb-1'>
                        Marital Status
                      </p>
                      <p className='font-semibold text-sm'>
                        {app.maritalStatus}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground mb-1'>
                        Passport
                      </p>
                      <p className='font-semibold text-sm'>
                        {app.hasPassport ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  {/* Languages */}
                  {app.languages && (
                    <div>
                      <p className='text-sm font-semibold mb-2'>Languages:</p>
                      <p className='text-sm text-muted-foreground'>
                        {app.languages}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {app.skills && (
                    <div>
                      <p className='text-sm font-semibold mb-2'>Skills:</p>
                      <p className='text-sm text-muted-foreground'>
                        {app.skills}
                      </p>
                    </div>
                  )}

                  {/* Experience */}
                  {app.hasExperience && app.experience && (
                    <div>
                      <p className='text-sm font-semibold mb-2'>Experience:</p>
                      <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                        {app.experience}
                      </p>
                    </div>
                  )}

                  {/* Motivation */}
                  {app.motivation && (
                    <div>
                      <p className='text-sm font-semibold mb-2'>Motivation:</p>
                      <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                        {app.motivation}
                      </p>
                    </div>
                  )}

                  {/* Documents */}
                  <div className='flex flex-wrap gap-2 pt-4 border-t'>
                    {app.resumeFile && (
                      <Button variant='outline' size='sm' asChild>
                        <a
                          href={app.resumeFile}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          View Resume
                        </a>
                      </Button>
                    )}
                    {app.diplomaFile && (
                      <Button variant='outline' size='sm' asChild>
                        <a
                          href={app.diplomaFile}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          View Diploma
                        </a>
                      </Button>
                    )}
                    {app.torFile && (
                      <Button variant='outline' size='sm' asChild>
                        <a
                          href={app.torFile}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          View Transcript
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Review Notes */}
                  <div className='pt-4 border-t'>
                    <div className='flex items-center justify-between mb-2'>
                      <p className='text-sm font-semibold'>Review Notes:</p>
                      {editingNotes !== app.id && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setEditingNotes(app.id)}
                        >
                          <FileEdit className='h-3 w-3 mr-1' />
                          {app.reviewNotes ? "Edit" : "Add Notes"}
                        </Button>
                      )}
                    </div>
                    {editingNotes === app.id ? (
                      <div className='space-y-2'>
                        <Textarea
                          placeholder='Add review notes for this application...'
                          value={reviewNotes[app.id] || ""}
                          onChange={(e) =>
                            setReviewNotes((prev) => ({
                              ...prev,
                              [app.id]: e.target.value,
                            }))
                          }
                          rows={4}
                          className='w-full'
                        />
                        <div className='flex gap-2'>
                          <Button
                            size='sm'
                            onClick={() => saveReviewNotes(app.id)}
                            disabled={updatingStatus === app.id}
                          >
                            Save Notes
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              setEditingNotes(null);
                              setReviewNotes((prev) => ({
                                ...prev,
                                [app.id]: app.reviewNotes || "",
                              }));
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : app.reviewNotes ? (
                      <p className='text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md'>
                        {app.reviewNotes}
                      </p>
                    ) : (
                      <p className='text-sm text-muted-foreground italic'>
                        No review notes yet
                      </p>
                    )}
                  </div>

                  {/* Status Actions */}
                  <div className='pt-4 border-t'>
                    <p className='text-sm font-semibold mb-3'>
                      Update Application Status:
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {getStatusButton(
                        app.id,
                        app.status,
                        "PENDING",
                        "Pending",
                        Clock,
                        "outline"
                      )}
                      {getStatusButton(
                        app.id,
                        app.status,
                        "REVIEWING",
                        "Under Review",
                        Eye,
                        "outline"
                      )}
                      {getStatusButton(
                        app.id,
                        app.status,
                        "APPROVED",
                        "Approve",
                        Check,
                        "default"
                      )}
                      {getStatusButton(
                        app.id,
                        app.status,
                        "REJECTED",
                        "Reject",
                        X,
                        "destructive"
                      )}
                    </div>
                    {updatingStatus === app.id && (
                      <p className='text-xs text-muted-foreground mt-2'>
                        Updating status...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-background p-8'>
          <div className='max-w-7xl mx-auto'>
            <div className='flex items-center justify-center h-64'>
              <p className='text-muted-foreground'>Loading applications...</p>
            </div>
          </div>
        </div>
      }
    >
      <ApplicationsPageContent />
    </Suspense>
  );
}
