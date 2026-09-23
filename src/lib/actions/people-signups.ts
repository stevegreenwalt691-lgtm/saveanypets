"use server";

import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { peopleSignupSchema } from "@/lib/validation/people-signup";
import { getSiteSettings } from "@/lib/site-settings";
import { staffSignupAlertEmail } from "@/lib/emails/people";

const FROM_EMAIL = "Save Any Pets <onboarding@resend.dev>";

interface SignupErrors {
  form?: string[];
  [field: string]: string[] | undefined;
}

interface SubmitSignupInput {
  hp_field?: string;
  turnstileToken: string;
  values: unknown;
}

export async function submitPeopleSignup(input: SubmitSignupInput) {
  if (input.hp_field) {
    return { ok: true as const };
  }

  const parsed = peopleSignupSchema.safeParse(input.values);
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors as SignupErrors };
  }
  const data = parsed.data;

  const turnstileOk = await verifyTurnstile(input.turnstileToken);
  if (!turnstileOk) {
    return {
      ok: false as const,
      errors: { form: ["We could not verify you are human. Please try again."] } satisfies SignupErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("people_signups").insert({
    type: data.type,
    full_name: data.full_name,
    email: data.email,
    phone: data.phone?.trim() ? data.phone.trim() : null,
    species_interest: data.species_interest,
    message: data.message?.trim() ? data.message.trim() : null,
  });

  if (error) {
    return {
      ok: false as const,
      errors: { form: ["Something went wrong. Please try again."] } satisfies SignupErrors,
    };
  }

  await sendSignupAlertEmail(data);

  return { ok: true as const };
}

async function sendSignupAlertEmail(data: ReturnType<typeof peopleSignupSchema.parse>) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const settings = await getSiteSettings();
    const staffEmail = settings.email ?? process.env.ADMIN_NOTIFY_EMAIL ?? null;
    if (!staffEmail) return;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const alert = staffSignupAlertEmail({
      type: data.type,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      speciesInterest: data.species_interest,
      message: data.message,
    });
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: staffEmail,
      subject: alert.subject,
      text: alert.text,
    });
    if (error) console.error("Failed to send signup alert email", error);
  } catch (error) {
    console.error("Failed to send signup alert email", error);
  }
}
