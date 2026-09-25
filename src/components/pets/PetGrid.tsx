import { PetCard } from "@/components/pets/PetCard";
import type { PetSummary } from "@/lib/pets";
import { cn } from "@/lib/utils";

interface PetGridProps {
  pets: PetSummary[];
  columns?: 3 | 4;
  emptyMessage?: string;
}

export function PetGrid({ pets, columns = 3, emptyMessage }: PetGridProps) {
  if (pets.length === 0) {
    return (
      <div className="glass rounded-[28px] p-10 text-center">
        <p className="text-lg font-bold text-ink">
          {emptyMessage ?? "No pets match those filters yet."}
        </p>
        <p className="mt-2 text-sm text-ink-2">
          Try widening your search, or check back soon, new pets arrive often.
        </p>
      </div>
    );
  }

  const sizes =
    columns === 4
      ? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2",
        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
      )}
    >
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} sizes={sizes} />
      ))}
    </div>
  );
}
