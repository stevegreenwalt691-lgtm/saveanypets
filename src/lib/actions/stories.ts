"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/actions/admin-guard";
import { storySchema } from "@/lib/validation/story";

interface StoryErrors {
  form?: string[];
  [field: string]: string[] | undefined;
}

function revalidateStoryPaths() {
  revalidatePath("/success-stories");
  revalidatePath("/admin/stories");
}

export async function createStory(input: unknown) {
  const supabase = await requireStaff();

  const parsed = storySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors as StoryErrors };
  }
  const data = parsed.data;

  const { data: story, error } = await supabase
    .from("success_stories")
    .insert({
      title: data.title,
      pet_id: data.pet_id ? data.pet_id : null,
      adopter_first_name: data.adopter_first_name?.trim() || null,
      body: data.body,
      consent_given: data.consent_given,
      published: data.published,
      published_at: data.published ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) {
    return {
      ok: false as const,
      errors: { form: ["Something went wrong. Please try again."] } satisfies StoryErrors,
    };
  }

  revalidateStoryPaths();
  return { ok: true as const, id: story.id };
}

export async function updateStory(id: string, input: unknown) {
  const supabase = await requireStaff();

  const parsed = storySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors as StoryErrors };
  }
  const data = parsed.data;

  const { data: existing } = await supabase.from("success_stories").select("published_at").eq("id", id).maybeSingle();

  const { error } = await supabase
    .from("success_stories")
    .update({
      title: data.title,
      pet_id: data.pet_id ? data.pet_id : null,
      adopter_first_name: data.adopter_first_name?.trim() || null,
      body: data.body,
      consent_given: data.consent_given,
      published: data.published,
      published_at: data.published ? (existing?.published_at ?? new Date().toISOString()) : existing?.published_at ?? null,
    })
    .eq("id", id);

  if (error) {
    return {
      ok: false as const,
      errors: { form: ["Something went wrong. Please try again."] } satisfies StoryErrors,
    };
  }

  revalidateStoryPaths();
  revalidatePath(`/admin/stories/${id}`);
  return { ok: true as const };
}
