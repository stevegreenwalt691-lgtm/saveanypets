import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PET_SUMMARY_COLUMNS, PUBLIC_PET_STATUSES, type PetSummary } from "@/lib/pets";
import { Hero } from "@/components/home/Hero";
import { AdoptionSteps } from "@/components/home/AdoptionSteps";
import { CareGuideCards, type CareGuideSummary } from "@/components/home/CareGuideCards";
import { GetInvolvedCards } from "@/components/home/GetInvolvedCards";
import { PetGrid } from "@/components/pets/PetGrid";
import type { Species } from "@/lib/species";

export default async function Home() {
  const supabase = await createClient();

  const [petCountResult, featuredResult, guidesResult] = await Promise.all([
    supabase
      .from("pets")
      .select("id", { count: "exact", head: true })
      .in("status", PUBLIC_PET_STATUSES),
    supabase
      .from("pets")
      .select(PET_SUMMARY_COLUMNS)
      .in("status", PUBLIC_PET_STATUSES)
      .order("featured", { ascending: false })
      .order("intake_date", { ascending: false })
      .limit(4),
    supabase
      .from("care_guides")
      .select("slug, species, title, summary")
      .eq("published", true)
      .order("updated_at", { ascending: false }),
  ]);

  const petCount = petCountResult.count ?? 0;
  const featuredPets = (featuredResult.data ?? []) as PetSummary[];

  const guidesBySpecies: Partial<Record<Species, CareGuideSummary>> = {};
  for (const guide of guidesResult.data ?? []) {
    if (guide.species && !guidesBySpecies[guide.species]) {
      guidesBySpecies[guide.species] = {
        slug: guide.slug,
        title: guide.title,
        summary: guide.summary,
      };
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-20 px-4 pb-20 sm:px-14">
      <Hero petCount={petCount} />

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-[28px] sm:text-[40px]">Waiting to meet you</h2>
          <Link href="/adopt" className="text-sm font-bold text-brand hover:underline">
            See all pets
          </Link>
        </div>
        <div className="mt-8">
          <PetGrid pets={featuredPets} columns={4} emptyMessage="New pets are being added soon." />
        </div>
      </section>

      <AdoptionSteps />

      <CareGuideCards guidesBySpecies={guidesBySpecies} />

      <GetInvolvedCards />
    </main>
  );
}
