import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { SpeciesTag } from "@/components/ui/SpeciesTag";
import { CareGuideSpeciesChips } from "@/components/content/CareGuideSpeciesChips";
import { getGuideCoverUrl } from "@/lib/storage";
import { SPECIES, type Species } from "@/lib/species";

export const metadata: Metadata = {
  title: "Care guides | Save Any Pets",
  description: "Practical guides for settling in and caring for a dog, cat or bearded dragon.",
};

export default async function CareGuidesPage({ searchParams }: PageProps<"/care-guides">) {
  const { species } = await searchParams;
  const supabase = await createClient();

  const speciesFilter = (["dog", "cat", "bearded_dragon"] as const).find((value) => value === species);

  let query = supabase
    .from("care_guides")
    .select("slug, species, title, summary, cover_path")
    .eq("published", true)
    .order("updated_at", { ascending: false });

  if (speciesFilter) query = query.eq("species", speciesFilter);

  const { data: guides, error } = await query;
  if (error) throw error;

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-14">
      <h1 className="text-[34px] sm:text-[52px]">Care guides</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-2">
        Practical, general guides to help you settle a new pet in and keep them healthy.
      </p>

      <div className="mt-8">
        <CareGuideSpeciesChips active={speciesFilter as Species | undefined} />
      </div>

      {guides && guides.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => {
            const info = guide.species ? SPECIES[guide.species] : null;
            return (
              <GlassCard key={guide.slug} noPadding className="flex flex-col gap-4 p-6">
                <div className={`relative flex h-32 items-center justify-center overflow-hidden rounded-[20px] ${info?.photo ?? "bg-ink/5"}`}>
                  {guide.cover_path ? (
                    <Image
                      src={getGuideCoverUrl(guide.cover_path)}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                    />
                  ) : guide.species ? (
                    <SpeciesTag species={guide.species} onPhoto />
                  ) : null}
                </div>
                <h2 className="text-xl">{guide.title}</h2>
                {guide.summary ? <p className="flex-1 text-sm text-ink-2">{guide.summary}</p> : null}
                <Link href={`/care-guides/${guide.slug}`} className="text-sm font-bold text-brand hover:underline">
                  Read the guide
                </Link>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <GlassCard className="mt-8 text-center">
          <p className="text-ink-2">No guides published yet, check back soon.</p>
        </GlassCard>
      )}
    </main>
  );
}
