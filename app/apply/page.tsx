"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { DocumentUpload } from "@/components/ui/document-upload";

function ApplyPageContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // State for conditional fields
  const [hasPassport, setHasPassport] = useState<string>("No");
  const [hasExperience, setHasExperience] = useState<string>("No");
  const [consentChecked, setConsentChecked] = useState(false);

  // State for select fields
  const [maritalStatus, setMaritalStatus] = useState<string>("");
  const [educationLevel, setEducationLevel] = useState<string>("");
  const [englishLevel, setEnglishLevel] = useState<string>("");
  const [referralSource, setReferralSource] = useState<string>("");

  // State for file uploads
  const [torFile, setTorFile] = useState<string | null>(null);
  const [diplomaFile, setDiplomaFile] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<string | null>(null);

  const [jobInfo, setJobInfo] = useState<any>(null);

  useEffect(() => {
    if (jobId) {
      // Fetch job details
      fetch(`/api/v1/jobs/${jobId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setJobInfo(data.data);
          }
        })
        .catch((err) => console.error("Failed to fetch job details", err));
    }
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    const formData = new FormData(e.currentTarget);

    // Validate required select fields
    if (!maritalStatus) {
      setSubmitStatus({
        type: "error",
        message: "Please select your marital status.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!educationLevel) {
      setSubmitStatus({
        type: "error",
        message: "Please select your education level.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!englishLevel) {
      setSubmitStatus({
        type: "error",
        message: "Please select your English proficiency level.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!referralSource) {
      setSubmitStatus({
        type: "error",
        message: "Please tell us how you heard about us.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!consentChecked) {
      setSubmitStatus({
        type: "error",
        message: "Please agree to the terms and privacy policy.",
      });
      setIsSubmitting(false);
      return;
    }

    const applicationData = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      nationality: formData.get("nationality"),
      residence: formData.get("residence"),
      religion: formData.get("religion"),
      maritalStatus,
      hasPassport: hasPassport === "Yes",
      passportNumber:
        hasPassport === "Yes" ? formData.get("passportNumber") : null,
      startDate: formData.get("startDate"),
      educationLevel,
      torFile,
      diplomaFile,
      resumeFile,
      hasExperience: hasExperience === "Yes",
      experience: hasExperience === "Yes" ? formData.get("experience") : null,
      languages: formData.get("languages"),
      englishLevel,
      skills: formData.get("skills") || null,
      motivation: formData.get("motivation"),
      referralSource,
      consent: consentChecked,
      jobId: jobId || null,
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
        setMaritalStatus("");
        setEducationLevel("");
        setEnglishLevel("");
        setReferralSource("");
        setHasPassport("No");
        setHasExperience("No");
        setConsentChecked(false);
        setTorFile(null);
        setDiplomaFile(null);
        setResumeFile(null);
      } else {
        // Handle different error types
        let errorMessage = "Failed to submit application. Please try again.";
        
        if (response.status === 409) {
          errorMessage = result.error || "You have already submitted an application with this email.";
        } else if (result.error) {
          errorMessage = result.error;
        } else if (result.message) {
          errorMessage = result.message;
        }
        
        setSubmitStatus({
          type: "error",
          message: errorMessage,
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

  return (
    <div className='container mx-auto py-12 px-4 max-w-4xl'>
      <Card>
        <CardHeader>
          <CardTitle className='text-3xl'>Career Application</CardTitle>
          <CardDescription>
            {jobInfo ? (
              <>
                Applying for <strong>{jobInfo.title}</strong> at{" "}
                <strong>{jobInfo.companyName}</strong>
              </>
            ) : (
              "Fill out the form below to submit your application. All fields marked with * are required."
            )}
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
            {/* Section 1: Personal Information */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Personal Information</h3>

              <div className='space-y-2'>
                <Label htmlFor='fullName'>Full Name *</Label>
                <Input
                  id='fullName'
                  name='fullName'
                  placeholder='Enter your full name'
                  required
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email Address *</Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='name@email.com'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='phone'>Phone Number *</Label>
                  <Input
                    id='phone'
                    name='phone'
                    type='tel'
                    placeholder='+66 123 456 789'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='nationality'>Nationality *</Label>
                  <Input
                    id='nationality'
                    name='nationality'
                    placeholder='Enter your nationality'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='residence'>
                    Current Country of Residence *
                  </Label>
                  <Input
                    id='residence'
                    name='residence'
                    placeholder='Enter your current country'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='religion'>Religion *</Label>
                  <Input
                    id='religion'
                    name='religion'
                    placeholder='Enter your religion'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='maritalStatus'>Marital Status *</Label>
                  <Select
                    value={maritalStatus}
                    onValueChange={setMaritalStatus}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select your marital status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Single'>Single</SelectItem>
                      <SelectItem value='Married'>Married</SelectItem>
                      <SelectItem value='Divorced'>Divorced</SelectItem>
                      <SelectItem value='Widowed'>Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='space-y-2'>
                <Label>Do you have a valid passport? *</Label>
                <RadioGroup value={hasPassport} onValueChange={setHasPassport}>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='Yes' id='passport-yes' />
                    <Label
                      htmlFor='passport-yes'
                      className='font-normal cursor-pointer'
                    >
                      Yes
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='No' id='passport-no' />
                    <Label
                      htmlFor='passport-no'
                      className='font-normal cursor-pointer'
                    >
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {hasPassport === "Yes" && (
                <div className='space-y-2'>
                  <Label htmlFor='passportNumber'>Passport Number *</Label>
                  <Input
                    id='passportNumber'
                    name='passportNumber'
                    placeholder='Enter your passport number'
                    required={hasPassport === "Yes"}
                  />
                </div>
              )}
            </div>

            {/* Section 2: Job Preferences */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Job Preferences</h3>

              <div className='space-y-2'>
                <Label htmlFor='startDate'>Available Start Date *</Label>
                <Input id='startDate' name='startDate' type='date' required />
              </div>
            </div>

            {/* Section 3: Education & Documents */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Education & Documents</h3>

              <div className='space-y-2'>
                <Label htmlFor='educationLevel'>
                  Highest Education Level *
                </Label>
                <Select
                  value={educationLevel}
                  onValueChange={setEducationLevel}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select your education level' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='High School'>High School</SelectItem>
                    <SelectItem value="Bachelor's Degree">
                      Bachelor&apos;s Degree
                    </SelectItem>
                    <SelectItem value="Master's Degree">
                      Master&apos;s Degree
                    </SelectItem>
                    <SelectItem value='Other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DocumentUpload
                value={torFile}
                onChange={setTorFile}
                label='Transcript of Records (TOR)'
                description='Upload your transcript of records (PDF, DOC, DOCX - max 10MB)'
              />

              <DocumentUpload
                value={diplomaFile}
                onChange={setDiplomaFile}
                label='Degree or Diploma Certificate'
                description='Upload your degree or diploma certificate (PDF, DOC, DOCX - max 10MB)'
              />

              <DocumentUpload
                value={resumeFile}
                onChange={setResumeFile}
                label='CV or Resume'
                description='Upload your CV or resume (PDF, DOC, DOCX - max 10MB)'
              />
            </div>

            {/* Section 4: Experience & Skills */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Experience & Skills</h3>

              <div className='space-y-2'>
                <Label>Do you have teaching or work experience? *</Label>
                <RadioGroup
                  value={hasExperience}
                  onValueChange={setHasExperience}
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='Yes' id='experience-yes' />
                    <Label
                      htmlFor='experience-yes'
                      className='font-normal cursor-pointer'
                    >
                      Yes
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='No' id='experience-no' />
                    <Label
                      htmlFor='experience-no'
                      className='font-normal cursor-pointer'
                    >
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {hasExperience === "Yes" && (
                <div className='space-y-2'>
                  <Label htmlFor='experience'>
                    Briefly describe your experience *
                  </Label>
                  <Textarea
                    id='experience'
                    name='experience'
                    placeholder='Briefly describe your experience'
                    rows={4}
                    required={hasExperience === "Yes"}
                  />
                </div>
              )}

              <div className='space-y-2'>
                <Label htmlFor='languages'>Languages You Speak *</Label>
                <Input
                  id='languages'
                  name='languages'
                  placeholder='e.g., English, Thai, Chinese'
                  required
                />
                <p className='text-sm text-muted-foreground'>
                  Enter languages separated by commas
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='englishLevel'>English Proficiency *</Label>
                <Select
                  value={englishLevel}
                  onValueChange={setEnglishLevel}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select your level' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Fluent'>Fluent</SelectItem>
                    <SelectItem value='Intermediate'>Intermediate</SelectItem>
                    <SelectItem value='Basic'>Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='skills'>Other Relevant Skills</Label>
                <Textarea
                  id='skills'
                  name='skills'
                  placeholder='e.g., computer skills, certifications, etc.'
                  rows={3}
                />
              </div>
            </div>

            {/* Section 5: Additional Details */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Additional Details</h3>

              <div className='space-y-2'>
                <Label htmlFor='motivation'>
                  Why do you want to work abroad? *
                </Label>
                <Textarea
                  id='motivation'
                  name='motivation'
                  placeholder='Share your goals or motivations'
                  rows={4}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='referralSource'>
                  How did you hear about us? *
                </Label>
                <Select
                  value={referralSource}
                  onValueChange={setReferralSource}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select an option' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Facebook'>Facebook</SelectItem>
                    <SelectItem value='Google'>Google</SelectItem>
                    <SelectItem value='Tiktok'>Tiktok</SelectItem>
                    <SelectItem value='Friend'>Friend</SelectItem>
                    <SelectItem value='Other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Section 6: Consent & Submit */}
            <div className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='consent'
                  checked={consentChecked}
                  onCheckedChange={(checked: boolean) =>
                    setConsentChecked(checked === true)
                  }
                />
                <Label
                  htmlFor='consent'
                  className='text-sm font-normal cursor-pointer'
                >
                  I agree to the terms and privacy policy *
                </Label>
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

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className='container mx-auto py-12 px-4 max-w-4xl'>
          <div className='text-center'>Loading application form...</div>
        </div>
      }
    >
      <ApplyPageContent />
    </Suspense>
  );
}
