import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { HOME_TYPES, HOME_TYPE_LABELS, type ApplicationFormValues } from "@/lib/validation/application";
import { SPECIES_APPLICATION_QUESTIONS, type Species } from "@/lib/species";

interface StepHomeProps {
  register: UseFormRegister<ApplicationFormValues>;
  errors: FieldErrors<ApplicationFormValues>;
  species: Species;
  ownsHome: boolean;
}

export function StepHome({ register, errors, species, ownsHome }: StepHomeProps) {
  const questions = SPECIES_APPLICATION_QUESTIONS[species];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl">Your home</h2>
        <p className="mt-1 text-sm text-ink-2">Help us picture where {"they'd"} be living.</p>
      </div>

      <Select label="Home type" error={errors.home_type?.message} {...register("home_type")}>
        {HOME_TYPES.map((type) => (
          <option key={type} value={type}>
            {HOME_TYPE_LABELS[type]}
          </option>
        ))}
      </Select>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="People in your household"
          type="number"
          min={1}
          max={20}
          error={errors.household_size?.message}
          {...register("household_size", { valueAsNumber: true })}
        />
        <Input
          label="Hours the pet would be alone on a typical day"
          type="number"
          min={0}
          max={24}
          error={errors.hours_alone?.message}
          {...register("hours_alone", { valueAsNumber: true })}
        />
      </div>

      <Checkbox label="I own my home" {...register("owns_home")} />
      {!ownsHome ? <Checkbox label="My landlord allows pets" {...register("landlord_allows_pets")} /> : null}
      {questions.showSecureOutdoorSpace ? (
        <Checkbox label="I have a secure, fenced outdoor space" {...register("has_secure_outdoor_space")} />
      ) : null}
    </div>
  );
}
