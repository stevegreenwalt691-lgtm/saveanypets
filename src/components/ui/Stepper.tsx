import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  /** 1-indexed current step. */
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <ol aria-label="Progress" className={cn("flex w-full gap-2", className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber <= currentStep;
        const isCurrent = stepNumber === currentStep;
        return (
          <li
            key={step}
            aria-current={isCurrent ? "step" : undefined}
            className="flex flex-1 flex-col gap-2"
          >
            <span
              aria-hidden
              className={cn(
                "block h-1.5 w-full rounded-full",
                isComplete ? "bg-brand" : "bg-ink/10",
              )}
            />
            <span
              className={cn(
                "text-xs",
                isCurrent ? "font-bold text-ink" : "text-ink-3",
              )}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
