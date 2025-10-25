"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, File, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "./button";

interface DocumentUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label: string;
  accept?: Record<string, string[]>;
  maxSize?: number;
  required?: boolean;
  description?: string;
}

export function DocumentUpload({
  value,
  onChange,
  label,
  accept = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
  },
  maxSize = 10 * 1024 * 1024, // 10MB default
  required = false,
  description = "Upload a PDF, DOC, or DOCX file (max 10MB)",
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      setUploadError(null);

      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === "file-too-large") {
          setUploadError(
            `File is too large. Maximum size is ${maxSize / 1024 / 1024}MB`
          );
        } else if (error.code === "file-invalid-type") {
          setUploadError(
            "Invalid file type. Please upload a PDF, DOC, or DOCX file"
          );
        } else {
          setUploadError(error.message);
        }
        return;
      }

      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setUploading(true);
      setFileName(file.name);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/v1/upload/documents", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to upload document");
        }

        const data = await response.json();
        onChange(data.url);
      } catch (error) {
        console.error("Upload error:", error);
        setUploadError(
          error instanceof Error ? error.message : "Failed to upload document"
        );
        onChange(null);
      } finally {
        setUploading(false);
      }
    },
    [onChange, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize,
    multiple: false,
    disabled: uploading,
  });

  const removeDocument = () => {
    onChange(null);
    setFileName(null);
    setUploadError(null);
  };

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>

      {/* Show upload zone when no file is uploaded */}
      {!value && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center gap-2'>
            {uploading ? (
              <>
                <Loader2 className='h-8 w-8 text-primary animate-spin' />
                <p className='text-sm text-muted-foreground'>
                  Uploading {fileName}...
                </p>
              </>
            ) : (
              <>
                <Upload className='h-8 w-8 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>
                    {isDragActive
                      ? "Drop the file here..."
                      : "Drag & drop a file here, or click to select"}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {description}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Show uploaded file */}
      {value && (
        <div className='border rounded-lg p-4 bg-muted/50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='h-10 w-10 rounded bg-primary/10 flex items-center justify-center'>
                <CheckCircle2 className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>
                  {fileName || "Document uploaded"}
                </p>
                <p className='text-xs text-muted-foreground'>
                  Click to view or remove
                </p>
              </div>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={removeDocument}
              className='h-8 w-8'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <p className='text-xs text-red-500 mt-1'>{uploadError}</p>
      )}
    </div>
  );
}
