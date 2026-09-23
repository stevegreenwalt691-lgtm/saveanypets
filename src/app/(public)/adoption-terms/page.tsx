import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/content/LegalPageLayout";

export const metadata: Metadata = { title: "Adoption terms | Save Any Pets" };

export default function AdoptionTermsPage() {
  return (
    <LegalPageLayout
      title="Adoption terms"
      intro="These are the terms you agree to when you adopt a pet from us. Last updated: [PLACEHOLDER DATE]."
    >
      <section>
        <h2 className="text-xl">Meeting before adopting</h2>
        <p className="mt-2 text-ink-2">
          Every adoption starts with a meet and greet in person. No payment is taken before this
          meeting, and adoption is local pickup only, we never ship or deliver an animal.
        </p>
      </section>

      <section>
        <h2 className="text-xl">The adoption fee</h2>
        <p className="mt-2 text-ink-2">
          The adoption fee is shown on each pet&apos;s profile and is paid in person after your meet and
          greet. There are no hidden fees added later. [PLACEHOLDER: confirm accepted payment methods,
          for example cash or bank transfer on the day.]
        </p>
      </section>

      <section>
        <h2 className="text-xl">Your responsibilities</h2>
        <p className="mt-2 text-ink-2">
          By adopting, you agree to provide appropriate food, shelter, exercise and veterinary care
          for your pet, and to keep your contact details up to date with us.
        </p>
      </section>

      <section>
        <h2 className="text-xl">If it does not work out</h2>
        <p className="mt-2 text-ink-2">
          If you are no longer able to care for a pet adopted from us, please contact us first. We
          would rather have them come back to us than be rehomed elsewhere without our knowledge.
        </p>
      </section>

      <section>
        <h2 className="text-xl">Returns and refunds</h2>
        <p className="mt-2 text-ink-2">[PLACEHOLDER: confirm the shelter&apos;s refund policy, if any, for returned pets.]</p>
      </section>
    </LegalPageLayout>
  );
}
