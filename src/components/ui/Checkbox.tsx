import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label htmlFor={checkboxId} className={cn("flex items-center gap-2.5 text-sm text-ink-2", className)}>
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border border-ink/25 bg-white/75 has-[:checked]:border-brand has-[:checked]:bg-brand">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          {...props}
        />
        <Check
          aria-hidden
          className="pointer-events-none h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100"
          strokeWidth={3}
        />
      </span>
      {label}
    </label>
  );
});
