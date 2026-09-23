"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/actions/admin-guard";
import { petValuesSchema, type PetFormValues } from "@/lib/validation/pet";

interface PetActionErrors {
  form?: string[];
  [field: string]: string[] | undefined;
}

function toRow(data: PetFormValues) {
  return {
    name: data.name,
    slug: data.slug,
    species: data.species,
    breed: data.breed,
    sex: data.sex,
    size: data.size,
    birth_date: data.birth_date,
    weight_kg: data.weight_kg,
    length_cm: data.length_cm,
    story: data.story,
    personality: data.personality,
    good_with_kids: data.good_with_kids,
    good_with_dogs: data.good_with_dogs,
    good_with_cats: data.good_with_cats,
    vaccinated: data.vaccinated,
    spayed_neutered: data.spayed_neutered,
    vet_checked: data.vet_checked,
    health_notes: data.health_notes,
    care_needs: data.care_needs,
    adoption_fee: data.adoption_fee,
    status: data.status,
    featured: data.featured,
    video_url: data.video_url,
    intake_date: data.intake_date,
  };
}

function errorsFromDbError(error: { code?: string }): PetActionErrors {
  if (error.code === "23505") return { slug: ["That slug is already taken."] };
  return { form: ["Something went wrong. Please try again."] };
}

/** Every public page that lists or links to this pet. */
function revalidatePublicPetPaths(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/adopt");
  if (slug) revalidatePath(`/adopt/${slug}`);
}

export async function createPet(input: unknown) {
  const supabase = await requireStaff();

  const parsed = petValuesSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors as PetActionErrors };
  }

  const { data: pet, error } = await supabase
    .from("pets")
    .insert(toRow(parsed.data))
    .select("id, slug")
    .single();

  if (error) {
    return { ok: false as const, errors: errorsFromDbError(error) };
  }

  revalidatePublicPetPaths(pet.slug);
  revalidatePath("/admin/pets");
  return { ok: true as const, id: pet.id };
}

export async function updatePet(petId: string, previousSlug: string, input: unknown) {
  const supabase = await requireStaff();

  const parsed = petValuesSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors as PetActionErrors };
  }

  const { error } = await supabase.from("pets").update(toRow(parsed.data)).eq("id", petId);

  if (error) {
    return { ok: false as const, errors: errorsFromDbError(error) };
  }

  revalidatePublicPetPaths(previousSlug);
  if (parsed.data.slug !== previousSlug) revalidatePublicPetPaths(parsed.data.slug);
  revalidatePath("/admin/pets");
  revalidatePath(`/admin/pets/${petId}`);
  return { ok: true as const };
}
