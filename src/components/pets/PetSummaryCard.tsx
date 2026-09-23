import { GlassCard } from "@/components/ui/GlassCard";
import { SpeciesTag } from "@/components/ui/SpeciesTag";
import { SPECIES, type Species } from "@/lib/species";
import { formatFee } from "@/lib/pets";

interface PetSummaryCardProps {
  name: string;
  species: Species;
  adoptionFee: number | null;
  className?: string;
}

export function PetSummaryCard({ name, species, adoptionFee, className }: PetSummaryCardProps) {
  const info = SPECIES[species];

  return (
    <GlassCard strong className={className}>
      <div className={`flex h-28 items-center justify-center rounded-[20px] ${info.photo}`}>
        <span className="font-display text-2xl font-bold text-ink/70">{name}</span>
      </div>

      <div className="mt-5">
        <SpeciesTag species={species} />
        <h2 className="mt-2 text-2xl">{name}</h2>
      </div>

      <div className="mt-5 rounded-[16px] bg-white/65 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.5px] text-ink-3">Adoption fee</p>
        <p className="mt-1 text-xl font-bold text-ink">{formatFee(adoptionFee)}</p>
        <p className="mt-2 text-sm text-ink-2">
          Paid in person, after your meet and greet. No payment before then, and adoption is local
          pickup only.
        </p>
      </div>
    </GlassCard>
  );
}
