import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { TagInput } from "@/components/ui/TagInput";
import type { PetFormInput } from "@/lib/validation/pet";

interface PetFormStoryProps {
  register: UseFormRegister<PetFormInput>;
  errors: FieldErrors<PetFormInput>;
  watch: UseFormWatch<PetFormInput>;
  setValue: UseFormSetValue<PetFormInput>;
}

function GoodWithSelect({
  label,
  name,
  register,
}: {
  label: string;
  name: "good_with_kids" | "good_with_dogs" | "good_with_cats";
  register: UseFormRegister<PetFormInput>;
}) {
  return (
    <Select label={label} {...register(name)}>
      <option value="unknown">Not sure</option>
      <option value="true">Yes</option>
      <option value="false">No</option>
    </Select>
  );
}

export function PetFormStory({ register, errors, watch, setValue }: PetFormStoryProps) {
  const personality = watch("personality") ?? [];
  const careNeeds = watch("care_needs") ?? [];

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl">Story and care</h2>

      <Textarea label="Story" error={errors.story?.message} {...register("story")} />

      <TagInput
        label="Personality"
        value={personality}
        onChange={(tags) => setValue("personality", tags, { shouldDirty: true })}
        placeholder="playful, loyal, curious"
      />

      <TagInput
        label="Care needs"
        value={careNeeds}
        onChange={(tags) => setValue("care_needs", tags, { shouldDirty: true })}
        placeholder="daily walks, UVB lighting"
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <GoodWithSelect label="Good with kids" name="good_with_kids" register={register} />
        <GoodWithSelect label="Good with dogs" name="good_with_dogs" register={register} />
        <GoodWithSelect label="Good with cats" name="good_with_cats" register={register} />
      </div>

      <div className="flex flex-wrap gap-5">
        <Checkbox label="Vaccinated" {...register("vaccinated")} />
        <Checkbox label="Spayed or neutered" {...register("spayed_neutered")} />
        <Checkbox label="Vet checked" {...register("vet_checked")} />
      </div>

      <Textarea label="Health notes" error={errors.health_notes?.message} {...register("health_notes")} />
    </div>
  );
}
