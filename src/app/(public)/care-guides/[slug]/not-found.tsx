import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Guide not found | Save Any Pets" };

export default function CareGuideNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <GlassCard strong className="flex flex-col items-center gap-4">
        <h1 className="text-2xl">We could not find that guide</h1>
        <p className="text-ink-2">It may have been unpublished, or the link may be out of date.</p>
        <Button href="/care-guides" className="mt-2">
          See all care guides
        </Button>
      </GlassCard>
    </main>
  );
}
