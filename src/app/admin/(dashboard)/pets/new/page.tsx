import type { Metadata } from "next";
import { PetForm } from "@/components/admin/pets/PetForm";
import { PET_FORM_DEFAULT_VALUES } from "@/lib/validation/pet";

export const metadata: Metadata = { title: "Add a pet | Save Any Pets admin" };

export default function NewPetPage() {
  return (
    <div className="flex flex-col gap-6 py-8">
      <h1 className="text-[34px] sm:text-[40px]">Add a pet</h1>
      <PetForm mode="create" defaultValues={PET_FORM_DEFAULT_VALUES} />
    </div>
  );
}
