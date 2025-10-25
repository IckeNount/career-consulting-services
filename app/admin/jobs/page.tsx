"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

const jobTypeLabels = {
  FULL_TIME: "Full-time",
  CONTRACT: "Contract",
  SUBSTITUTE: "Substitute Teacher",
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/jobs/admin/all");

      if (!res.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await res.json();
      setJobs(data.data || []);
    } catch (err) {
      setError("Failed to load jobs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete job");
      }

      // Refresh the list
      fetchJobs();
    } catch (err) {
      alert("Failed to delete job");
      console.error(err);
    }
  };

  const toggleActive = async (jobId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/v1/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update job");
      }

      // Refresh the list
      fetchJobs();
    } catch (err) {
      alert("Failed to update job status");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className='container py-10'>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className='container py-10'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>Job Vacancies</h1>
          <p className='text-muted-foreground'>
            Manage job postings and view applications
          </p>
        </div>
        <Button asChild>
          <Link href='/admin/jobs/new'>Create New Job</Link>
        </Button>
      </div>

      {error && (
        <div className='bg-destructive/15 text-destructive px-4 py-3 rounded mb-6'>
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center'>
            <p className='text-muted-foreground mb-4'>
              No job postings yet. Create your first job posting to get started.
            </p>
            <Button asChild>
              <Link href='/admin/jobs/new'>Create Job Posting</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='flex-grow'>
                    <div className='flex items-center gap-3 mb-2'>
                      <CardTitle className='text-xl'>{job.title}</CardTitle>
                      <Badge variant='secondary'>
                        {jobTypeLabels[job.jobType]}
                      </Badge>
                      <Badge variant={job.isActive ? "default" : "outline"}>
                        {job.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {job.companyName} • {job.location}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4 md:grid-cols-2 mb-4'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground mb-1'>
                      Description
                    </p>
                    <p className='text-sm line-clamp-2'>{job.description}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground mb-1'>
                      Details
                    </p>
                    <div className='text-sm space-y-1'>
                      {job.salaryRange && <p>💰 {job.salaryRange}</p>}
                      {job.applicationDeadline && (
                        <p>
                          📅 Deadline:{" "}
                          {new Date(
                            job.applicationDeadline
                          ).toLocaleDateString()}
                        </p>
                      )}
                      <p>📝 {job._count.applications} Applications</p>
                    </div>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => router.push(`/admin/jobs/${job.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => toggleActive(job.id, job.isActive)}
                  >
                    {job.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      router.push(`/admin/applications?jobId=${job.id}`)
                    }
                  >
                    View Applications ({job._count.applications})
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
