import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSiteSettings, getSpeciesFees } from "@/lib/site-settings";
import { createClient } from "@/lib/supabase/server";
import { OPENING_HOURS_DAYS, type SiteSettingsInput } from "@/lib/validation/site-settings";

export const metadata: Metadata = { title: "Settings | Save Any Pets admin" };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
    : { data: null };

  if (profile?.role !== "admin") {
    return (
      <div className="py-8">
        <h1 className="text-[34px] sm:text-[40px]">Settings</h1>
        <GlassCard className="mt-6">
          <p className="text-ink-2">Only an admin can view and change shelter settings.</p>
        </GlassCard>
      </div>
    );
  }

  const settings = await getSiteSettings();
  const fees = getSpeciesFees(settings);
  const hours = (settings.opening_hours && typeof settings.opening_hours === "object" && !Array.isArray(settings.opening_hours)
    ? (settings.opening_hours as Record<string, string>)
    : {}) as Record<string, string>;

  const defaultValues: SiteSettingsInput = {
    shelter_name: settings.shelter_name,
    address: settings.address ?? "",
    phone: settings.phone ?? "",
    whatsapp: settings.whatsapp ?? "",
    email: settings.email ?? "",
    registration_number: settings.registration_number ?? "",
    donation_details: settings.donation_details ?? "",
    fees: {
      dog: fees.dog !== undefined ? String(fees.dog) : "",
      cat: fees.cat !== undefined ? String(fees.cat) : "",
      bearded_dragon: fees.bearded_dragon !== undefined ? String(fees.bearded_dragon) : "",
    },
    opening_hours: Object.fromEntries(OPENING_HOURS_DAYS.map((day) => [day, hours[day] ?? ""])) as SiteSettingsInput["opening_hours"],
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <h1 className="text-[34px] sm:text-[40px]">Settings</h1>
      <SettingsForm defaultValues={defaultValues} />
    </div>
  );
}
