import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "About | Save Any Pets",
  description: "Who we are and why we do this work.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <main className="mx-auto w-full max-w-[800px] px-4 py-16 sm:px-14">
      <p className="text-[13px] font-bold uppercase tracking-[1px] text-brand">About us</p>
      <h1 className="mt-2 text-[34px] sm:text-[52px]">About {settings.shelter_name}</h1>

      <GlassCard className="mt-8">
        <p className="text-lg leading-relaxed text-ink-2">[PLACEHOLDER: shelter origin story]</p>
        <p className="mt-4 text-ink-2">
          [PLACEHOLDER: mission statement, how many pets have been rehomed, and what makes this
          rescue different. Replace all bracketed text with the client&apos;s real copy before launch.]
        </p>
        {settings.registration_number ? (
          <p className="mt-4 text-sm text-ink-3">Registration number: {settings.registration_number}</p>
        ) : (
          <p className="mt-4 text-sm text-ink-3">Registration number: [PLACEHOLDER REG NUMBER]</p>
        )}
      </GlassCard>

      <section className="mt-12">
        <h2 className="text-2xl sm:text-[28px]">Our team</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {[1, 2].map((placeholder) => (
            <GlassCard key={placeholder} noPadding className="flex flex-col gap-3 p-6">
              <div className="h-16 w-16 rounded-full bg-ink/10" />
              <h3 className="text-lg">[PLACEHOLDER NAME]</h3>
              <p className="text-sm text-ink-2">[PLACEHOLDER ROLE AND BIO]</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <GlassCard className="mt-12 text-center">
        <h2 className="text-2xl">Trust and safety come first</h2>
        <p className="mt-2 text-ink-2">
          No payment before a meet and greet, no shipping, and real reviews only. See our{" "}
          <a href="/how-it-works" className="font-bold text-brand hover:underline">
            adoption process
          </a>{" "}
          for details.
        </p>
      </GlassCard>
    </main>
  );
}
