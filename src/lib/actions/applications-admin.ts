"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { requireStaff } from "@/lib/actions/admin-guard";
import { getSiteSettings } from "@/lib/site-settings";
import {
  applicationApprovedEmail,
  applicationDeclinedEmail,
  applicationCompletedEmail,
} from "@/lib/emails/applications-admin";
import type { Database } from "@/lib/supabase/database.types";

type ApplicationStatus = Database["public"]["Enums"]["application_status"];

const FROM_EMAIL = "Save Any Pets <onboarding@resend.dev>";

interface ActionResult {
  ok: boolean;
  error?: string;
}

function revalidateApplicationPaths(id: string, petSlug?: string | null) {
  revalidatePath("/admin");
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id}`);
  revalidatePath("/adopt");
  if (petSlug) revalidatePath(`/adopt/${petSlug}`);
}

export async function updateApplicationNotes(id: string, notes: string): Promise<ActionResult> {
  const supabase = await requireStaff();

  const { error } = await supabase
    .from("applications")
    .update({ staff_notes: notes.trim() ? notes.trim() : null })
    .eq("id", id);

  if (error) return { ok: false, error: "Could not save notes." };

  revalidatePath(`/admin/applications/${id}`);
  return { ok: true };
}

async function transitionApplication(id: string, status: ApplicationStatus): Promise<ActionResult> {
  const supabase = await requireStaff();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: application } = await supabase
    .from("applications")
    .select("id, full_name, email, pets(name, slug)")
    .eq("id", id)
    .maybeSingle();

  if (!application) return { ok: false, error: "Application not found." };

  // The applications_sync_pet trigger updates the pet's status on its own, this action
  // only ever touches the applications row.
  const { error } = await supabase
    .from("applications")
    .update({ status, reviewed_by: user?.id ?? null, reviewed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, error: "Could not update the application." };

  revalidateApplicationPaths(id, application.pets?.slug);

  if (status === "approved" || status === "declined" || status === "completed") {
    await sendDecisionEmail(status, {
      applicantName: application.full_name,
      applicantEmail: application.email,
      petName: application.pets?.name ?? "your pet",
    });
  }

  return { ok: true };
}

async function sendDecisionEmail(
  status: "approved" | "declined" | "completed",
  input: { applicantName: string; applicantEmail: string; petName: string },
) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const settings = await getSiteSettings();
    const builder =
      status === "approved"
        ? applicationApprovedEmail
        : status === "declined"
          ? applicationDeclinedEmail
          : applicationCompletedEmail;

    const email = builder({
      applicantName: input.applicantName,
      petName: input.petName,
      shelterName: settings.shelter_name,
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: input.applicantEmail,
      subject: email.subject,
      text: email.text,
    });
    if (error) console.error(`Failed to send ${status} email`, error);
  } catch (error) {
    console.error(`Failed to send ${status} email`, error);
  }
}

export async function markInReview(id: string): Promise<ActionResult> {
  return transitionApplication(id, "in_review");
}

export async function approveApplication(id: string): Promise<ActionResult> {
  return transitionApplication(id, "approved");
}

export async function declineApplication(id: string): Promise<ActionResult> {
  return transitionApplication(id, "declined");
}

export async function completeApplication(id: string): Promise<ActionResult> {
  return transitionApplication(id, "completed");
}
