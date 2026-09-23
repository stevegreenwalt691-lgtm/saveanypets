import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { SurrenderForm } from "@/components/forms/SurrenderForm";

export const metadata: Metadata = {
  title: "Rehome a pet | Save Any Pets",
  description: "If you can no longer care for your pet, tell us about your situation.",
};

export default function SurrenderPage() {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  return (
    <main className="mx-auto w-full max-w-[700px] px-4 py-16 sm:px-14">
      <div>
        <p className="text-[13px] font-bold uppercase tracking-[1px] text-brand">Rehoming</p>
        <h1 className="mt-2 text-[34px] sm:text-[52px]">If you need to rehome a pet</h1>
        <p className="mt-3 text-lg text-ink-2">
          Life circumstances change, and sometimes rehoming is the kindest option. We understand
          this is not an easy step to take.
        </p>
      </div>

      <GlassCard className="mt-8">
        <h2 className="text-xl">What happens next</h2>
        <p className="mt-2 text-sm text-ink-2">
          Fill in the form below and our team will get in touch, usually within a few days, to talk
          through your situation and next steps. Depending on space and your pet&apos;s needs, this might
          mean bringing them to us, a foster placement, or advice on rehoming safely yourself.
        </p>
      </GlassCard>

      <GlassCard className="mt-6">
        <SurrenderForm turnstileSiteKey={turnstileSiteKey} />
      </GlassCard>
    </main>
  );
}
