"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validation/login";
import { createClient } from "@/lib/supabase/server";

interface SignInErrors {
  email?: string[];
  password?: string[];
  form?: string[];
}

export async function signIn(input: unknown) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    const errors: SignInErrors = parsed.error.flatten().fieldErrors;
    return { ok: false as const, errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    const errors: SignInErrors = { form: ["Incorrect email or password."] };
    return { ok: false as const, errors };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
