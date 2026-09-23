"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/actions/admin-guard";
import { siteSettingsSchema, OPENING_HOURS_DAYS } from "@/lib/validation/site-settings";

interface SettingsErrors {
  form?: string[];
  [field: string]: string[] | undefined;
}

function toNumberOrNull(value: string | undefined): number | null {
  if (!value || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function updateSiteSettings(input: unknown) {
  const supabase = await requireAdmin();

  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors as SettingsErrors };
  }
  const data = parsed.data;

  const openingHoursEntries = OPENING_HOURS_DAYS.map((day) => [day, data.opening_hours[day]?.trim()]).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );

  const { error } = await supabase
    .from("site_settings")
    .update({
      shelter_name: data.shelter_name,
      address: data.address?.trim() || null,
      phone: data.phone?.trim() || null,
      whatsapp: data.whatsapp?.trim() || null,
      email: data.email?.trim() || null,
      registration_number: data.registration_number?.trim() || null,
      donation_details: data.donation_details?.trim() || null,
      fees: {
        dog: toNumberOrNull(data.fees.dog),
        cat: toNumberOrNull(data.fees.cat),
        bearded_dragon: toNumberOrNull(data.fees.bearded_dragon),
      },
      opening_hours: openingHoursEntries.length > 0 ? Object.fromEntries(openingHoursEntries) : null,
    })
    .eq("id", 1);

  if (error) {
    return {
      ok: false as const,
      errors: { form: ["Something went wrong. Please try again."] } satisfies SettingsErrors,
    };
  }

  // Settings show up on the footer of every public page, plus how-it-works, about, contact and get-involved.
  revalidatePath("/", "layout");

  return { ok: true as const };
}
