import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export class NotStaffError extends Error {
  constructor() {
    super("You must be signed in as staff to do that.");
    this.name = "NotStaffError";
  }
}

export class NotAdminError extends Error {
  constructor() {
    super("Only an admin can do that.");
    this.name = "NotAdminError";
  }
}

/**
 * Every admin server action calls this first. The proxy already blocks
 * anonymous visitors from `/admin/*`, but RLS is the real security, so each
 * mutation checks `is_staff()` again on the server before doing anything.
 */
export async function requireStaff(): Promise<SupabaseClient<Database>> {
  const supabase = await createClient();
  const { data: isStaff } = await supabase.rpc("is_staff");
  if (!isStaff) throw new NotStaffError();
  return supabase;
}

/** Settings and staff management are admin only, per the `admin_write` RLS policy. */
export async function requireAdmin(): Promise<SupabaseClient<Database>> {
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) throw new NotAdminError();
  return supabase;
}
