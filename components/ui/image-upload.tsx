"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  required = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type on client side
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onChange(data.url);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className='space-y-2'>
      <Label>
        {label} {required && <span className='text-red-500'>*</span>}
      </Label>

      {value ? (
        <div className='space-y-2'>
          <div className='relative h-48 w-full rounded-lg overflow-hidden border'>
            <Image src={value} alt='Preview' fill className='object-cover' />
          </div>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={handleRemove}
              className='w-full'
            >
              <X className='mr-2 h-4 w-4' />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className='space-y-2'>
          <div className='flex gap-2'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleFileUpload}
              className='hidden'
              id='file-upload'
            />
            <Button
              type='button'
              variant='outline'
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className='flex-1'
            >
              {uploading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className='mr-2 h-4 w-4' />
                  Upload Image
                </>
              )}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => setShowUrlInput(!showUrlInput)}
            >
              Or Use URL
            </Button>
          </div>

          {showUrlInput && (
            <Input
              type='url'
              placeholder='https://example.com/image.jpg'
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );
}
