"use server";

import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { buildApplicationSchema } from "@/lib/validation/application";
import { SPECIES_APPLICATION_QUESTIONS } from "@/lib/species";
import { formatSlotLabel } from "@/lib/meet-slots";
import { applicantConfirmationEmail, staffAlertEmail } from "@/lib/emails/application";

const FROM_EMAIL = "Save Any Pets <onboarding@resend.dev>";

interface SubmitApplicationErrors {
  form?: string[];
  [field: string]: string[] | undefined;
}

interface SubmitApplicationInput {
  petSlug: string;
  /** Honeypot field. Real visitors never fill this in. */
  hp_field?: string;
  turnstileToken: string;
  values: Record<string, unknown>;
}

export async function submitApplication(input: SubmitApplicationInput) {
  if (input.hp_field) {
    // Bots fill every field. Pretend success and do nothing.
    return { ok: true as const };
  }

  const supabase = await createClient();

  const { data: pet } = await supabase
    .from("pets")
    .select("id, name, species, adoption_fee")
    .eq("slug", input.petSlug)
    .in("status", ["available", "pending", "on_hold"])
    .maybeSingle();

  if (!pet) {
    return {
      ok: false as const,
      errors: { form: ["This pet is no longer available to apply for."] } satisfies SubmitApplicationErrors,
    };
  }

  const parsed = buildApplicationSchema(pet.species).safeParse(input.values);
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors as SubmitApplicationErrors };
  }
  const data = parsed.data;

  const turnstileOk = await verifyTurnstile(input.turnstileToken);
  if (!turnstileOk) {
    return {
      ok: false as const,
      errors: { form: ["We could not verify you are human. Please try again."] } satisfies SubmitApplicationErrors,
    };
  }

  const { data: slotHasCapacity } = await supabase.rpc("meet_slot_has_capacity", {
    p_slot_id: data.slot_id,
  });
  if (!slotHasCapacity) {
    return {
      ok: false as const,
      errors: { slot_id: ["That time is no longer available. Choose another."] } satisfies SubmitApplicationErrors,
    };
  }

  const { data: slot } = await supabase
    .from("meet_slots")
    .select("starts_at")
    .eq("id", data.slot_id)
    .maybeSingle();

  const questions = SPECIES_APPLICATION_QUESTIONS[pet.species];

  const { error: insertError } = await supabase.from("applications").insert({
    pet_id: pet.id,
    slot_id: data.slot_id,
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    city: data.city,
    home_type: data.home_type,
    owns_home: data.owns_home,
    landlord_allows_pets: data.owns_home ? null : data.landlord_allows_pets,
    has_secure_outdoor_space: questions.showSecureOutdoorSpace ? data.has_secure_outdoor_space : null,
    household_size: data.household_size,
    hours_alone: data.hours_alone,
    current_pets: data.current_pets?.trim() ? data.current_pets.trim() : null,
    reptile_experience: questions.showReptileExperience
      ? (data.reptile_experience?.trim() ?? null) || null
      : null,
    has_uvb_setup: questions.showUvbSetup ? data.has_uvb_setup : null,
    reason: data.reason,
    agreed_to_terms: data.agreed_to_terms,
  });

  if (insertError) {
    return {
      ok: false as const,
      errors: { form: ["Something went wrong. Please try again."] } satisfies SubmitApplicationErrors,
    };
  }

  await sendApplicationEmails({ pet, data, slotStartsAt: slot?.starts_at ?? null });

  return { ok: true as const };
}

async function sendApplicationEmails({
  pet,
  data,
  slotStartsAt,
}: {
  pet: { name: string; species: "dog" | "cat" | "bearded_dragon"; adoption_fee: number | null };
  data: { full_name: string; email: string; phone: string };
  slotStartsAt: string | null;
}) {
  if (!process.env.RESEND_API_KEY) return;

  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("shelter_name, email, phone")
    .eq("id", 1)
    .maybeSingle();

  const shelterName = settings?.shelter_name ?? "Save Any Pets";
  const staffEmail = settings?.email ?? process.env.ADMIN_NOTIFY_EMAIL ?? null;
  const slotLabel = slotStartsAt ? formatSlotLabel(slotStartsAt) : "the time you chose";

  const emailBase = {
    applicantName: data.full_name,
    petName: pet.name,
    species: pet.species,
    adoptionFee: pet.adoption_fee,
    slotLabel,
    shelterName,
    shelterEmail: settings?.email ?? null,
    shelterPhone: settings?.phone ?? null,
  };

  // resend.emails.send() resolves with { error } on an API failure rather than throwing, so each
  // send is checked and logged individually. The application is already saved either way, a
  // failed notification email should never fail the submission.
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const confirmation = applicantConfirmationEmail(emailBase);
    const { error: confirmationError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: confirmation.subject,
      text: confirmation.text,
    });
    if (confirmationError) console.error("Failed to send applicant confirmation email", confirmationError);

    if (staffEmail) {
      const alert = staffAlertEmail({ ...emailBase, applicantEmail: data.email, applicantPhone: data.phone });
      const { error: alertError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: staffEmail,
        subject: alert.subject,
        text: alert.text,
      });
      if (alertError) console.error("Failed to send staff alert email", alertError);
    }
  } catch (error) {
    console.error("Failed to send application emails", error);
  }
}
