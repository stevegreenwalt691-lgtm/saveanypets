import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/content/LegalPageLayout";

export const metadata: Metadata = { title: "Privacy policy | Save Any Pets" };

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy policy"
      intro="This page explains what information we collect and how we use it. Last updated: [PLACEHOLDER DATE]."
    >
      <section>
        <h2 className="text-xl">What we collect</h2>
        <p className="mt-2 text-ink-2">
          When you apply to adopt, sign up to foster or volunteer, contact us, or ask us to rehome a
          pet, we collect the details you give us in that form, such as your name, email, phone
          number and address. We also save which pets you have marked as favourites in your own
          browser, this never leaves your device.
        </p>
      </section>

      <section>
        <h2 className="text-xl">How we use it</h2>
        <p className="mt-2 text-ink-2">
          We use your information to review applications, arrange meet and greets, respond to
          messages, and keep records of adoptions. We do not sell your information, and we do not
          use it for advertising.
        </p>
      </section>

      <section>
        <h2 className="text-xl">Who we share it with</h2>
        <p className="mt-2 text-ink-2">
          We use third party services to run this site: Supabase to store data securely, Resend to
          send email, and Cloudflare Turnstile to keep spam out of our forms. These providers only
          process data on our behalf and under their own privacy terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl">How long we keep it</h2>
        <p className="mt-2 text-ink-2">[PLACEHOLDER: confirm the retention period, for example how long declined applications are kept.]</p>
      </section>

      <section>
        <h2 className="text-xl">Your rights</h2>
        <p className="mt-2 text-ink-2">
          You can ask us what information we hold about you, or ask us to correct or delete it, by
          contacting us at [PLACEHOLDER EMAIL].
        </p>
      </section>
    </LegalPageLayout>
  );
}
