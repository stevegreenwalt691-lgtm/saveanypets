import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Pet not found | Save Any Pets" };

export default function PetNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <GlassCard strong className="flex flex-col items-center gap-4">
        <h1 className="text-2xl">We could not find that pet</h1>
        <p className="text-ink-2">
          They may have already found a home, or the link may be out of date.
        </p>
        <Button href="/adopt" className="mt-2">
          See pets waiting to be adopted
        </Button>
      </GlassCard>
    </main>
  );
}
