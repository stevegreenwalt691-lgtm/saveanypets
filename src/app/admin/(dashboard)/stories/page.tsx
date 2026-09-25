import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Stories | Save Any Pets admin" };

export default async function AdminStoriesPage() {
  const supabase = await createClient();
  const { data: stories, error } = await supabase
    .from("success_stories")
    .select("id, title, published, consent_given, pets(name)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[34px] sm:text-[40px]">Stories</h1>
        <Button href="/admin/stories/new" pill={false}>
          <Plus className="h-4 w-4" strokeWidth={2} />
          New story
        </Button>
      </div>

      <GlassCard noPadding className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-[0.5px] text-ink-3">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Pet</th>
              <th className="px-4 py-3">Consent</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(stories ?? []).map((story) => (
              <tr key={story.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3 font-bold text-ink">{story.title}</td>
                <td className="px-4 py-3 text-ink-2">{story.pets?.name ?? "Not linked"}</td>
                <td className="px-4 py-3 text-ink-2">{story.consent_given ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-ink-2">{story.published ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/stories/${story.id}`} className="text-sm font-bold text-brand hover:text-brand-hover">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(stories ?? []).length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-2">No stories yet.</p>
        ) : null}
      </GlassCard>
    </div>
  );
}
