"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";
import { submitSurrender } from "@/lib/actions/surrenders";
import { surrenderSchema, SURRENDER_DEFAULT_VALUES, type SurrenderInput } from "@/lib/validation/surrender";
import { PET_SPECIES } from "@/lib/validation/pet";
import { SPECIES } from "@/lib/species";

interface SurrenderFormProps {
  turnstileSiteKey: string;
}

export function SurrenderForm({ turnstileSiteKey }: SurrenderFormProps) {
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
  } = useForm<SurrenderInput>({
    resolver: zodResolver(surrenderSchema),
    defaultValues: SURRENDER_DEFAULT_VALUES,
  });

  const onSubmit = handleSubmit((data) => {
    setFormError(null);
    if (!turnstileToken) {
      setFormError("Please complete the verification below.");
      return;
    }

    startTransition(async () => {
      const result = await submitSurrender({
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
          setError(field as keyof SurrenderInput, { message });
        }
        return;
      }

      setSubmitted(true);
    });
  });

  if (submitted) {
    return (
      <div className="rounded-[16px] bg-white/65 p-5 text-sm text-ink-2">
        <p className="font-bold text-ink">Thank you for reaching out.</p>
        <p className="mt-1">Our team will contact you soon to talk through next steps.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div hidden aria-hidden="true">
        <label htmlFor="surrender-hp">Leave this field blank</label>
        <input
          id="surrender-hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypotValue}
          onChange={(event) => setHoneypotValue(event.target.value)}
        />
      </div>

      <Input label="Your name" error={errors.owner_name?.message} {...register("owner_name")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Email (optional)" type="email" error={errors.email?.message} {...register("email")} />
        <Input label="Phone" type="tel" error={errors.phone?.message} {...register("phone")} />
      </div>

      <Select label="Species" error={errors.species?.message} {...register("species")}>
        {PET_SPECIES.map((species) => (
          <option key={species} value={species}>
            {SPECIES[species].label}
          </option>
        ))}
      </Select>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Pet's name (optional)" error={errors.pet_name?.message} {...register("pet_name")} />
        <Input label="Pet's age (optional)" placeholder="e.g. 3 years" error={errors.pet_age?.message} {...register("pet_age")} />
      </div>

      <Textarea
        label="Why are you rehoming them?"
        error={errors.reason?.message}
        {...register("reason")}
      />

      <TurnstileWidget siteKey={turnstileSiteKey} onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />

      {formError ? <p className="text-sm text-danger">{formError}</p> : null}

      <Button type="submit" pill={false} disabled={isPending} className="justify-center">
        {isPending ? "Sending..." : "Send request"}
      </Button>
    </form>
  );
}
