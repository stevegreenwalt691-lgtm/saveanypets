"use client";

import { useRef, useState, useTransition } from "react";
import type { ChangeEvent } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown, Star, Trash2, Upload } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { uploadPetPhoto, setPrimaryPetPhoto, movePetPhoto, deletePetPhoto } from "@/lib/actions/pet-photos";
import { getPetPhotoUrl, type PetPhotoSummary } from "@/lib/pets";
import { resizeImageToWebp } from "@/lib/image-resize";

interface PhotoActionResult {
  ok: boolean;
  errors?: { form?: string[] };
}

interface PhotoManagerProps {
  petId: string;
  slug: string;
  photos: PetPhotoSummary[];
}

export function PhotoManager({ petId, slug, photos }: PhotoManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [altText, setAltText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, startUploadTransition] = useTransition();
  const [isPending, startTransition] = useTransition();

  const sorted = [...photos].sort((a, b) => a.sort_order - b.sort_order);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!altText.trim()) {
      setError("Add alt text before choosing a photo.");
      return;
    }

    setError(null);
    startUploadTransition(async () => {
      try {
        const webp = await resizeImageToWebp(file);
        const formData = new FormData();
        formData.set("pet_id", petId);
        formData.set("slug", slug);
        formData.set("alt", altText.trim());
        formData.set("file", new File([webp], "photo.webp", { type: "image/webp" }));

        const result = await uploadPetPhoto(formData);
        if (!result.ok) {
          setError(result.errors.form?.[0] ?? "Could not upload the photo.");
          return;
        }
        setAltText("");
      } catch {
        setError("Could not process that image. Try a different file.");
      }
    });
  }

  function runPhotoAction(action: () => Promise<PhotoActionResult>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) setError(result.errors?.form?.[0] ?? "Something went wrong.");
    });
  }

  return (
    <GlassCard className="flex flex-col gap-5">
      <h2 className="text-2xl">Photos</h2>

      {sorted.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((photo, index) => (
            <li key={photo.id} className="flex flex-col gap-2 rounded-[16px] bg-white/65 p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[12px]">
                <Image
                  src={getPetPhotoUrl(photo.path)}
                  alt={photo.alt ?? ""}
                  fill
                  sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
                {photo.is_primary ? (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white">
                    <Star className="h-3 w-3" strokeWidth={2} fill="currentColor" />
                    Primary
                  </span>
                ) : null}
              </div>
              <p className="truncate text-xs text-ink-3">{photo.alt}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  disabled={index === 0 || isPending}
                  onClick={() => runPhotoAction(() => movePetPhoto(petId, slug, photo.id, "up"))}
                  aria-label="Move up"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 hover:bg-white/80 disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  disabled={index === sorted.length - 1 || isPending}
                  onClick={() => runPhotoAction(() => movePetPhoto(petId, slug, photo.id, "down"))}
                  aria-label="Move down"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 hover:bg-white/80 disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" strokeWidth={2} />
                </button>
                {!photo.is_primary ? (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => runPhotoAction(() => setPrimaryPetPhoto(photo.id, petId, slug))}
                    className="rounded-full px-3 py-1.5 text-xs font-bold text-ink-2 hover:bg-white/80"
                  >
                    Set primary
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => runPhotoAction(() => deletePetPhoto(photo.id, petId, slug))}
                  aria-label="Delete photo"
                  className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-danger hover:bg-white/80 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-2">No photos yet.</p>
      )}

      <div className="rounded-[16px] bg-white/65 p-4">
        <p className="text-sm font-bold text-ink">Add a photo</p>
        <p className="mt-1 text-xs text-ink-3">Resized to 1600px wide and converted to webp automatically.</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Alt text"
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Rex sitting in the yard"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            pill={false}
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" strokeWidth={2} />
            {isUploading ? "Uploading..." : "Choose photo"}
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>
        {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
      </div>
    </GlassCard>
  );
}
