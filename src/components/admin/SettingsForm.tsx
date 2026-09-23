"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { updateSiteSettings } from "@/lib/actions/site-settings";
import { siteSettingsSchema, OPENING_HOURS_DAYS, type SiteSettingsInput } from "@/lib/validation/site-settings";
import { SPECIES } from "@/lib/species";
import { PET_SPECIES } from "@/lib/validation/pet";

interface SettingsFormProps {
  defaultValues: SiteSettingsInput;
}

export function SettingsForm({ defaultValues }: SettingsFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SiteSettingsInput>({ resolver: zodResolver(siteSettingsSchema), defaultValues });

  const onSubmit = handleSubmit((data) => {
    setFormError(null);
    setJustSaved(false);

    startTransition(async () => {
      const result = await updateSiteSettings(data);
      if (!result.ok) {
        for (const [field, messages] of Object.entries(result.errors)) {
          const message = messages?.[0];
          if (!message) continue;
          if (field === "form") {
            setFormError(message);
            continue;
          }
          setError(field as keyof SiteSettingsInput, { message });
        }
        return;
      }
      setJustSaved(true);
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <GlassCard className="flex flex-col gap-5">
        <h2 className="text-2xl">Shelter details</h2>
        <Input label="Shelter name" error={errors.shelter_name?.message} {...register("shelter_name")} />
        <Input label="Address" error={errors.address?.message} {...register("address")} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Phone" type="tel" error={errors.phone?.message} {...register("phone")} />
          <Input label="WhatsApp number" error={errors.whatsapp?.message} {...register("whatsapp")} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Input
            label="Registration number"
            error={errors.registration_number?.message}
            {...register("registration_number")}
          />
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col gap-5">
        <h2 className="text-2xl">Adoption fees</h2>
        <p className="text-sm text-ink-2">Shown on /how-it-works. Leave blank to show a placeholder.</p>
        <div className="grid gap-5 sm:grid-cols-3">
          {PET_SPECIES.map((species) => (
            <Input
              key={species}
              label={SPECIES[species].label}
              type="number"
              step="1"
              min="0"
              {...register(`fees.${species}`)}
            />
          ))}
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col gap-5">
        <h2 className="text-2xl">Opening hours</h2>
        <p className="text-sm text-ink-2">Leave a day blank if closed or not yet decided.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {OPENING_HOURS_DAYS.map((day) => (
            <Input key={day} label={day} placeholder="9am to 5pm" {...register(`opening_hours.${day}`)} />
          ))}
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col gap-5">
        <h2 className="text-2xl">Donations</h2>
        <p className="text-sm text-ink-2">
          Bank transfer only, shown on /get-involved#donate. No online payment.
        </p>
        <Textarea
          label="Bank details"
          rows={4}
          placeholder="Bank name, account name, account number, branch code"
          error={errors.donation_details?.message}
          {...register("donation_details")}
        />
      </GlassCard>

      {formError ? <p className="text-sm text-danger">{formError}</p> : null}

      <div className="flex items-center justify-end gap-3">
        {justSaved ? <span className="text-sm font-bold text-success">Saved</span> : null}
        <Button type="submit" pill={false} disabled={isPending}>
          {isPending ? "Saving..." : "Save settings"}
        </Button>
      </div>
    </form>
  );
}
