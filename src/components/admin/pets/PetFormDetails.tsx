import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import type { PetFormInput } from "@/lib/validation/pet";

interface PetFormDetailsProps {
  register: UseFormRegister<PetFormInput>;
  errors: FieldErrors<PetFormInput>;
}

export function PetFormDetails({ register, errors }: PetFormDetailsProps) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl">Details</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Birth date (approximate is fine)"
          type="date"
          error={errors.birth_date?.message}
          {...register("birth_date")}
        />
        <Input label="Intake date" type="date" error={errors.intake_date?.message} {...register("intake_date")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Input
          label="Weight (kg)"
          type="number"
          step="0.1"
          min="0"
          error={errors.weight_kg?.message}
          {...register("weight_kg")}
        />
        <Input
          label="Length (cm, mainly dragons)"
          type="number"
          step="0.1"
          min="0"
          error={errors.length_cm?.message}
          {...register("length_cm")}
        />
        <Input
          label="Adoption fee"
          type="number"
          step="1"
          min="0"
          error={errors.adoption_fee?.message}
          {...register("adoption_fee")}
        />
      </div>

      <Input
        label="Video URL"
        type="url"
        placeholder="https://..."
        error={errors.video_url?.message}
        {...register("video_url")}
      />
    </div>
  );
}
