import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { HandledToggle } from "@/components/admin/people/HandledToggle";
import { SPECIES } from "@/lib/species";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "People | Save Any Pets admin" };

const TABS = [
  { value: "foster", label: "Fosters" },
  { value: "volunteer", label: "Volunteers" },
  { value: "surrender", label: "Surrenders" },
] as const;

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export default async function AdminPeoplePage({ searchParams }: PageProps<"/admin/people">) {
  const { tab } = await searchParams;
  const activeTab = TABS.find((entry) => entry.value === tab)?.value ?? "foster";

  const supabase = await createClient();
  const [{ data: signups, error: signupsError }, { data: surrenders, error: surrendersError }] = await Promise.all([
    supabase
      .from("people_signups")
      .select("id, type, full_name, email, phone, species_interest, message, handled, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("surrenders")
      .select("id, owner_name, email, phone, species, pet_name, pet_age, reason, handled, created_at")
      .order("created_at", { ascending: false }),
  ]);

  if (signupsError) throw signupsError;
  if (surrendersError) throw surrendersError;

  const counts = {
    foster: (signups ?? []).filter((s) => s.type === "foster").length,
    volunteer: (signups ?? []).filter((s) => s.type === "volunteer").length,
    surrender: (surrenders ?? []).length,
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[34px] sm:text-[40px]">People</h1>
        <a
          href={`/api/admin/people-export?tab=${activeTab}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-[14px] border-2 border-ink px-[22px] py-3 text-[15px] font-bold text-ink transition-colors hover:bg-ink/5"
        >
          <Download className="h-4 w-4" strokeWidth={2} />
          Export CSV
        </a>
      </div>

      <div className="glass flex w-full gap-2 overflow-x-auto rounded-full p-2 sm:w-fit">
        {TABS.map((t) => {
          const active = t.value === activeTab;
          return (
            <Link
              key={t.value}
              href={`/admin/people?tab=${t.value}`}
              aria-current={active ? "true" : undefined}
              className={cn(
                "shrink-0 rounded-full px-5 py-3 text-sm font-bold transition-colors",
                active ? "bg-ink text-white" : "text-ink hover:bg-white/60",
              )}
            >
              {t.label} ({counts[t.value]})
            </Link>
          );
        })}
      </div>

      {activeTab === "surrender" ? (
        <GlassCard noPadding className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-[0.5px] text-ink-3">
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Pet</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(surrenders ?? []).map((row) => (
                <tr key={row.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3 font-bold text-ink">{row.owner_name}</td>
                  <td className="px-4 py-3 text-ink-2">
                    {row.phone}
                    {row.email ? <div>{row.email}</div> : null}
                  </td>
                  <td className="px-4 py-3 text-ink-2">
                    {SPECIES[row.species].label}
                    {row.pet_name ? ` · ${row.pet_name}` : ""}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-ink-2" title={row.reason}>
                    {row.reason}
                  </td>
                  <td className="px-4 py-3 text-ink-2">{DATE_FORMAT.format(new Date(row.created_at))}</td>
                  <td className="px-4 py-3 text-right">
                    <HandledToggle id={row.id} handled={row.handled} kind="surrender" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(surrenders ?? []).length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-ink-2">No surrender requests yet.</p>
          ) : null}
        </GlassCard>
      ) : (
        <GlassCard noPadding className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-[0.5px] text-ink-3">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Interested in</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(signups ?? [])
                .filter((row) => row.type === activeTab)
                .map((row) => (
                  <tr key={row.id} className="border-b border-ink/5 last:border-0">
                    <td className="px-4 py-3 font-bold text-ink">{row.full_name}</td>
                    <td className="px-4 py-3 text-ink-2">
                      {row.email}
                      {row.phone ? <div>{row.phone}</div> : null}
                    </td>
                    <td className="px-4 py-3 text-ink-2">
                      {row.species_interest.length > 0
                        ? row.species_interest.map((species) => SPECIES[species].label).join(", ")
                        : "Any"}
                    </td>
                    <td className="px-4 py-3 text-ink-2">{DATE_FORMAT.format(new Date(row.created_at))}</td>
                    <td className="px-4 py-3 text-right">
                      <HandledToggle id={row.id} handled={row.handled} kind="signup" />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {(signups ?? []).filter((row) => row.type === activeTab).length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-ink-2">No signups yet.</p>
          ) : null}
        </GlassCard>
      )}
    </div>
  );
}
