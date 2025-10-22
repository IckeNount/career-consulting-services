"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LanguageEntry = {
  language: string;
  proficiency: "BASIC" | "INTERMEDIATE" | "ADVANCED" | "NATIVE";
};

export default function ApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [languages, setLanguages] = useState<LanguageEntry[]>([
    { language: "", proficiency: "INTERMEDIATE" },
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    const formData = new FormData(e.currentTarget);

    // Parse skills (comma-separated)
    const skillsInput = formData.get("skills") as string;
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Filter out empty languages
    const validLanguages = languages.filter(
      (lang) => lang.language.trim().length > 0
    );

    const applicationData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      dateOfBirth: formData.get("dateOfBirth"),
      nationality: formData.get("nationality"),
      currentLocation: formData.get("currentLocation"),
      desiredCountry: formData.get("desiredCountry"),
      desiredPosition: formData.get("desiredPosition"),
      yearsExperience: parseInt(formData.get("yearsExperience") as string) || 0,
      currentSalary: formData.get("currentSalary")
        ? parseFloat(formData.get("currentSalary") as string)
        : undefined,
      expectedSalary: formData.get("expectedSalary")
        ? parseFloat(formData.get("expectedSalary") as string)
        : undefined,
      educationLevel: formData.get("educationLevel"),
      resumeUrl: formData.get("resumeUrl") || undefined,
      coverLetterUrl: formData.get("coverLetterUrl") || undefined,
      portfolioUrl: formData.get("portfolioUrl") || undefined,
      linkedInUrl: formData.get("linkedInUrl") || undefined,
      skills,
      languages: validLanguages,
      notes: formData.get("notes") || undefined,
    };

    try {
      const response = await fetch("/api/v1/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            result.data?.message || "Application submitted successfully!",
        });
        // Reset form
        (e.target as HTMLFormElement).reset();
        setLanguages([{ language: "", proficiency: "INTERMEDIATE" }]);
      } else {
        setSubmitStatus({
          type: "error",
          message:
            result.message || "Failed to submit application. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: "", proficiency: "INTERMEDIATE" }]);
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const updateLanguage = (
    index: number,
    field: keyof LanguageEntry,
    value: string
  ) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    setLanguages(updated);
  };

  return (
    <div className='container mx-auto py-12 px-4 max-w-4xl'>
      <Card>
        <CardHeader>
          <CardTitle className='text-3xl'>Career Application</CardTitle>
          <CardDescription>
            Fill out the form below to submit your application. All fields
            marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitStatus.type && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                submitStatus.type === "success"
                  ? "bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Personal Information */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Personal Information</h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='firstName'>First Name *</Label>
                  <Input id='firstName' name='firstName' required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='lastName'>Last Name *</Label>
                  <Input id='lastName' name='lastName' required />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email *</Label>
                  <Input id='email' name='email' type='email' required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='phone'>Phone *</Label>
                  <Input
                    id='phone'
                    name='phone'
                    type='tel'
                    placeholder='+1234567890'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='dateOfBirth'>Date of Birth *</Label>
                  <Input
                    id='dateOfBirth'
                    name='dateOfBirth'
                    type='date'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='nationality'>Nationality *</Label>
                  <Input
                    id='nationality'
                    name='nationality'
                    placeholder='e.g., United States'
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location & Position */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Location & Position</h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='currentLocation'>Current Location *</Label>
                  <Input
                    id='currentLocation'
                    name='currentLocation'
                    placeholder='City, Country'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='desiredCountry'>Desired Country *</Label>
                  <Input
                    id='desiredCountry'
                    name='desiredCountry'
                    placeholder='Where do you want to work?'
                    required
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='desiredPosition'>Desired Position *</Label>
                <Input
                  id='desiredPosition'
                  name='desiredPosition'
                  placeholder='e.g., Software Engineer'
                  required
                />
              </div>
            </div>

            {/* Experience & Education */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Experience & Education</h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='yearsExperience'>Years of Experience *</Label>
                  <Input
                    id='yearsExperience'
                    name='yearsExperience'
                    type='number'
                    min='0'
                    defaultValue='0'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='educationLevel'>Education Level *</Label>
                  <Select name='educationLevel' required>
                    <SelectTrigger>
                      <SelectValue placeholder='Select education level' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='HIGH_SCHOOL'>High School</SelectItem>
                      <SelectItem value='ASSOCIATE'>
                        Associate Degree
                      </SelectItem>
                      <SelectItem value='BACHELOR'>
                        Bachelor&apos;s Degree
                      </SelectItem>
                      <SelectItem value='MASTER'>
                        Master&apos;s Degree
                      </SelectItem>
                      <SelectItem value='PHD'>PhD</SelectItem>
                      <SelectItem value='OTHER'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='currentSalary'>Current Salary (USD)</Label>
                  <Input
                    id='currentSalary'
                    name='currentSalary'
                    type='number'
                    min='0'
                    placeholder='Optional'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='expectedSalary'>Expected Salary (USD)</Label>
                  <Input
                    id='expectedSalary'
                    name='expectedSalary'
                    type='number'
                    min='0'
                    placeholder='Optional'
                  />
                </div>
              </div>
            </div>

            {/* Skills & Languages */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Skills & Languages</h3>

              <div className='space-y-2'>
                <Label htmlFor='skills'>Skills *</Label>
                <Input
                  id='skills'
                  name='skills'
                  placeholder='JavaScript, Python, React, etc. (comma-separated)'
                  required
                />
                <p className='text-sm text-muted-foreground'>
                  Enter skills separated by commas
                </p>
              </div>

              <div className='space-y-2'>
                <Label>Languages</Label>
                {languages.map((lang, index) => (
                  <div key={index} className='flex gap-2'>
                    <Input
                      placeholder='Language name'
                      value={lang.language}
                      onChange={(e) =>
                        updateLanguage(index, "language", e.target.value)
                      }
                      className='flex-1'
                    />
                    <Select
                      value={lang.proficiency}
                      onValueChange={(value: any) =>
                        updateLanguage(index, "proficiency", value)
                      }
                    >
                      <SelectTrigger className='w-40'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='BASIC'>Basic</SelectItem>
                        <SelectItem value='INTERMEDIATE'>
                          Intermediate
                        </SelectItem>
                        <SelectItem value='ADVANCED'>Advanced</SelectItem>
                        <SelectItem value='NATIVE'>Native</SelectItem>
                      </SelectContent>
                    </Select>
                    {languages.length > 1 && (
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => removeLanguage(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button type='button' variant='outline' onClick={addLanguage}>
                  + Add Language
                </Button>
              </div>
            </div>

            {/* Documents */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Documents & Links</h3>

              <div className='space-y-2'>
                <Label htmlFor='resumeUrl'>Resume URL</Label>
                <Input
                  id='resumeUrl'
                  name='resumeUrl'
                  type='url'
                  placeholder='https://...'
                />
                <p className='text-sm text-muted-foreground'>
                  Link to your resume (Google Drive, Dropbox, etc.)
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='coverLetterUrl'>Cover Letter URL</Label>
                <Input
                  id='coverLetterUrl'
                  name='coverLetterUrl'
                  type='url'
                  placeholder='https://...'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='portfolioUrl'>Portfolio URL</Label>
                <Input
                  id='portfolioUrl'
                  name='portfolioUrl'
                  type='url'
                  placeholder='https://...'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='linkedInUrl'>LinkedIn URL</Label>
                <Input
                  id='linkedInUrl'
                  name='linkedInUrl'
                  type='url'
                  placeholder='https://linkedin.com/in/...'
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Additional Information</h3>

              <div className='space-y-2'>
                <Label htmlFor='notes'>Notes</Label>
                <Textarea
                  id='notes'
                  name='notes'
                  placeholder="Any additional information you'd like to share..."
                  rows={4}
                />
              </div>
            </div>

            <Button
              type='submit'
              className='w-full'
              size='lg'
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
