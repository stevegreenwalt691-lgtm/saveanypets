"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/actions/admin-guard";

interface PhotoActionResult {
  ok: boolean;
  error?: string;
}

function revalidateGuidePaths(slug: string, guideId: string) {
  revalidatePath("/care-guides");
  revalidatePath(`/care-guides/${slug}`);
  revalidatePath(`/admin/guides/${guideId}`);
}

export async function uploadGuideCover(guideId: string, slug: string, formData: FormData): Promise<PhotoActionResult> {
  const supabase = await requireStaff();

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "Something went wrong. Please try again." };

  const { data: guide } = await supabase.from("care_guides").select("cover_path").eq("id", guideId).maybeSingle();

  const path = `${guideId}/${crypto.randomUUID()}.webp`;
  const { error: uploadError } = await supabase.storage
    .from("guide-covers")
    .upload(path, file, { contentType: "image/webp" });
  if (uploadError) return { ok: false, error: "Could not upload the image." };

  const { error } = await supabase.from("care_guides").update({ cover_path: path }).eq("id", guideId);
  if (error) {
    await supabase.storage.from("guide-covers").remove([path]);
    return { ok: false, error: "Could not save the image." };
  }

  if (guide?.cover_path) await supabase.storage.from("guide-covers").remove([guide.cover_path]);

  revalidateGuidePaths(slug, guideId);
  return { ok: true };
}

export async function deleteGuideCover(guideId: string, slug: string): Promise<PhotoActionResult> {
  const supabase = await requireStaff();

  const { data: guide } = await supabase.from("care_guides").select("cover_path").eq("id", guideId).maybeSingle();
  if (!guide?.cover_path) return { ok: true };

  const { error } = await supabase.from("care_guides").update({ cover_path: null }).eq("id", guideId);
  if (error) return { ok: false, error: "Could not remove the image." };

  await supabase.storage.from("guide-covers").remove([guide.cover_path]);

  revalidateGuidePaths(slug, guideId);
  return { ok: true };
}
