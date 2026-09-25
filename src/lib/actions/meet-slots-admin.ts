"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/actions/admin-guard";
import { createMeetSlotsSchema, MAX_SLOTS_PER_SUBMISSION } from "@/lib/validation/meet-slots";

interface ActionResult {
  ok: boolean;
  error?: string;
  created?: number;
}

function revalidateMeetSlotPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/meet-greets");
}

function datesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export async function createMeetSlots(input: unknown): Promise<ActionResult> {
  const supabase = await requireStaff();

  const parsed = createMeetSlotsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }
  const data = parsed.data;
  const capacity = data.capacity && data.capacity.trim() ? Number(data.capacity) : 1;

  const dates = datesBetween(data.start_date, data.end_date);
  const rows = dates.flatMap((date) =>
    data.times.map((time) => ({
      starts_at: new Date(`${date}T${time}:00`).toISOString(),
      capacity,
      is_open: true,
    })),
  );

  if (rows.length === 0) {
    return { ok: false, error: "No slots to create." };
  }
  if (rows.length > MAX_SLOTS_PER_SUBMISSION) {
    return { ok: false, error: `That would create ${rows.length} slots. Please create ${MAX_SLOTS_PER_SUBMISSION} or fewer at a time.` };
  }

  const { error } = await supabase.from("meet_slots").insert(rows);
  if (error) return { ok: false, error: "Could not create the slots." };

  revalidateMeetSlotPaths();
  return { ok: true, created: rows.length };
}

export async function setMeetSlotOpen(id: string, isOpen: boolean): Promise<ActionResult> {
  const supabase = await requireStaff();

  const { error } = await supabase.from("meet_slots").update({ is_open: isOpen }).eq("id", id);
  if (error) return { ok: false, error: "Could not update the slot." };

  revalidateMeetSlotPaths();
  return { ok: true };
}
