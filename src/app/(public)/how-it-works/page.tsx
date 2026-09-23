import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { ADOPTION_STEPS } from "@/lib/adoption-steps";
import { formatFee } from "@/lib/pets";
import { getSiteSettings, getSpeciesFees } from "@/lib/site-settings";
import { SPECIES, type Species } from "@/lib/species";

export const metadata: Metadata = {
  title: "How it works | Save Any Pets",
  description: "How adopting a pet works, what the fee covers and answers to common questions.",
};

const SPECIES_ORDER: Species[] = ["dog", "cat", "bearded_dragon"];

const FAQS = [
  {
    question: "Is there a fee?",
    answer:
      "Yes. The fee varies by species and helps cover the cost of caring for pets before they are adopted. See the fees table above for each species.",
  },
  {
    question: "What happens at the meet and greet?",
    answer:
      "You will meet the pet in person before anything is final. It is a chance for everyone, including any other pets at home, to see if it is a good fit.",
  },
  {
    question: "Do you deliver pets?",
    answer:
      "No. Adoption is local pickup only, after you have met your new pet in person. We never ship or deliver an animal.",
  },
  {
    question: "Do you do home checks?",
    answer:
      "Some applications include a short home check, particularly for dogs that need space to run or bearded dragons that need a full tank setup ready. We will let you know if one is needed for your application.",
  },
  {
    question: "What if it does not work out?",
    answer:
      "Please contact us. We would always rather have a pet come back to us than be rehomed elsewhere without our knowledge.",
  },
  {
    question: "I have never owned a pet before, can I still adopt?",
    answer:
      "Yes. Many of our pets are a great fit for first time owners. We are happy to answer questions before and after you adopt.",
  },
  {
    question: "I already have pets, what happens with them?",
    answer:
      "Tell us about your current pets in your application. Where possible, we recommend introducing them during the meet and greet.",
  },
  {
    question: "How long does the process take?",
    answer:
      "It depends on the pet and how many applications we receive, but most applications are reviewed within [X] days.",
  },
];

export default async function HowItWorksPage() {
  const settings = await getSiteSettings();
  const fees = getSpeciesFees(settings);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-16 px-4 py-16 sm:px-14">
      <div>
        <p className="text-[13px] font-bold uppercase tracking-[1px] text-brand">How it works</p>
        <h1 className="mt-2 text-[34px] sm:text-[52px]">Adopting a pet, step by step</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-2">
          No payment is taken until after you meet the pet in person. Adoption is local pickup only,
          we never ship or deliver an animal.
        </p>
      </div>

      <GlassCard>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ADOPTION_STEPS.map((step, index) => (
            <div key={step.title} className="flex flex-col gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-tint text-brand">
                <step.icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.5px] text-ink-3">Step {index + 1}</p>
              <h3 className="text-xl">{step.title}</h3>
              <p className="text-sm text-ink-2">{step.body}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <section>
        <h2 className="text-2xl sm:text-[28px]">Adoption fees</h2>
        <GlassCard className="mt-5" noPadding>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-[0.5px] text-ink-3">
                <th className="px-6 py-4">Species</th>
                <th className="px-6 py-4">Typical fee</th>
              </tr>
            </thead>
            <tbody>
              {SPECIES_ORDER.map((species) => (
                <tr key={species} className="border-b border-ink/5 last:border-0">
                  <td className="px-6 py-4 font-bold text-ink">{SPECIES[species].plural}</td>
                  <td className="px-6 py-4 text-ink-2">
                    {fees[species] !== undefined ? formatFee(fees[species] ?? null) : "[PLACEHOLDER]"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
        <p className="mt-4 text-sm text-ink-2">
          Typically, the fee helps cover a vet check, vaccinations, spaying or neutering where
          applicable, and other care before adoption. [PLACEHOLDER: confirm exactly what is included
          for each species before launch.]
        </p>
      </section>

      <section>
        <h2 className="text-2xl sm:text-[28px]">Common questions</h2>
        <GlassCard className="mt-5" noPadding>
          <div className="px-6">
            <Accordion items={FAQS} />
          </div>
        </GlassCard>
      </section>

      <GlassCard className="text-center">
        <h2 className="text-2xl">Ready to meet your new friend?</h2>
        <p className="mt-2 text-ink-2">
          No payment until after your meet and greet. Local pickup only.
        </p>
        <Button href="/adopt" className="mt-5">
          Browse pets
        </Button>
      </GlassCard>
    </main>
  );
}
