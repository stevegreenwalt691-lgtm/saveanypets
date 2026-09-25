"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/actions/admin-guard";

interface PhotoActionResult {
  ok: boolean;
  error?: string;
}

function revalidateStoryPaths(storyId: string) {
  revalidatePath("/success-stories");
  revalidatePath(`/admin/stories/${storyId}`);
}

export async function uploadStoryPhoto(storyId: string, formData: FormData): Promise<PhotoActionResult> {
  const supabase = await requireStaff();

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "Something went wrong. Please try again." };

  const { data: story } = await supabase
    .from("success_stories")
    .select("photo_path")
    .eq("id", storyId)
    .maybeSingle();

  const path = `${storyId}/${crypto.randomUUID()}.webp`;
  const { error: uploadError } = await supabase.storage
    .from("story-photos")
    .upload(path, file, { contentType: "image/webp" });
  if (uploadError) return { ok: false, error: "Could not upload the photo." };

  const { error } = await supabase.from("success_stories").update({ photo_path: path }).eq("id", storyId);
  if (error) {
    await supabase.storage.from("story-photos").remove([path]);
    return { ok: false, error: "Could not save the photo." };
  }

  if (story?.photo_path) await supabase.storage.from("story-photos").remove([story.photo_path]);

  revalidateStoryPaths(storyId);
  return { ok: true };
}

export async function deleteStoryPhoto(storyId: string): Promise<PhotoActionResult> {
  const supabase = await requireStaff();

  const { data: story } = await supabase
    .from("success_stories")
    .select("photo_path")
    .eq("id", storyId)
    .maybeSingle();
  if (!story?.photo_path) return { ok: true };

  const { error } = await supabase.from("success_stories").update({ photo_path: null }).eq("id", storyId);
  if (error) return { ok: false, error: "Could not remove the photo." };

  await supabase.storage.from("story-photos").remove([story.photo_path]);

  revalidateStoryPaths(storyId);
  return { ok: true };
}
