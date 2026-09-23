"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";
import { submitPeopleSignup } from "@/lib/actions/people-signups";
import {
  peopleSignupSchema,
  PEOPLE_SIGNUP_DEFAULT_VALUES,
  type PeopleSignupInput,
  type SignupType,
} from "@/lib/validation/people-signup";
import { PET_SPECIES } from "@/lib/validation/pet";
import { SPECIES } from "@/lib/species";

interface PeopleSignupFormProps {
  type: SignupType;
  turnstileSiteKey: string;
}

export function PeopleSignupForm({ type, turnstileSiteKey }: PeopleSignupFormProps) {
  const [honeypotValue, setHoneypotValue] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PeopleSignupInput>({
    resolver: zodResolver(peopleSignupSchema),
    defaultValues: { ...PEOPLE_SIGNUP_DEFAULT_VALUES, type },
  });

  const onSubmit = handleSubmit((data) => {
    setFormError(null);
    if (!turnstileToken) {
      setFormError("Please complete the verification below.");
      return;
    }

    startTransition(async () => {
      const result = await submitPeopleSignup({
        hp_field: honeypotValue,
        turnstileToken,
        values: data,
      });

      if (!result.ok) {
        for (const [field, messages] of Object.entries(result.errors)) {
          const message = messages?.[0];
          if (!message) continue;
          if (field === "form") {
            setFormError(message);
            continue;
          }
          setError(field as keyof PeopleSignupInput, { message });
        }
        return;
      }

      setSubmitted(true);
    });
  });

  if (submitted) {
    return (
      <div className="rounded-[16px] bg-white/65 p-5 text-sm text-ink-2">
        <p className="font-bold text-ink">Thank you for signing up.</p>
        <p className="mt-1">We will be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div hidden aria-hidden="true">
        <label htmlFor={`${type}-hp`}>Leave this field blank</label>
        <input
          id={`${type}-hp`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypotValue}
          onChange={(event) => setHoneypotValue(event.target.value)}
        />
      </div>

      <Input label="Full name" error={errors.full_name?.message} {...register("full_name")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <Input label="Phone (optional)" type="tel" error={errors.phone?.message} {...register("phone")} />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-bold text-ink">Which pets interest you?</legend>
        <div className="flex flex-wrap gap-4">
          {PET_SPECIES.map((species) => (
            <Checkbox
              key={species}
              label={SPECIES[species].label}
              value={species}
              {...register("species_interest")}
            />
          ))}
        </div>
      </fieldset>

      <Textarea
        label="Anything you would like us to know? (optional)"
        error={errors.message?.message}
        {...register("message")}
      />

      <TurnstileWidget siteKey={turnstileSiteKey} onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />

      {formError ? <p className="text-sm text-danger">{formError}</p> : null}

      <Button type="submit" pill={false} disabled={isPending} className="justify-center">
        {isPending ? "Sending..." : type === "foster" ? "Sign up to foster" : "Sign up to volunteer"}
      </Button>
    </form>
  );
}
