"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { createGuide, updateGuide } from "@/lib/actions/guides";
import { guideSchema, type GuideFormValues } from "@/lib/validation/guide";
import { PET_SPECIES } from "@/lib/validation/pet";
import { SPECIES } from "@/lib/species";
import { slugify } from "@/lib/slugify";

interface GuideFormProps {
  mode: "create" | "edit";
  guideId?: string;
  previousSlug?: string;
  defaultValues: GuideFormValues;
}

export function GuideForm({ mode, guideId, previousSlug, defaultValues }: GuideFormProps) {
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
  } = useForm<GuideFormValues>({ resolver: zodResolver(guideSchema), defaultValues });

  const title = watch("title");
  useEffect(() => {
    if (!slugEdited) setValue("slug", slugify(title ?? ""), { shouldValidate: hasAttemptedSubmit });
  }, [title, slugEdited, setValue, hasAttemptedSubmit]);

  const slugRegister = register("slug", { onChange: () => setSlugEdited(true) });
  const bodyMd = watch("body_md") ?? "";

  const onSubmit = handleSubmit(
    (data) => {
      setHasAttemptedSubmit(true);
      setFormError(null);
      setJustSaved(false);

      startTransition(async () => {
        const result = mode === "create" ? await createGuide(data) : await updateGuide(guideId!, previousSlug!, data);

        if (!result.ok) {
          for (const [field, messages] of Object.entries(result.errors)) {
            const message = messages?.[0];
            if (!message) continue;
            if (field === "form") {
              setFormError(message);
              continue;
            }
            setError(field as keyof GuideFormValues, { message });
          }
          return;
        }

        if (mode === "create" && "id" in result) {
          router.push(`/admin/guides/${result.id}`);
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
      <GlassCard className="flex flex-col gap-5">
        <h2 className="text-2xl">Guide</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Title" error={errors.title?.message} {...register("title")} />
          <Input label="Slug" error={errors.slug?.message} {...slugRegister} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Species" {...register("species")}>
            <option value="">General (all species)</option>
            {PET_SPECIES.map((species) => (
              <option key={species} value={species}>
                {SPECIES[species].label}
              </option>
            ))}
          </Select>
          <div className="flex items-end pb-3.5">
            <Checkbox label="Published" {...register("published")} />
          </div>
        </div>
        <Textarea label="Summary (optional)" error={errors.summary?.message} {...register("summary")} />
      </GlassCard>

      <GlassCard>
        <div className="grid gap-5 lg:grid-cols-2">
          <Textarea label="Body (markdown)" rows={16} error={errors.body_md?.message} {...register("body_md")} />
          <div>
            <p className="text-sm font-bold text-ink">Preview</p>
            <div className="mt-1.5 max-h-[420px] overflow-y-auto rounded-[14px] border border-ink/15 bg-white/75 p-4">
              {bodyMd.trim() ? <MarkdownContent body={bodyMd} /> : <p className="text-sm text-ink-3">Nothing to preview yet.</p>}
            </div>
          </div>
        </div>
      </GlassCard>

      {formError ? <p className="text-sm text-danger">{formError}</p> : null}

      <div className="flex items-center justify-between gap-3">
        <Link href="/admin/guides" className="text-sm font-bold text-ink-2 hover:text-ink">
          Cancel
        </Link>
        <div className="flex items-center gap-3">
          {justSaved ? <span className="text-sm font-bold text-success">Saved</span> : null}
          <Button type="submit" pill={false} disabled={isPending}>
            {isPending ? "Saving..." : mode === "create" ? "Create guide" : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
