"use client";

import { useRef, useState, useTransition } from "react";
import type { ChangeEvent } from "react";
import Image from "next/image";
import { Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { resizeImageToWebp } from "@/lib/image-resize";

interface ImageActionResult {
  ok: boolean;
  error?: string;
}

interface SingleImageUploaderProps {
  label: string;
  helpText?: string;
  imageUrl: string | null;
  onUpload: (file: File) => Promise<ImageActionResult>;
  onDelete?: () => Promise<ImageActionResult>;
}

export function SingleImageUploader({ label, helpText, imageUrl, onUpload, onDelete }: SingleImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, startUploadTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    startUploadTransition(async () => {
      try {
        const webp = await resizeImageToWebp(file);
        const result = await onUpload(new File([webp], "image.webp", { type: "image/webp" }));
        if (!result.ok) setError(result.error ?? "Could not upload the image.");
      } catch {
        setError("Could not process that image. Try a different file.");
      }
    });
  }

  function handleDelete() {
    if (!onDelete) return;
    setError(null);
    startDeleteTransition(async () => {
      const result = await onDelete();
      if (!result.ok) setError(result.error ?? "Could not remove the image.");
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-bold text-ink">{label}</p>
      {helpText ? <p className="text-xs text-ink-3">{helpText}</p> : null}

      {imageUrl ? (
        <div className="relative aspect-[16/9] w-full max-w-sm overflow-hidden rounded-[16px]">
          <Image src={imageUrl} alt="" fill sizes="400px" className="object-cover" />
        </div>
      ) : (
        <p className="text-sm text-ink-2">No image yet.</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          pill={false}
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" strokeWidth={2} />
          {isUploading ? "Uploading..." : imageUrl ? "Replace image" : "Choose image"}
        </Button>
        {imageUrl && onDelete ? (
          <Button type="button" variant="ghost" pill={false} disabled={isDeleting} onClick={handleDelete}>
            <Trash2 className="h-4 w-4" strokeWidth={2} />
            Remove
          </Button>
        ) : null}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
