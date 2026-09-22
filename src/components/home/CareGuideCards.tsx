import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { SpeciesTag } from "@/components/ui/SpeciesTag";
import { SPECIES, type Species } from "@/lib/species";

export interface CareGuideSummary {
  slug: string;
  title: string;
  summary: string | null;
}

interface CareGuideCardsProps {
  guidesBySpecies: Partial<Record<Species, CareGuideSummary>>;
}

const SPECIES_ORDER: Species[] = ["dog", "cat", "bearded_dragon"];

export function CareGuideCards({ guidesBySpecies }: CareGuideCardsProps) {
  return (
    <section>
      <h2 className="text-[28px] sm:text-[40px]">Care guides</h2>
      <p className="mt-2 max-w-2xl text-ink-2">
        Everything you need to know before and after you adopt.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {SPECIES_ORDER.map((key) => {
          const species = SPECIES[key];
          const guide = guidesBySpecies[key];

          return (
            <GlassCard key={key} noPadding className="flex flex-col gap-4 p-6">
              <div
                className={`flex h-32 items-center justify-center rounded-[20px] ${species.photo}`}
              >
                <SpeciesTag species={key} onPhoto />
              </div>
              <h3 className="text-xl">{guide?.title ?? `${species.label} care`}</h3>
              <p className="flex-1 text-sm text-ink-2">{guide?.summary ?? species.careTeaser}</p>
              <Link
                href={guide ? `/care-guides/${guide.slug}` : "/care-guides"}
                className="text-sm font-bold text-brand hover:underline"
              >
                Read the guide
              </Link>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
