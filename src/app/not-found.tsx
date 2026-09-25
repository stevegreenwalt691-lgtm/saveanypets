import type { Metadata } from "next";
import { BlobBackground } from "@/components/layout/BlobBackground";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Page not found | Save Any Pets" };

export default function NotFound() {
  return (
    <>
      <BlobBackground />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <GlassCard strong className="flex flex-col items-center gap-4">
          <p className="font-display text-6xl font-bold text-ink">404</p>
          <h1 className="text-2xl">We could not find that page</h1>
          <p className="text-ink-2">
            The page may have moved, or the pet you were looking for may have found a home.
          </p>
          <Button href="/adopt" className="mt-2">
            See pets waiting to be adopted
          </Button>
        </GlassCard>
      </main>
      <SiteFooter />
    </>
  );
}
