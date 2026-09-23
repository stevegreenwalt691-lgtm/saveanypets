import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlobBackground } from "@/components/layout/BlobBackground";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({ children }: LayoutProps<"/admin">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const staffName = profile?.full_name ?? user.email ?? "Staff";

  return (
    <>
      <BlobBackground soft />
      <div className="mx-auto flex w-full max-w-[1440px] gap-4 px-0 py-4 lg:px-4">
        <AdminSidebar staffName={staffName} />
        <main className="min-w-0 flex-1 px-4 pb-16 lg:px-0 lg:py-0">{children}</main>
      </div>
    </>
  );
}
