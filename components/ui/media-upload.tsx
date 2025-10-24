"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, Image as ImageIcon, Video, Loader2 } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";

interface MediaItem {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  caption?: string;
}

interface MediaUploadProps {
  value: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  label?: string;
  maxFiles?: number;
}

export function MediaUpload({
  value = [],
  onChange,
  label = "Media Gallery",
  maxFiles = 20,
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (value.length + acceptedFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      setUploading(true);

      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const fileId = Math.random().toString(36).substring(7);
          setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

          const response = await fetch("/api/v1/upload", {
            method: "POST",
            body: formData,
          });

          setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));

          if (!response.ok) {
            throw new Error(`Failed to upload ${file.name}`);
          }

          const data = await response.json();

          // Determine media type
          const type = file.type.startsWith("video/") ? "VIDEO" : "IMAGE";

          return {
            id: fileId,
            url: data.url,
            type,
            caption: undefined, // Use undefined instead of empty string for consistency with DB null
          } as MediaItem;
        });

        const results = await Promise.allSettled(uploadPromises);

        const succeeded: MediaItem[] = results
          .filter(
            (r): r is PromiseFulfilledResult<MediaItem> =>
              r.status === "fulfilled"
          )
          .map((r) => r.value);
        const failed = results.filter((r) => r.status === "rejected");

        if (succeeded.length > 0) {
          onChange([...value, ...succeeded]);
        }

        if (failed.length > 0) {
          alert(
            `${failed.length} file(s) failed to upload. Successfully uploaded ${succeeded.length} file(s).`
          );
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload files. Please try again.");
      } finally {
        setUploading(false);
        setUploadProgress({});
      }
    },
    [value, onChange, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "video/*": [".mp4", ".webm", ".ogg", ".mov"],
    },
    multiple: true,
    disabled: uploading || value.length >= maxFiles,
  });

  const removeMedia = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const updateCaption = (id: string, caption: string) => {
    onChange(
      value.map((item) => (item.id === id ? { ...item, caption } : item))
    );
  };

  const moveMedia = (fromIndex: number, toIndex: number) => {
    const newMedia = [...value];
    const [removed] = newMedia.splice(fromIndex, 1);
    newMedia.splice(toIndex, 0, removed);
    onChange(newMedia);
  };

  return (
    <div className='space-y-4'>
      <div>
        <label className='text-sm font-medium'>{label}</label>
        <p className='text-xs text-muted-foreground mt-1'>
          Upload images and videos for your blog post gallery. Supports drag &
          drop.
        </p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        } ${
          uploading || value.length >= maxFiles
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className='flex flex-col items-center gap-2'>
          {uploading ? (
            <>
              <Loader2 className='h-10 w-10 text-primary animate-spin' />
              <p className='text-sm text-muted-foreground'>
                Uploading files...
              </p>
            </>
          ) : (
            <>
              <Upload className='h-10 w-10 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>
                  {isDragActive
                    ? "Drop files here..."
                    : "Drag & drop files here, or click to select"}
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Supports images (PNG, JPG, GIF, WebP) and videos (MP4, WebM,
                  MOV)
                </p>
                <p className='text-xs text-muted-foreground'>
                  {value.length}/{maxFiles} files uploaded
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Media Grid */}
      {value.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {value.map((item, index) => (
            <div
              key={item.id}
              className='relative border rounded-lg overflow-hidden group'
            >
              {/* Preview */}
              <div className='aspect-video relative bg-muted'>
                {item.type === "IMAGE" ? (
                  <Image
                    src={item.url}
                    alt={item.caption || "Media"}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <video
                    src={item.url}
                    className='w-full h-full object-cover'
                    controls
                  />
                )}
                <div className='absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs flex items-center gap-1'>
                  {item.type === "IMAGE" ? (
                    <ImageIcon className='h-3 w-3' />
                  ) : (
                    <Video className='h-3 w-3' />
                  )}
                  <span>{item.type}</span>
                </div>
              </div>

              {/* Remove Button */}
              <Button
                variant='destructive'
                size='icon'
                className='absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity'
                onClick={() => removeMedia(item.id)}
              >
                <X className='h-4 w-4' />
              </Button>

              {/* Caption Input */}
              <div className='p-2'>
                <input
                  type='text'
                  placeholder='Add caption (optional)'
                  value={item.caption || ""}
                  onChange={(e) => updateCaption(item.id, e.target.value)}
                  className='w-full text-xs border rounded px-2 py-1 bg-background'
                />
              </div>

              {/* Order Controls - positioned above caption input to avoid overlap */}
              <div className='absolute bottom-14 right-2 flex gap-1'>
                {index > 0 && (
                  <Button
                    variant='secondary'
                    size='sm'
                    className='h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity'
                    onClick={() => moveMedia(index, index - 1)}
                  >
                    ←
                  </Button>
                )}
                {index < value.length - 1 && (
                  <Button
                    variant='secondary'
                    size='sm'
                    className='h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity'
                    onClick={() => moveMedia(index, index + 1)}
                  >
                    →
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
