"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PetFormIdentity } from "./PetFormIdentity";
import { PetFormDetails } from "./PetFormDetails";
import { PetFormStory } from "./PetFormStory";
import { createPet, updatePet } from "@/lib/actions/pets";
import { petSchema, type PetFormInput, type PetFormValues } from "@/lib/validation/pet";
import { slugify } from "@/lib/slugify";

interface PetFormProps {
  mode: "create" | "edit";
  petId?: string;
  previousSlug?: string;
  defaultValues: PetFormInput;
}

export function PetForm({ mode, petId, previousSlug, defaultValues }: PetFormProps) {
  const router = useRouter();
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [formError, setFormError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<PetFormInput, unknown, PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues,
  });

  const name = watch("name");
  useEffect(() => {
    // Revalidate only after a submit attempt (hasAttemptedSubmit is a plain boolean, stable
    // across renders), so the auto-filled value can clear a stale error from that attempt.
    // An untouched field on first load should show no error.
    if (!slugEdited) setValue("slug", slugify(name ?? ""), { shouldValidate: hasAttemptedSubmit });
  }, [name, slugEdited, setValue, hasAttemptedSubmit]);

  const slugRegister = register("slug", { onChange: () => setSlugEdited(true) });

  const onSubmit = handleSubmit(
    (data) => {
      setHasAttemptedSubmit(true);
      setFormError(null);
      setJustSaved(false);

      startTransition(async () => {
        const result =
          mode === "create" ? await createPet(data) : await updatePet(petId!, previousSlug!, data);

        if (!result.ok) {
          for (const [field, messages] of Object.entries(result.errors)) {
            const message = messages?.[0];
            if (!message) continue;
            if (field === "form") {
              setFormError(message);
              continue;
            }
            setError(field as keyof PetFormInput, { message });
          }
          return;
        }

        if (mode === "create" && "id" in result) {
          router.push(`/admin/pets/${result.id}`);
        } else {
          setJustSaved(true);
          router.refresh();
        }
      });
    },
    () => setHasAttemptedSubmit(true),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <GlassCard>
        <PetFormIdentity register={register} errors={errors} slugRegister={slugRegister} />
      </GlassCard>
      <GlassCard>
        <PetFormDetails register={register} errors={errors} />
      </GlassCard>
      <GlassCard>
        <PetFormStory register={register} errors={errors} watch={watch} setValue={setValue} />
      </GlassCard>

      {formError ? <p className="text-sm text-danger">{formError}</p> : null}

      <div className="flex items-center justify-between gap-3">
        <Link href="/admin/pets" className="text-sm font-bold text-ink-2 hover:text-ink">
          Cancel
        </Link>
        <div className="flex items-center gap-3">
          {justSaved ? <span className="text-sm font-bold text-success">Saved</span> : null}
          <Button type="submit" pill={false} disabled={isPending}>
            {isPending ? "Saving..." : mode === "create" ? "Create pet" : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
