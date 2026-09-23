import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PetForm } from "@/components/admin/pets/PetForm";
import { PhotoManager } from "@/components/admin/pets/PhotoManager";
import { petRowToFormInput } from "@/lib/validation/pet";

export async function generateMetadata({ params }: PageProps<"/admin/pets/[id]">): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: pet } = await supabase.from("pets").select("name").eq("id", id).maybeSingle();
  return { title: pet ? `${pet.name} | Save Any Pets admin` : "Edit pet | Save Any Pets admin" };
}

export default async function EditPetPage({ params }: PageProps<"/admin/pets/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pet, error } = await supabase
    .from("pets")
    .select("*, pet_photos(id, path, alt, is_primary, sort_order)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!pet) notFound();

  return (
    <div className="flex flex-col gap-6 py-8">
      <h1 className="text-[34px] sm:text-[40px]">{pet.name}</h1>
      <PetForm mode="edit" petId={pet.id} previousSlug={pet.slug} defaultValues={petRowToFormInput(pet)} />
      <PhotoManager petId={pet.id} slug={pet.slug} photos={pet.pet_photos} />
    </div>
  );
}
