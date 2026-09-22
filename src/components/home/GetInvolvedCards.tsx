import { Heart, PawPrint, HandHeart } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export function GetInvolvedCards() {
  return (
    <section>
      <h2 className="text-[28px] sm:text-[40px]">Get involved</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col gap-4 rounded-[28px] bg-brand p-7 text-white">
          <Heart className="h-8 w-8" strokeWidth={1.8} />
          <h3 className="text-xl text-white">Donate</h3>
          <p className="flex-1 text-sm text-white/90">
            Help cover food, vet care and shelter costs for pets waiting for a home.
          </p>
          <Button
            href="/get-involved#donate"
            variant="outline"
            pill={false}
            className="border-white text-white hover:bg-white/10"
          >
            Donate
          </Button>
        </div>

        <GlassCard noPadding className="flex flex-col gap-4 p-7">
          <PawPrint className="h-8 w-8 text-brand" strokeWidth={1.8} />
          <h3 className="text-xl">Foster</h3>
          <p className="flex-1 text-sm text-ink-2">
            Open your home short term to a pet who needs a break from the shelter.
          </p>
          <Button href="/get-involved#foster" variant="dark" pill={false}>
            Foster a pet
          </Button>
        </GlassCard>

        <GlassCard noPadding className="flex flex-col gap-4 p-7">
          <HandHeart className="h-8 w-8 text-brand" strokeWidth={1.8} />
          <h3 className="text-xl">Volunteer</h3>
          <p className="flex-1 text-sm text-ink-2">
            Walk dogs, socialise cats or help at adoption events near you.
          </p>
          <Button href="/get-involved#volunteer" variant="dark" pill={false}>
            Volunteer
          </Button>
        </GlassCard>
      </div>
    </section>
  );
}
