"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { updateApplicationNotes } from "@/lib/actions/applications-admin";

interface StaffNotesFieldProps {
  applicationId: string;
  defaultValue: string;
}

export function StaffNotesField({ applicationId, defaultValue }: StaffNotesFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [savedValue, setSavedValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleBlur() {
    if (value === savedValue) return;
    setError(null);
    startTransition(async () => {
      const result = await updateApplicationNotes(applicationId, value);
      if (!result.ok) {
        setError(result.error ?? "Could not save notes.");
        return;
      }
      setSavedValue(value);
    });
  }

  return (
    <div>
      <Textarea
        label="Staff notes"
        rows={5}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={handleBlur}
        placeholder="Notes only staff can see"
      />
      <p className="mt-1 text-xs text-ink-3">
        {isPending ? "Saving..." : error ? <span className="text-danger">{error}</span> : "Saves automatically when you click away."}
      </p>
    </div>
  );
}
