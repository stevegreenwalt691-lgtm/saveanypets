import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SpeciesTag } from "@/components/ui/SpeciesTag";

export const metadata: Metadata = { title: "Guides | Save Any Pets admin" };

export default async function AdminGuidesPage() {
  const supabase = await createClient();
  const { data: guides, error } = await supabase
    .from("care_guides")
    .select("id, title, species, published")
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[34px] sm:text-[40px]">Care guides</h1>
        <Button href="/admin/guides/new" pill={false}>
          <Plus className="h-4 w-4" strokeWidth={2} />
          New guide
        </Button>
      </div>

      <GlassCard noPadding className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-[0.5px] text-ink-3">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Species</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(guides ?? []).map((guide) => (
              <tr key={guide.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3 font-bold text-ink">{guide.title}</td>
                <td className="px-4 py-3">{guide.species ? <SpeciesTag species={guide.species} /> : "General"}</td>
                <td className="px-4 py-3 text-ink-2">{guide.published ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/guides/${guide.id}`} className="text-sm font-bold text-brand hover:text-brand-hover">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(guides ?? []).length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-2">No guides yet.</p>
        ) : null}
      </GlassCard>
    </div>
  );
}
