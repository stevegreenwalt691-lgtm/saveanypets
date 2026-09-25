"use client";

import { useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default function PetProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <GlassCard strong className="flex flex-col items-center gap-4">
        <h1 className="text-2xl">We could not load this pet</h1>
        <p className="text-ink-2">Something went wrong. Please try again.</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Button href="/adopt" variant="outline">
            Back to Adopt
          </Button>
        </div>
      </GlassCard>
    </main>
  );
}
