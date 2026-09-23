import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { SpeciesTag } from "@/components/ui/SpeciesTag";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { getGuideCoverUrl } from "@/lib/storage";

export async function generateMetadata({ params }: PageProps<"/care-guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: guide } = await supabase
    .from("care_guides")
    .select("title, summary")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!guide) return { title: "Care guide | Save Any Pets" };
  return { title: `${guide.title} | Save Any Pets`, description: guide.summary ?? undefined };
}

export default async function CareGuidePage({ params }: PageProps<"/care-guides/[slug]">) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: guide, error } = await supabase
    .from("care_guides")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  if (!guide) notFound();

  return (
    <main className="mx-auto w-full max-w-[760px] px-4 py-16 sm:px-14">
      <Link href="/care-guides" className="inline-flex items-center gap-2 text-sm font-bold text-ink-2 hover:text-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
        Back to care guides
      </Link>

      {guide.cover_path ? (
        <div className="relative mt-6 h-64 overflow-hidden rounded-[28px] sm:h-80">
          <Image src={getGuideCoverUrl(guide.cover_path)} alt="" fill sizes="760px" className="object-cover" />
        </div>
      ) : null}

      <div className="mt-6">
        {guide.species ? <SpeciesTag species={guide.species} /> : null}
        <h1 className="mt-3 text-[34px] sm:text-[44px]">{guide.title}</h1>
        {guide.summary ? <p className="mt-3 text-lg text-ink-2">{guide.summary}</p> : null}
      </div>

      <GlassCard className="mt-8">
        <MarkdownContent body={guide.body_md} />
      </GlassCard>
    </main>
  );
}
