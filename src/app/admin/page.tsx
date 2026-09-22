import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Admin | Save Any Pets",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user
    ? (
        await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .maybeSingle()
      ).data
    : null;

  const displayName = profile?.full_name ?? user?.email ?? "staff";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-16">
      <GlassCard className="w-full max-w-md text-center">
        <h1 className="text-2xl">Logged in as {displayName}</h1>
        <p className="mt-1 text-sm text-ink-2">Role: {profile?.role ?? "staff"}</p>
        <form action={signOut} className="mt-6">
          <Button type="submit" variant="outline" pill={false} className="w-full justify-center">
            Sign out
          </Button>
        </form>
      </GlassCard>
    </main>
  );
}
