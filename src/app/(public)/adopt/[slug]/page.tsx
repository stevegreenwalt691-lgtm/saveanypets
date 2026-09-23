import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, PlayCircle, X } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SpeciesTag } from "@/components/ui/SpeciesTag";
import { PetGallery } from "@/components/pets/PetGallery";
import { SPECIES } from "@/lib/species";
import { getAgeLabel } from "@/lib/pet-age";
import { formatFee, formatSex, formatSize, PUBLIC_PET_STATUSES } from "@/lib/pets";

export async function generateMetadata({
  params,
}: PageProps<"/adopt/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: pet } = await supabase
    .from("pets")
    .select("name, species, story")
    .eq("slug", slug)
    .in("status", PUBLIC_PET_STATUSES)
    .maybeSingle();

  if (!pet) return { title: "Pet not found | Save Any Pets" };

  return {
    title: `${pet.name} | Save Any Pets`,
    description: pet.story ?? `Meet ${pet.name}, a ${SPECIES[pet.species].label.toLowerCase()} looking for a home.`,
  };
}

export default async function PetProfilePage({ params }: PageProps<"/adopt/[slug]">) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: pet, error } = await supabase
    .from("pets")
    .select("*, pet_photos(id, path, alt, is_primary, sort_order)")
    .eq("slug", slug)
    .in("status", PUBLIC_PET_STATUSES)
    .maybeSingle();

  if (error) throw error;
  if (!pet) notFound();

  const species = SPECIES[pet.species];
  const size = formatSize(pet.size);

  const facts: { label: string; value: string }[] = [
    { label: "Species", value: species.label },
    ...(pet.breed ? [{ label: "Breed", value: pet.breed }] : []),
    { label: "Age", value: getAgeLabel(pet.birth_date) },
    { label: "Sex", value: formatSex(pet.sex) },
    ...(size ? [{ label: "Size", value: size }] : []),
    ...(pet.weight_kg ? [{ label: "Weight", value: `${pet.weight_kg} kg` }] : []),
    ...(pet.length_cm ? [{ label: "Length", value: `${pet.length_cm} cm` }] : []),
  ];

  const healthChecks = [
    { label: "Vaccinated", done: pet.vaccinated },
    { label: "Spayed or neutered", done: pet.spayed_neutered },
    { label: "Vet checked", done: pet.vet_checked },
  ];

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-14">
      <Link
        href="/adopt"
        className="inline-flex items-center gap-2 text-sm font-bold text-ink-2 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
        Back to Adopt
      </Link>

      {pet.status === "pending" ? (
        <div className="mt-6 rounded-[20px] bg-warning/10 px-5 py-4 text-sm font-bold text-warning">
          {pet.name} has a pending application. You are welcome to apply as a backup, we will
          contact you if the first application does not go through.
        </div>
      ) : null}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        {pet.pet_photos.length > 0 ? (
          <PetGallery petName={pet.name} photos={pet.pet_photos} videoUrl={pet.video_url} />
        ) : (
          <div className={`relative flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-[28px] sm:min-h-[500px] ${species.photo}`}>
            <span className="font-display text-4xl font-bold text-ink/70">{pet.name}</span>
            <span className="text-sm font-bold text-ink/60">Photos coming soon</span>
            {pet.video_url ? (
              <a
                href={pet.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-ink"
              >
                <PlayCircle className="h-4 w-4" strokeWidth={1.8} />
                Watch video
              </a>
            ) : null}
          </div>
        )}

        <GlassCard strong className="flex flex-col gap-5">
          <div>
            <SpeciesTag species={pet.species} />
            <h1 className="mt-3 text-[34px] sm:text-[40px]">{pet.name}</h1>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs font-bold uppercase tracking-[0.5px] text-ink-3">
                  {fact.label}
                </dt>
                <dd className="text-sm text-ink-2">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {pet.story ? <p className="text-base leading-relaxed text-ink-2">{pet.story}</p> : null}

          {pet.personality.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {pet.personality.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full bg-white/65 px-3 py-1 text-[13px] font-bold capitalize text-ink-2"
                >
                  {trait}
                </span>
              ))}
            </div>
          ) : null}

          <div className="rounded-[20px] bg-white/65 p-5">
            <p className="text-sm font-bold text-ink-3">Adoption fee</p>
            <p className="mt-1 font-display text-3xl font-bold text-ink">
              {formatFee(pet.adoption_fee)}
            </p>
            <p className="mt-2 text-sm text-ink-2">
              Paid in person, after your meet and greet. No payment before you have met{" "}
              {pet.name}, and no shipping, adoption is local pickup only.
            </p>
            <Button href={`/adopt/${pet.slug}/apply`} className="mt-4 w-full">
              Apply to adopt {pet.name}
            </Button>
          </div>
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <GlassCard>
          <h2 className="text-xl">Health</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {healthChecks.map((check) => (
              <li key={check.label} className="flex items-center gap-3 text-sm text-ink-2">
                {check.done ? (
                  <Check className="h-5 w-5 shrink-0 text-success" strokeWidth={2} />
                ) : (
                  <X className="h-5 w-5 shrink-0 text-ink-3" strokeWidth={2} />
                )}
                {check.label}
              </li>
            ))}
          </ul>
          {pet.health_notes ? (
            <p className="mt-4 text-sm text-ink-2">{pet.health_notes}</p>
          ) : null}
        </GlassCard>

        <GlassCard>
          <h2 className="text-xl">What {pet.name} needs at home</h2>
          {pet.care_needs.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-2">
              {pet.care_needs.map((need) => (
                <li key={need} className="flex items-start gap-2 text-sm text-ink-2">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {need}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-ink-2">No specific needs listed yet.</p>
          )}
        </GlassCard>
      </div>
    </main>
  );
}
