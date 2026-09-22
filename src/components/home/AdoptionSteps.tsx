import { Search, ClipboardList, Handshake, Home } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const STEPS = [
  {
    icon: Search,
    title: "Browse pets",
    body: "Filter by species, age or size and find a pet who fits your home.",
  },
  {
    icon: ClipboardList,
    title: "Apply online",
    body: "Tell us about your home and experience. It only takes a few minutes.",
  },
  {
    icon: Handshake,
    title: "Meet in person",
    body: "Book a meet and greet. There is no fee until after you have met your new friend.",
  },
  {
    icon: Home,
    title: "Bring them home",
    body: "Pay the adoption fee in person and take your new friend home. Local pickup only.",
  },
];

export function AdoptionSteps() {
  return (
    <GlassCard>
      <h2 className="text-[28px] sm:text-[40px]">How adopting works</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
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
