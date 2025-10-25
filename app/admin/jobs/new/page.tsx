"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    location: "",
    salaryRange: "",
    description: "",
    requirements: "",
    jobType: "FULL_TIME",
    applicationDeadline: "",
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create job");
      }

      router.push("/admin/jobs");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create job posting");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className='container max-w-3xl py-10'>
      <div className='mb-6'>
        <Button variant='ghost' onClick={() => router.back()}>
          ← Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Job Posting</CardTitle>
          <CardDescription>
            Fill in the details to create a new job vacancy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <div className='bg-destructive/15 text-destructive px-4 py-3 rounded'>
                {error}
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='title'>Job Title *</Label>
              <Input
                id='title'
                name='title'
                value={formData.title}
                onChange={handleChange}
                required
                placeholder='e.g., English Teacher'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='companyName'>Company/School Name *</Label>
              <Input
                id='companyName'
                name='companyName'
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder='e.g., International School of Tokyo'
              />
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='location'>Location *</Label>
                <Input
                  id='location'
                  name='location'
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder='e.g., Tokyo, Japan'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='jobType'>Job Type *</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, jobType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='FULL_TIME'>Full-time</SelectItem>
                    <SelectItem value='CONTRACT'>Contract</SelectItem>
                    <SelectItem value='SUBSTITUTE'>
                      Substitute Teacher
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='salaryRange'>Salary Range</Label>
                <Input
                  id='salaryRange'
                  name='salaryRange'
                  value={formData.salaryRange}
                  onChange={handleChange}
                  placeholder='e.g., $40,000 - $60,000/year'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='applicationDeadline'>
                  Application Deadline
                </Label>
                <Input
                  id='applicationDeadline'
                  name='applicationDeadline'
                  type='date'
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Job Description *</Label>
              <Textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder='Describe the role, responsibilities, and what makes this opportunity exciting...'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='requirements'>Requirements *</Label>
              <Textarea
                id='requirements'
                name='requirements'
                value={formData.requirements}
                onChange={handleChange}
                required
                rows={5}
                placeholder='List the qualifications, skills, and experience required for this position...'
              />
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='isActive'
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className='h-4 w-4 rounded border-gray-300'
              />
              <Label htmlFor='isActive' className='font-normal'>
                Make this job posting active immediately
              </Label>
            </div>

            <div className='flex gap-4'>
              <Button type='submit' disabled={loading}>
                {loading ? "Creating..." : "Create Job Posting"}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
