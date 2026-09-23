import Link from "next/link";
import { SPECIES, type Species } from "@/lib/species";
import { cn } from "@/lib/utils";

interface CareGuideSpeciesChipsProps {
  active?: Species;
}

const OPTIONS: { value: Species | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "dog", label: SPECIES.dog.plural },
  { value: "cat", label: SPECIES.cat.plural },
  { value: "bearded_dragon", label: SPECIES.bearded_dragon.plural },
];

export function CareGuideSpeciesChips({ active }: CareGuideSpeciesChipsProps) {
  return (
    <div className="glass flex w-full gap-2 overflow-x-auto rounded-full p-2 sm:w-fit">
      {OPTIONS.map((option) => {
        const isActive = active === option.value;
        const href = option.value ? `/care-guides?species=${option.value}` : "/care-guides";
        return (
          <Link
            key={option.label}
            href={href}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "shrink-0 rounded-full px-5 py-3 text-sm font-bold transition-colors",
              isActive ? "bg-ink text-white" : "text-ink hover:bg-white/60",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
