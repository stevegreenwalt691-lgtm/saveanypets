"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { getPetPhotoUrl, type PetPhotoSummary } from "@/lib/pets";
import { cn } from "@/lib/utils";

interface PetGalleryProps {
  petName: string;
  photos: PetPhotoSummary[];
  videoUrl: string | null;
}

export function PetGallery({ petName, photos, videoUrl }: PetGalleryProps) {
  const sorted = [...photos].sort((a, b) => a.sort_order - b.sort_order);
  const primaryIndex = Math.max(
    sorted.findIndex((photo) => photo.is_primary),
    0,
  );
  const [activeIndex, setActiveIndex] = useState(primaryIndex);
  const active = sorted[activeIndex] ?? sorted[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative min-h-[320px] overflow-hidden rounded-[28px] sm:min-h-[500px]">
        <Image
          src={getPetPhotoUrl(active.path)}
          alt={active.alt ?? `${petName}, waiting to be adopted`}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover"
          priority
        />
        {videoUrl ? (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-ink"
          >
            <PlayCircle className="h-4 w-4" strokeWidth={1.8} />
            Watch video
          </a>
        ) : null}
      </div>

      {sorted.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {sorted.slice(0, 4).map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show photo ${index + 1} of ${petName}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-[14px] border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                index === activeIndex ? "border-brand" : "border-transparent",
              )}
            >
              <Image
                src={getPetPhotoUrl(photo.path)}
                alt={photo.alt ?? `${petName}, photo ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
