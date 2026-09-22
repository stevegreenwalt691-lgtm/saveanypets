import Link from "next/link";
import { SPECIES, type Species } from "@/lib/species";
import { buildAdoptHref, type AdoptFilters } from "@/lib/adopt-filters";
import { cn } from "@/lib/utils";

interface SpeciesChipsProps {
  filters: AdoptFilters;
}

const OPTIONS: { value: Species | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "dog", label: SPECIES.dog.plural },
  { value: "cat", label: SPECIES.cat.plural },
  { value: "bearded_dragon", label: SPECIES.bearded_dragon.plural },
];

export function SpeciesChips({ filters }: SpeciesChipsProps) {
  return (
    <div className="glass flex w-full gap-2 overflow-x-auto rounded-full p-2 sm:w-fit">
      {OPTIONS.map((option) => {
        const active = filters.species === option.value;
        return (
          <Link
            key={option.label}
            href={buildAdoptHref({ ...filters, species: option.value, page: 1 })}
            aria-current={active ? "true" : undefined}
            className={cn(
              "shrink-0 rounded-full px-5 py-3 text-sm font-bold transition-colors",
              active ? "bg-ink text-white" : "text-ink hover:bg-white/60",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
