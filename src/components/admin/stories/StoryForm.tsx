"use client";

import { useState, useTransition } from "react";
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
import { createStory, updateStory } from "@/lib/actions/stories";
import { storySchema, type StoryFormValues } from "@/lib/validation/story";

interface StoryFormProps {
  mode: "create" | "edit";
  storyId?: string;
  defaultValues: StoryFormValues;
  pets: { id: string; name: string }[];
}

export function StoryForm({ mode, storyId, defaultValues, pets }: StoryFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<StoryFormValues>({ resolver: zodResolver(storySchema), defaultValues });

  const body = watch("body") ?? "";

  const onSubmit = handleSubmit((data) => {
    setFormError(null);
    setJustSaved(false);

    startTransition(async () => {
      const result = mode === "create" ? await createStory(data) : await updateStory(storyId!, data);

      if (!result.ok) {
        for (const [field, messages] of Object.entries(result.errors)) {
          const message = messages?.[0];
          if (!message) continue;
          if (field === "form") {
            setFormError(message);
            continue;
          }
          setError(field as keyof StoryFormValues, { message });
        }
        return;
      }

      if (mode === "create" && "id" in result) {
        router.push(`/admin/stories/${result.id}`);
      } else {
        setJustSaved(true);
        router.refresh();
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <GlassCard className="flex flex-col gap-5">
        <h2 className="text-2xl">Story</h2>
        <Input label="Title" error={errors.title?.message} {...register("title")} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Pet (optional)" {...register("pet_id")}>
            <option value="">No pet linked</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </Select>
          <Input
            label="Adopter first name (optional)"
            error={errors.adopter_first_name?.message}
            {...register("adopter_first_name")}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Textarea label="Story" rows={10} error={errors.body?.message} {...register("body")} />
          <div>
            <p className="text-sm font-bold text-ink">Preview</p>
            <div className="mt-1.5 rounded-[14px] border border-ink/15 bg-white/75 p-4">
              {body.trim() ? <MarkdownContent body={body} /> : <p className="text-sm text-ink-3">Nothing to preview yet.</p>}
            </div>
          </div>
        </div>

        <Checkbox label="The adopter has given consent to publish this story" {...register("consent_given")} />
        <Checkbox label="Published" {...register("published")} />
        {errors.published ? <p className="text-sm text-danger">{errors.published.message}</p> : null}
      </GlassCard>

      {formError ? <p className="text-sm text-danger">{formError}</p> : null}

      <div className="flex items-center justify-between gap-3">
        <Link href="/admin/stories" className="text-sm font-bold text-ink-2 hover:text-ink">
          Cancel
        </Link>
        <div className="flex items-center gap-3">
          {justSaved ? <span className="text-sm font-bold text-success">Saved</span> : null}
          <Button type="submit" pill={false} disabled={isPending}>
            {isPending ? "Saving..." : mode === "create" ? "Create story" : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
