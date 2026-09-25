import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GuideForm } from "@/components/admin/guides/GuideForm";
import { GuideCoverManager } from "@/components/admin/guides/GuideCoverManager";
import type { GuideFormValues } from "@/lib/validation/guide";

export const metadata: Metadata = { title: "Edit guide | Save Any Pets admin" };

export default async function EditGuidePage({ params }: PageProps<"/admin/guides/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: guide, error } = await supabase.from("care_guides").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  if (!guide) notFound();

  const defaultValues: GuideFormValues = {
    title: guide.title,
    slug: guide.slug,
    species: guide.species ?? "",
    summary: guide.summary ?? "",
    body_md: guide.body_md,
    published: guide.published,
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <h1 className="text-[34px] sm:text-[40px]">{guide.title}</h1>
      <GuideForm mode="edit" guideId={guide.id} previousSlug={guide.slug} defaultValues={defaultValues} />
      <GuideCoverManager guideId={guide.id} slug={guide.slug} coverPath={guide.cover_path} />
    </div>
  );
}
