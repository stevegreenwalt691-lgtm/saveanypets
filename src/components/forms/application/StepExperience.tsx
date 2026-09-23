import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import type { ApplicationFormValues } from "@/lib/validation/application";
import { SPECIES, SPECIES_APPLICATION_QUESTIONS, type Species } from "@/lib/species";

interface StepExperienceProps {
  register: UseFormRegister<ApplicationFormValues>;
  errors: FieldErrors<ApplicationFormValues>;
  species: Species;
  petName: string;
}

export function StepExperience({ register, errors, species, petName }: StepExperienceProps) {
  const questions = SPECIES_APPLICATION_QUESTIONS[species];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl">Experience</h2>
        <p className="mt-1 text-sm text-ink-2">A bit about your experience with pets.</p>
      </div>

      <Textarea
        label={questions.currentPetsLabel}
        error={errors.current_pets?.message}
        {...register("current_pets")}
      />

      {questions.showReptileExperience ? (
        <Textarea
          label={`Your experience keeping ${SPECIES[species].label.toLowerCase()}s or other reptiles`}
          error={errors.reptile_experience?.message}
          {...register("reptile_experience")}
        />
      ) : null}

      {questions.showUvbSetup ? (
        <Checkbox
          label="I already have, or am ready to buy, a UVB lighting setup"
          {...register("has_uvb_setup")}
        />
      ) : null}

      <Textarea
        label={`Why do you want to adopt ${petName}?`}
        error={errors.reason?.message}
        {...register("reason")}
      />
    </div>
  );
}
