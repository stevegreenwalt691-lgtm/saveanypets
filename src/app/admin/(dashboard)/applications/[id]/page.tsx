import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill, type StatusPillStatus } from "@/components/ui/StatusPill";
import { StaffNotesField } from "@/components/admin/applications/StaffNotesField";
import { ApplicationActions } from "@/components/admin/applications/ApplicationActions";
import { formatSlotLabel } from "@/lib/meet-slots";
import { formatFee } from "@/lib/pets";
import { SPECIES, SPECIES_APPLICATION_QUESTIONS } from "@/lib/species";

export const metadata: Metadata = { title: "Application | Save Any Pets admin" };

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-[0.5px] text-ink-3">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink-2">{value}</dd>
    </div>
  );
}

export default async function AdminApplicationDetailPage({ params }: PageProps<"/admin/applications/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: application, error } = await supabase
    .from("applications")
    .select("*, pets(name, slug, species, adoption_fee), meet_slots(starts_at)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!application) notFound();

  const pet = application.pets;
  const questions = pet ? SPECIES_APPLICATION_QUESTIONS[pet.species] : null;

  return (
    <div className="flex flex-col gap-6 py-8">
      <Link href="/admin/applications" className="inline-flex items-center gap-2 text-sm font-bold text-ink-2 hover:text-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
        Back to applications
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[34px] sm:text-[40px]">{application.full_name}</h1>
          <p className="mt-1 text-ink-2">
            Applying for {pet ? <span className="font-bold text-ink">{pet.name}</span> : "a pet that was removed"}
          </p>
        </div>
        <StatusPill status={application.status as StatusPillStatus} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <GlassCard>
            <h2 className="text-xl">About you</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={application.full_name} />
              <Field label="Email" value={application.email} />
              <Field label="Phone" value={application.phone} />
              <Field label="City" value={application.city} />
            </dl>
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl">Home</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Home type" value={application.home_type} />
              <Field label="Owns home" value={application.owns_home ? "Yes" : "No"} />
              {!application.owns_home ? (
                <Field label="Landlord allows pets" value={application.landlord_allows_pets ? "Yes" : "No"} />
              ) : null}
              {questions?.showSecureOutdoorSpace ? (
                <Field label="Secure outdoor space" value={application.has_secure_outdoor_space ? "Yes" : "No"} />
              ) : null}
              <Field label="Household size" value={String(application.household_size ?? "Not given")} />
              <Field label="Hours alone per day" value={String(application.hours_alone ?? "Not given")} />
            </dl>
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl">Experience</h2>
            <dl className="mt-4 flex flex-col gap-4">
              <Field label="Current pets" value={application.current_pets?.trim() || "None given"} />
              {questions?.showReptileExperience ? (
                <Field label="Reptile experience" value={application.reptile_experience?.trim() || "Not given"} />
              ) : null}
              {questions?.showUvbSetup ? (
                <Field label="Has UVB setup" value={application.has_uvb_setup ? "Yes" : "No"} />
              ) : null}
              <Field label="Reason for adopting" value={application.reason} />
            </dl>
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl">Meet and greet</h2>
            <dl className="mt-4">
              <Field
                label="Requested time"
                value={application.meet_slots ? formatSlotLabel(application.meet_slots.starts_at) : "Not chosen"}
              />
            </dl>
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl">Review</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Agreed to terms" value={application.agreed_to_terms ? "Yes" : "No"} />
              <Field label="Adoption fee" value={pet ? formatFee(pet.adoption_fee) : "Not available"} />
            </dl>
          </GlassCard>
        </div>

        <div className="flex flex-col gap-6">
          <GlassCard>
            <h2 className="text-lg">Actions</h2>
            <div className="mt-4">
              <ApplicationActions applicationId={application.id} status={application.status} />
            </div>
          </GlassCard>

          {pet ? (
            <GlassCard>
              <h2 className="text-lg">Pet</h2>
              <p className="mt-2 text-sm text-ink-2">
                {pet.name}, {SPECIES[pet.species].label}
              </p>
              <Link href={`/adopt/${pet.slug}`} target="_blank" className="mt-2 inline-block text-sm font-bold text-brand hover:underline">
                View public profile
              </Link>
            </GlassCard>
          ) : null}

          <GlassCard>
            <StaffNotesField applicationId={application.id} defaultValue={application.staff_notes ?? ""} />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
