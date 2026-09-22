"use client";

import { useEffect, useState } from "react";
import { useFavoriteIds } from "@/lib/use-favorites";
import { createClient } from "@/lib/supabase/client";
import { PetGrid } from "@/components/pets/PetGrid";
import { PET_SUMMARY_COLUMNS, PUBLIC_PET_STATUSES, type PetSummary } from "@/lib/pets";

export default function FavoritesPage() {
  const favoriteIds = useFavoriteIds();
  const [pets, setPets] = useState<PetSummary[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (favoriteIds.length === 0) {
      Promise.resolve().then(() => {
        if (!cancelled) setPets([]);
      });
      return () => {
        cancelled = true;
      };
    }

    const supabase = createClient();
    supabase
      .from("pets")
      .select(PET_SUMMARY_COLUMNS)
      .in("id", favoriteIds)
      .in("status", PUBLIC_PET_STATUSES)
      .then(({ data }) => {
        if (!cancelled) setPets((data ?? []) as PetSummary[]);
      });

    return () => {
      cancelled = true;
    };
  }, [favoriteIds]);

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-14">
      <h1 className="text-[34px] sm:text-[52px]">Your favourites</h1>
      <p className="mt-1 text-ink-2">Pets you have saved on this device.</p>

      <div className="mt-8">
        {pets === null ? (
          <p className="text-sm text-ink-2">Loading your favourites...</p>
        ) : (
          <PetGrid pets={pets} emptyMessage="You have not saved any favourites yet." />
        )}
      </div>
    </main>
  );
}
