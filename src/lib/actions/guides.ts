"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/actions/admin-guard";
import { guideSchema } from "@/lib/validation/guide";

interface GuideErrors {
  form?: string[];
  [field: string]: string[] | undefined;
}

function errorsFromDbError(error: { code?: string }): GuideErrors {
  if (error.code === "23505") return { slug: ["That slug is already taken."] };
  return { form: ["Something went wrong. Please try again."] };
}

function revalidateGuidePaths(slug?: string | null) {
  revalidatePath("/care-guides");
  revalidatePath("/");
  if (slug) revalidatePath(`/care-guides/${slug}`);
}

export async function createGuide(input: unknown) {
  const supabase = await requireStaff();

  const parsed = guideSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors as GuideErrors };
  }
  const data = parsed.data;

  const { data: guide, error } = await supabase
    .from("care_guides")
    .insert({
      title: data.title,
      slug: data.slug,
      species: data.species ? data.species : null,
      summary: data.summary?.trim() || null,
      body_md: data.body_md,
      published: data.published,
      published_at: data.published ? new Date().toISOString() : null,
    })
    .select("id, slug")
    .single();

  if (error) {
    return { ok: false as const, errors: errorsFromDbError(error) };
  }

  revalidateGuidePaths(guide.slug);
  revalidatePath("/admin/guides");
  return { ok: true as const, id: guide.id };
}

export async function updateGuide(id: string, previousSlug: string, input: unknown) {
  const supabase = await requireStaff();

  const parsed = guideSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors as GuideErrors };
  }
  const data = parsed.data;

  const { data: existing } = await supabase.from("care_guides").select("published_at").eq("id", id).maybeSingle();

  const { error } = await supabase
    .from("care_guides")
    .update({
      title: data.title,
      slug: data.slug,
      species: data.species ? data.species : null,
      summary: data.summary?.trim() || null,
      body_md: data.body_md,
      published: data.published,
      published_at: data.published ? (existing?.published_at ?? new Date().toISOString()) : existing?.published_at ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { ok: false as const, errors: errorsFromDbError(error) };
  }

  revalidateGuidePaths(previousSlug);
  if (data.slug !== previousSlug) revalidateGuidePaths(data.slug);
  revalidatePath("/admin/guides");
  revalidatePath(`/admin/guides/${id}`);
  return { ok: true as const };
}
