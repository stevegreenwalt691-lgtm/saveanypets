import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { SlotOpenToggle } from "@/components/admin/meet-greets/SlotOpenToggle";
import { CreateSlotsForm } from "@/components/admin/meet-greets/CreateSlotsForm";

export const metadata: Metadata = { title: "Meet and greets | Save Any Pets admin" };

const DAY_FORMAT = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });
const TIME_FORMAT = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

export default async function AdminMeetGreetsPage() {
  const supabase = await createClient();
  const { data: slots, error } = await supabase
    .from("meet_slots")
    .select("id, starts_at, capacity, is_open, applications(id, full_name, pets(name))")
    .gt("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  if (error) throw error;

  const groups = new Map<string, { dayLabel: string; slots: NonNullable<typeof slots> }>();
  for (const slot of slots ?? []) {
    const date = new Date(slot.starts_at);
    const dayKey = date.toISOString().slice(0, 10);
    let group = groups.get(dayKey);
    if (!group) {
      group = { dayLabel: DAY_FORMAT.format(date), slots: [] };
      groups.set(dayKey, group);
    }
    group.slots.push(slot);
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <h1 className="text-[34px] sm:text-[40px]">Meet and greets</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          {groups.size === 0 ? (
            <GlassCard>
              <p className="text-ink-2">No upcoming slots. Create some using the form.</p>
            </GlassCard>
          ) : (
            Array.from(groups.entries()).map(([dayKey, group]) => (
              <GlassCard key={dayKey}>
                <h2 className="text-xl">{group.dayLabel}</h2>
                <div className="mt-4 flex flex-col gap-3">
                  {group.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-white/65 p-4"
                    >
                      <div>
                        <p className="font-bold text-ink">
                          {TIME_FORMAT.format(new Date(slot.starts_at))}
                          <span className="ml-2 text-sm font-normal text-ink-3">
                            {slot.applications.length}/{slot.capacity} booked
                            {!slot.is_open ? " · closed" : ""}
                          </span>
                        </p>
                        {slot.applications.length > 0 ? (
                          <ul className="mt-1 flex flex-col gap-0.5 text-sm text-ink-2">
                            {slot.applications.map((application) => (
                              <li key={application.id}>
                                {application.full_name}
                                {application.pets ? ` · ${application.pets.name}` : ""}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-1 text-sm text-ink-2">Nothing booked yet.</p>
                        )}
                      </div>
                      <SlotOpenToggle slotId={slot.id} isOpen={slot.is_open} />
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))
          )}
        </div>

        <GlassCard className="h-fit lg:sticky lg:top-8">
          <h2 className="text-xl">Create slots</h2>
          <p className="mt-1 text-sm text-ink-2">Creates one slot per day in the range, for each time.</p>
          <div className="mt-4">
            <CreateSlotsForm />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
