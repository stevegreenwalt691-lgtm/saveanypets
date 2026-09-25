"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { TagInput } from "@/components/ui/TagInput";
import { Button } from "@/components/ui/Button";
import { createMeetSlots } from "@/lib/actions/meet-slots-admin";
import {
  createMeetSlotsSchema,
  CREATE_MEET_SLOTS_DEFAULT_VALUES,
  type CreateMeetSlotsInput,
} from "@/lib/validation/meet-slots";

export function CreateSlotsForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateMeetSlotsInput>({
    resolver: zodResolver(createMeetSlotsSchema),
    defaultValues: CREATE_MEET_SLOTS_DEFAULT_VALUES,
  });

  const times = watch("times") ?? [];

  const onSubmit = handleSubmit((data) => {
    setFormError(null);
    setSuccessMessage(null);
    startTransition(async () => {
      const result = await createMeetSlots(data);
      if (!result.ok) {
        setFormError(result.error ?? "Something went wrong.");
        return;
      }
      setSuccessMessage(`Created ${result.created} slot${result.created === 1 ? "" : "s"}.`);
      reset(CREATE_MEET_SLOTS_DEFAULT_VALUES);
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Start date" type="date" error={errors.start_date?.message} {...register("start_date")} />
        <Input label="End date" type="date" error={errors.end_date?.message} {...register("end_date")} />
      </div>

      <Input
        label="Capacity per slot"
        type="number"
        min="1"
        error={errors.capacity?.message}
        {...register("capacity")}
      />

      <TagInput
        label="Times (24 hour, e.g. 10:00)"
        value={times}
        onChange={(tags) => setValue("times", tags, { shouldValidate: true })}
        placeholder="10:00, 13:00, 15:30"
        error={errors.times?.message}
      />

      {formError ? <p className="text-sm text-danger">{formError}</p> : null}
      {successMessage ? <p className="text-sm font-bold text-success">{successMessage}</p> : null}

      <Button type="submit" pill={false} disabled={isPending} className="justify-center">
        {isPending ? "Creating..." : "Create slots"}
      </Button>
    </form>
  );
}
