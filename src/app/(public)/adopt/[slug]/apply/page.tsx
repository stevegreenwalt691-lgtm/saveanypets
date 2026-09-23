import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PetSummaryCard } from "@/components/pets/PetSummaryCard";
import { ApplicationWizard } from "@/components/forms/application/ApplicationWizard";
import { PUBLIC_PET_STATUSES } from "@/lib/pets";
import { groupSlotsByDay, type OpenMeetSlot } from "@/lib/meet-slots";

export async function generateMetadata({
  params,
}: PageProps<"/adopt/[slug]/apply">): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: pet } = await supabase
    .from("pets")
    .select("name")
    .eq("slug", slug)
    .in("status", PUBLIC_PET_STATUSES)
    .maybeSingle();

  return { title: pet ? `Apply to adopt ${pet.name} | Save Any Pets` : "Apply to adopt | Save Any Pets" };
}

export default async function ApplyPage({ params }: PageProps<"/adopt/[slug]/apply">) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: pet, error } = await supabase
    .from("pets")
    .select("id, slug, name, species, status, adoption_fee")
    .eq("slug", slug)
    .in("status", PUBLIC_PET_STATUSES)
    .maybeSingle();

  if (error) throw error;

  if (!pet) {
    const { data: status } = await supabase.rpc("pet_status_for_slug", { p_slug: slug });

    if (status === "adopted") {
      return (
        <main className="mx-auto w-full max-w-[640px] px-4 py-16 sm:px-14">
          <GlassCard strong className="text-center">
            <h1 className="text-3xl">This pet has found a home</h1>
            <p className="mt-3 text-ink-2">
              Thank you for your interest. This pet has already been adopted, so we are not taking
              new applications for them. There are other pets waiting to meet you.
            </p>
            <Button href="/adopt" className="mt-6">
              See pets waiting to be adopted
            </Button>
          </GlassCard>
        </main>
      );
    }

    notFound();
  }

  const { data: openSlots } = await supabase.rpc("open_meet_slots");
  const meetSlotGroups = groupSlotsByDay((openSlots ?? []) as OpenMeetSlot[]);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-14">
      <Link
        href={`/adopt/${pet.slug}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-ink-2 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
        Back to {pet.name}
      </Link>

      <h1 className="mt-4 text-[34px] sm:text-[40px]">Apply to adopt {pet.name}</h1>

      {pet.status === "pending" ? (
        <div className="mt-4 rounded-[20px] bg-warning/10 px-5 py-4 text-sm font-bold text-warning">
          {pet.name} has a pending application. You are welcome to apply as a backup, we will
          contact you if the first application does not go through.
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <PetSummaryCard
          name={pet.name}
          species={pet.species}
          adoptionFee={pet.adoption_fee}
          className="lg:col-start-2 lg:row-start-1 lg:h-fit lg:sticky lg:top-8"
        />
        <ApplicationWizard
          petSlug={pet.slug}
          petName={pet.name}
          species={pet.species}
          adoptionFee={pet.adoption_fee}
          meetSlotGroups={meetSlotGroups}
          turnstileSiteKey={turnstileSiteKey}
        />
      </div>
    </main>
  );
}
