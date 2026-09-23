import type { Metadata } from "next";
import { Heart, PawPrint, HandHeart } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PeopleSignupForm } from "@/components/forms/PeopleSignupForm";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Get involved | Save Any Pets",
  description: "Donate, foster or volunteer with Save Any Pets.",
};

export default async function GetInvolvedPage() {
  const settings = await getSiteSettings();
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  return (
    <main className="mx-auto w-full max-w-[900px] px-4 py-16 sm:px-14">
      <div>
        <p className="text-[13px] font-bold uppercase tracking-[1px] text-brand">Get involved</p>
        <h1 className="mt-2 text-[34px] sm:text-[52px]">Help pets waiting for a home</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-2">
          There are a few ways to help, whether you have money, time or a spare room to give.
        </p>
      </div>

      <GlassCard id="donate" className="mt-12 scroll-mt-24">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white">
          <Heart className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <h2 className="mt-4 text-2xl">Donate</h2>
        <p className="mt-2 text-ink-2">
          Donations help cover food, vet care and shelter costs for pets waiting to be adopted.
          Save Any Pets does not take donations online, all gifts are by bank transfer.
        </p>
        <div className="mt-5 rounded-[16px] bg-white/65 p-5 text-sm text-ink-2">
          {settings.donation_details ? (
            <p className="whitespace-pre-line">{settings.donation_details}</p>
          ) : (
            <p>[PLACEHOLDER: bank transfer details go here, added in /admin/settings]</p>
          )}
          <p className="mt-3 font-bold text-ink">Please use your name as the reference.</p>
        </div>
      </GlassCard>

      <GlassCard id="foster" className="mt-8 scroll-mt-24">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-tint text-brand">
          <PawPrint className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <h2 className="mt-4 text-2xl">Foster</h2>
        <p className="mt-2 text-ink-2">
          Open your home short term to a pet who needs a break from the shelter, extra socialisation,
          or space while they wait for their forever home.
        </p>
        <div className="mt-5">
          <PeopleSignupForm type="foster" turnstileSiteKey={turnstileSiteKey} />
        </div>
      </GlassCard>

      <GlassCard id="volunteer" className="mt-8 scroll-mt-24">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-tint text-brand">
          <HandHeart className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <h2 className="mt-4 text-2xl">Volunteer</h2>
        <p className="mt-2 text-ink-2">
          Walk dogs, socialise cats, help with bearded dragon care, or lend a hand at adoption
          events near you.
        </p>
        <div className="mt-5">
          <PeopleSignupForm type="volunteer" turnstileSiteKey={turnstileSiteKey} />
        </div>
      </GlassCard>
    </main>
  );
}
