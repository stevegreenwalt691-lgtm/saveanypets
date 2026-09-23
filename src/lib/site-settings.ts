import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { Species } from "@/lib/species";

export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];

export type SpeciesFees = Partial<Record<Species, number>>;

/** site_settings has exactly one row (id = 1), readable by anyone. */
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  if (error) throw error;
  return data;
}

export function getSpeciesFees(settings: SiteSettings): SpeciesFees {
  const fees = settings.fees;
  if (!fees || typeof fees !== "object" || Array.isArray(fees)) return {};
  return fees as SpeciesFees;
}

export function formatOpeningHours(settings: SiteSettings): { day: string; hours: string }[] | null {
  const hours = settings.opening_hours;
  if (!hours || typeof hours !== "object" || Array.isArray(hours)) return null;
  return Object.entries(hours as Record<string, string>).map(([day, value]) => ({ day, hours: value }));
}
