import type { FieldErrors, UseFormRegister, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { SPECIES } from "@/lib/species";
import { PET_SEXES, PET_SIZES, type PetFormInput } from "@/lib/validation/pet";
import { PET_STATUSES, formatPetStatus, formatSex, formatSize } from "@/lib/pets";

const SPECIES_ENTRIES = Object.entries(SPECIES) as [keyof typeof SPECIES, (typeof SPECIES)[keyof typeof SPECIES]][];

interface PetFormIdentityProps {
  register: UseFormRegister<PetFormInput>;
  errors: FieldErrors<PetFormInput>;
  slugRegister: UseFormRegisterReturn;
}

export function PetFormIdentity({ register, errors, slugRegister }: PetFormIdentityProps) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl">Identity</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Name" error={errors.name?.message} {...register("name")} />
        <Input
          label="Slug"
          error={errors.slug?.message}
          {...slugRegister}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Select label="Species" error={errors.species?.message} {...register("species")}>
          {SPECIES_ENTRIES.map(([value, info]) => (
            <option key={value} value={value}>
              {info.label}
            </option>
          ))}
        </Select>
        <Select label="Sex" error={errors.sex?.message} {...register("sex")}>
          {PET_SEXES.map((value) => (
            <option key={value} value={value}>
              {formatSex(value)}
            </option>
          ))}
        </Select>
        <Select label="Size" error={errors.size?.message} {...register("size")}>
          <option value="">Not set</option>
          {PET_SIZES.map((value) => (
            <option key={value} value={value}>
              {formatSize(value)}
            </option>
          ))}
        </Select>
      </div>

      <Input label="Breed" error={errors.breed?.message} {...register("breed")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Select label="Status" error={errors.status?.message} {...register("status")}>
          {PET_STATUSES.map((value) => (
            <option key={value} value={value}>
              {formatPetStatus(value)}
            </option>
          ))}
        </Select>
        <div className="flex items-end pb-3.5">
          <Checkbox label="Featured on the home page" {...register("featured")} />
        </div>
      </div>
    </div>
  );
}
