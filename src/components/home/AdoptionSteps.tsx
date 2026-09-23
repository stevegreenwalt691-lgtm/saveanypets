import { GlassCard } from "@/components/ui/GlassCard";
import { ADOPTION_STEPS } from "@/lib/adoption-steps";

export function AdoptionSteps() {
  return (
    <GlassCard>
      <h2 className="text-[28px] sm:text-[40px]">How adopting works</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {ADOPTION_STEPS.map((step, index) => (
          <div key={step.title} className="flex flex-col gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-tint text-brand">
              <step.icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.5px] text-ink-3">
              Step {index + 1}
            </p>
            <h3 className="text-xl">{step.title}</h3>
            <p className="text-sm text-ink-2">{step.body}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
