"use client";

import { useId, useState } from "react";
import type { KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
}

export function TagInput({ label, value, onChange, placeholder, error }: TagInputProps) {
  const [draft, setDraft] = useState("");
  const inputId = useId();

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag || value.includes(tag)) {
      setDraft("");
      return;
    }
    onChange([...value, tag]);
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(draft);
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-bold text-ink">
        {label}
      </label>
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-[14px] border border-ink/15 bg-white/75 px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2",
          error && "border-danger",
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-sm font-bold text-ink-2"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((existing) => existing !== tag))}
              aria-label={`Remove ${tag}`}
              className="text-ink-3 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </span>
        ))}
        <input
          id={inputId}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={value.length === 0 ? placeholder : undefined}
          className="min-w-[120px] flex-1 bg-transparent text-ink placeholder:text-ink-3 focus:outline-none"
        />
      </div>
      <p className="text-xs text-ink-3">Press enter or comma to add.</p>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
