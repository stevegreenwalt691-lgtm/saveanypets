import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import type { ApplicationFormValues } from "@/lib/validation/application";

interface StepAboutYouProps {
  register: UseFormRegister<ApplicationFormValues>;
  errors: FieldErrors<ApplicationFormValues>;
}

export function StepAboutYou({ register, errors }: StepAboutYouProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl">About you</h2>
        <p className="mt-1 text-sm text-ink-2">Tell us a little about yourself.</p>
      </div>

      <Input
        label="Full name"
        autoComplete="name"
        error={errors.full_name?.message}
        {...register("full_name")}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Phone"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>
      <Input label="City" autoComplete="address-level2" error={errors.city?.message} {...register("city")} />
    </div>
  );
}
