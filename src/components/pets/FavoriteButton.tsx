"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/lib/favorites";
import { useIsFavorite } from "@/lib/use-favorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  petId: string;
  petName: string;
  className?: string;
}

export function FavoriteButton({ petId, petName, className }: FavoriteButtonProps) {
  const favorited = useIsFavorite(petId);
  const [justSaved, setJustSaved] = useState(false);

  return (
    <button
      type="button"
      aria-label={favorited ? `Remove ${petName} from favourites` : `Save ${petName} to favourites`}
      aria-pressed={favorited}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const nowFavorited = toggleFavorite(petId);
        if (nowFavorited) {
          setJustSaved(true);
          window.setTimeout(() => setJustSaved(false), 220);
        }
      }}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-ink transition-transform duration-200 motion-reduce:transition-none",
        justSaved && "scale-110",
        className,
      )}
    >
      <Heart
        className={cn(favorited ? "fill-brand text-brand" : "text-ink", "h-5 w-5")}
        strokeWidth={1.8}
      />
    </button>
  );
}
