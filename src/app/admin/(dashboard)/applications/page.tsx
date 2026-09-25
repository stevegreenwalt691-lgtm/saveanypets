import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import type { StatusPillStatus } from "@/components/ui/StatusPill";
import { formatSlotLabel } from "@/lib/meet-slots";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Applications | Save Any Pets admin" };

const TABS: { value: StatusPillStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_review", label: "In review" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
  { value: "completed", label: "Completed" },
];

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export default async function AdminApplicationsPage({ searchParams }: PageProps<"/admin/applications">) {
  const { status } = await searchParams;
  const activeStatus = TABS.find((tab) => tab.value === status)?.value ?? "new";

  const supabase = await createClient();
  const { data: applications, error } = await supabase
    .from("applications")
    .select("id, full_name, status, created_at, pets(name), meet_slots(starts_at)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const counts = new Map<string, number>();
  for (const application of applications ?? []) {
    counts.set(application.status, (counts.get(application.status) ?? 0) + 1);
  }

  const visibleApplications = (applications ?? []).filter((application) => application.status === activeStatus);

  return (
    <div className="flex flex-col gap-6 py-8">
      <h1 className="text-[34px] sm:text-[40px]">Applications</h1>

      <div className="glass flex w-full gap-2 overflow-x-auto rounded-full p-2 sm:w-fit">
        {TABS.map((tab) => {
          const active = tab.value === activeStatus;
          return (
            <Link
              key={tab.value}
              href={`/admin/applications?status=${tab.value}`}
              aria-current={active ? "true" : undefined}
              className={cn(
                "shrink-0 rounded-full px-5 py-3 text-sm font-bold transition-colors",
                active ? "bg-ink text-white" : "text-ink hover:bg-white/60",
              )}
            >
              {tab.label} ({counts.get(tab.value) ?? 0})
            </Link>
          );
        })}
      </div>

      <GlassCard noPadding className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-[0.5px] text-ink-3">
              <th className="px-4 py-3">Pet</th>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Meet and greet</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {visibleApplications.map((application) => (
              <tr key={application.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3 font-bold text-ink">{application.pets?.name ?? "Pet removed"}</td>
                <td className="px-4 py-3 text-ink-2">{application.full_name}</td>
                <td className="px-4 py-3 text-ink-2">
                  {application.meet_slots ? formatSlotLabel(application.meet_slots.starts_at) : "Not chosen"}
                </td>
                <td className="px-4 py-3 text-ink-2">{DATE_FORMAT.format(new Date(application.created_at))}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/applications/${application.id}`}
                    className="text-sm font-bold text-brand hover:text-brand-hover"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibleApplications.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-2">No applications in this status.</p>
        ) : null}
      </GlassCard>
    </div>
  );
}
