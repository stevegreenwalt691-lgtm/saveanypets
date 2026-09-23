import type { Metadata } from "next";
import Link from "next/link";
import { PawPrint, Clock3, ClipboardList, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/admin/StatCard";
import { StatusPill, type StatusPillStatus } from "@/components/ui/StatusPill";

export const metadata: Metadata = { title: "Dashboard | Save Any Pets admin" };

const TIME_FORMAT = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    { count: availableCount },
    { count: pendingCount },
    { count: openApplicationsCount },
    { count: adoptedThisMonthCount },
    { data: newestApplications },
    { data: meetGreets },
  ] = await Promise.all([
    supabase.from("pets").select("id", { count: "exact", head: true }).eq("status", "available"),
    supabase.from("pets").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .in("status", ["new", "in_review"]),
    supabase
      .from("pets")
      .select("id", { count: "exact", head: true })
      .eq("status", "adopted")
      .gte("adopted_at", startOfMonth.toISOString()),
    supabase
      .from("applications")
      .select("id, full_name, status, created_at, pets(name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("applications")
      .select("id, full_name, pets(name), meet_slots!inner(starts_at)")
      .gte("meet_slots.starts_at", today.toISOString())
      .lt("meet_slots.starts_at", dayAfterTomorrow.toISOString())
      .order("starts_at", { referencedTable: "meet_slots", ascending: true }),
  ]);

  const todaysMeetGreets = (meetGreets ?? []).filter(
    (row) => new Date(row.meet_slots.starts_at) < tomorrow,
  );
  const tomorrowsMeetGreets = (meetGreets ?? []).filter(
    (row) => new Date(row.meet_slots.starts_at) >= tomorrow,
  );

  return (
    <div className="flex flex-col gap-8 py-8">
      <h1 className="text-[34px] sm:text-[40px]">Dashboard</h1>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Available pets" value={availableCount ?? 0} icon={PawPrint} />
        <StatCard label="Pending pets" value={pendingCount ?? 0} icon={Clock3} />
        <StatCard label="Open applications" value={openApplicationsCount ?? 0} icon={ClipboardList} />
        <StatCard label="Adopted this month" value={adoptedThisMonthCount ?? 0} icon={CheckCircle2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="flex items-center justify-between">
            <h2 className="text-xl">Newest applications</h2>
            <Link href="/admin/applications" className="text-sm font-bold text-brand hover:text-brand-hover">
              View all
            </Link>
          </div>
          {newestApplications && newestApplications.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-3">
              {newestApplications.map((application) => (
                <li key={application.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-ink">{application.full_name}</p>
                    <p className="truncate text-ink-3">{application.pets?.name ?? "Pet removed"}</p>
                  </div>
                  <StatusPill status={application.status as StatusPillStatus} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-ink-2">No applications yet.</p>
          )}
        </GlassCard>

        <GlassCard>
          <h2 className="text-xl">Meet and greets</h2>
          <div className="mt-4 flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.5px] text-ink-3">Today</p>
              {todaysMeetGreets.length > 0 ? (
                <ul className="mt-2 flex flex-col gap-2">
                  {todaysMeetGreets.map((row) => (
                    <li key={row.id} className="flex items-center justify-between text-sm">
                      <span className="text-ink-2">
                        {row.full_name} · {row.pets?.name ?? "Pet removed"}
                      </span>
                      <span className="font-bold text-ink">{TIME_FORMAT.format(new Date(row.meet_slots.starts_at))}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-ink-2">Nothing booked today.</p>
              )}
            </div>
            <div className="border-t border-ink/10 pt-4">
              <p className="text-xs font-bold uppercase tracking-[0.5px] text-ink-3">Tomorrow</p>
              {tomorrowsMeetGreets.length > 0 ? (
                <ul className="mt-2 flex flex-col gap-2">
                  {tomorrowsMeetGreets.map((row) => (
                    <li key={row.id} className="flex items-center justify-between text-sm">
                      <span className="text-ink-2">
                        {row.full_name} · {row.pets?.name ?? "Pet removed"}
                      </span>
                      <span className="font-bold text-ink">{TIME_FORMAT.format(new Date(row.meet_slots.starts_at))}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-ink-2">Nothing booked tomorrow.</p>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
