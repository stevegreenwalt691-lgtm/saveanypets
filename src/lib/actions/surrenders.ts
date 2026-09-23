"use server";

import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { surrenderSchema } from "@/lib/validation/surrender";
import { getSiteSettings } from "@/lib/site-settings";
import { staffSurrenderAlertEmail } from "@/lib/emails/people";

const FROM_EMAIL = "Save Any Pets <onboarding@resend.dev>";

interface SurrenderErrors {
  form?: string[];
  [field: string]: string[] | undefined;
}

interface SubmitSurrenderInput {
  hp_field?: string;
  turnstileToken: string;
  values: unknown;
}

export async function submitSurrender(input: SubmitSurrenderInput) {
  if (input.hp_field) {
    return { ok: true as const };
  }

  const parsed = surrenderSchema.safeParse(input.values);
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors as SurrenderErrors };
  }
  const data = parsed.data;

  const turnstileOk = await verifyTurnstile(input.turnstileToken);
  if (!turnstileOk) {
    return {
      ok: false as const,
      errors: { form: ["We could not verify you are human. Please try again."] } satisfies SurrenderErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("surrenders").insert({
    owner_name: data.owner_name,
    email: data.email?.trim() ? data.email.trim() : null,
    phone: data.phone,
    species: data.species,
    pet_name: data.pet_name?.trim() ? data.pet_name.trim() : null,
    pet_age: data.pet_age?.trim() ? data.pet_age.trim() : null,
    reason: data.reason,
  });

  if (error) {
    return {
      ok: false as const,
      errors: { form: ["Something went wrong. Please try again."] } satisfies SurrenderErrors,
    };
  }

  await sendSurrenderAlertEmail(data);

  return { ok: true as const };
}

async function sendSurrenderAlertEmail(data: ReturnType<typeof surrenderSchema.parse>) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const settings = await getSiteSettings();
    const staffEmail = settings.email ?? process.env.ADMIN_NOTIFY_EMAIL ?? null;
    if (!staffEmail) return;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const alert = staffSurrenderAlertEmail({
      ownerName: data.owner_name,
      email: data.email,
      phone: data.phone,
      species: data.species,
      petName: data.pet_name,
      petAge: data.pet_age,
      reason: data.reason,
    });
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: staffEmail,
      subject: alert.subject,
      text: alert.text,
    });
    if (error) console.error("Failed to send surrender alert email", error);
  } catch (error) {
    console.error("Failed to send surrender alert email", error);
  }
}
