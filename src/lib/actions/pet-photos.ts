"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/actions/admin-guard";

interface PhotoActionErrors {
  form?: string[];
}

function revalidatePetPages(slug: string, petId: string) {
  revalidatePath("/");
  revalidatePath("/adopt");
  revalidatePath(`/adopt/${slug}`);
  revalidatePath(`/admin/pets/${petId}`);
}

export async function uploadPetPhoto(formData: FormData) {
  const supabase = await requireStaff();

  const petId = formData.get("pet_id");
  const slug = formData.get("slug");
  const alt = formData.get("alt");
  const file = formData.get("file");

  if (
    typeof petId !== "string" ||
    typeof slug !== "string" ||
    typeof alt !== "string" ||
    !(file instanceof File)
  ) {
    return { ok: false as const, errors: { form: ["Something went wrong. Please try again."] } satisfies PhotoActionErrors };
  }
  if (!alt.trim()) {
    return { ok: false as const, errors: { form: ["Alt text is required."] } satisfies PhotoActionErrors };
  }

  const path = `${petId}/${crypto.randomUUID()}.webp`;
  const { error: uploadError } = await supabase.storage
    .from("pet-photos")
    .upload(path, file, { contentType: "image/webp" });
  if (uploadError) {
    return { ok: false as const, errors: { form: ["Could not upload the photo."] } satisfies PhotoActionErrors };
  }

  const { count } = await supabase
    .from("pet_photos")
    .select("id", { count: "exact", head: true })
    .eq("pet_id", petId);

  const { error: insertError } = await supabase.from("pet_photos").insert({
    pet_id: petId,
    path,
    alt: alt.trim(),
    is_primary: (count ?? 0) === 0,
    sort_order: count ?? 0,
  });

  if (insertError) {
    await supabase.storage.from("pet-photos").remove([path]);
    return { ok: false as const, errors: { form: ["Could not save the photo."] } satisfies PhotoActionErrors };
  }

  revalidatePetPages(slug, petId);
  return { ok: true as const };
}

export async function setPrimaryPetPhoto(photoId: string, petId: string, slug: string) {
  const supabase = await requireStaff();

  await supabase.from("pet_photos").update({ is_primary: false }).eq("pet_id", petId);
  const { error } = await supabase.from("pet_photos").update({ is_primary: true }).eq("id", photoId);
  if (error) {
    return { ok: false as const, errors: { form: ["Could not set the primary photo."] } satisfies PhotoActionErrors };
  }

  revalidatePetPages(slug, petId);
  return { ok: true as const };
}

export async function movePetPhoto(petId: string, slug: string, photoId: string, direction: "up" | "down") {
  const supabase = await requireStaff();

  const { data: photos, error } = await supabase
    .from("pet_photos")
    .select("id, sort_order")
    .eq("pet_id", petId)
    .order("sort_order", { ascending: true });
  if (error || !photos) {
    return { ok: false as const, errors: { form: ["Could not reorder photos."] } satisfies PhotoActionErrors };
  }

  const index = photos.findIndex((photo) => photo.id === photoId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= photos.length) {
    return { ok: true as const };
  }

  const current = photos[index];
  const swap = photos[swapIndex];
  await supabase.from("pet_photos").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("pet_photos").update({ sort_order: current.sort_order }).eq("id", swap.id);

  revalidatePetPages(slug, petId);
  return { ok: true as const };
}

export async function deletePetPhoto(photoId: string, petId: string, slug: string) {
  const supabase = await requireStaff();

  const { data: photo } = await supabase
    .from("pet_photos")
    .select("path, is_primary")
    .eq("id", photoId)
    .maybeSingle();
  if (!photo) {
    return { ok: false as const, errors: { form: ["Photo not found."] } satisfies PhotoActionErrors };
  }

  const { error: deleteError } = await supabase.from("pet_photos").delete().eq("id", photoId);
  if (deleteError) {
    return { ok: false as const, errors: { form: ["Could not delete the photo."] } satisfies PhotoActionErrors };
  }

  await supabase.storage.from("pet-photos").remove([photo.path]);

  if (photo.is_primary) {
    const { data: nextPhoto } = await supabase
      .from("pet_photos")
      .select("id")
      .eq("pet_id", petId)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (nextPhoto) {
      await supabase.from("pet_photos").update({ is_primary: true }).eq("id", nextPhoto.id);
    }
  }

  revalidatePetPages(slug, petId);
  return { ok: true as const };
}
