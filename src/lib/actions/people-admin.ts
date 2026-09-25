"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/actions/admin-guard";

interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function markSignupHandled(id: string, handled: boolean): Promise<ActionResult> {
  const supabase = await requireStaff();
  const { error } = await supabase.from("people_signups").update({ handled }).eq("id", id);
  if (error) return { ok: false, error: "Could not update this signup." };
  revalidatePath("/admin/people");
  return { ok: true };
}

export async function markSurrenderHandled(id: string, handled: boolean): Promise<ActionResult> {
  const supabase = await requireStaff();
  const { error } = await supabase.from("surrenders").update({ handled }).eq("id", id);
  if (error) return { ok: false, error: "Could not update this request." };
  revalidatePath("/admin/people");
  return { ok: true };
}
