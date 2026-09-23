import Link from "next/link";
import { Heart } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";

const SITE_LINKS = [
  { href: "/adopt", label: "Adopt" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/care-guides", label: "Care guides" },
  { href: "/success-stories", label: "Stories" },
  { href: "/get-involved", label: "Get involved" },
  { href: "/surrender", label: "Rehome a pet" },
];

const ABOUT_LINKS = [
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/adoption-terms", label: "Adoption terms" },
];

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const address = settings.address ?? "[PLACEHOLDER ADDRESS]";
  const phone = settings.phone ?? "[PLACEHOLDER PHONE]";
  const email = settings.email ?? "[PLACEHOLDER EMAIL]";
  const registrationNumber = settings.registration_number ?? "[PLACEHOLDER REG NUMBER]";

  return (
    <footer className="mt-24 px-4 pb-10 sm:px-14">
      <div className="glass mx-auto max-w-[1280px] rounded-[28px] p-8 sm:p-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <Heart className="h-5 w-5 text-brand" strokeWidth={1.8} />
              {settings.shelter_name}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink-2">
              A rescue and rehoming home for dogs, cats and bearded dragons. Local pickup only, meet your new friend before you pay.
            </p>
          </div>

          <nav aria-label="Site">
            <p className="text-sm font-bold text-ink">Site</p>
            <ul className="mt-3 flex flex-col gap-2">
              {SITE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-2 hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="About">
            <p className="text-sm font-bold text-ink">About</p>
            <ul className="mt-3 flex flex-col gap-2">
              {ABOUT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-2 hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-bold text-ink">Contact</p>
            <address className="mt-3 flex flex-col gap-2 text-sm not-italic text-ink-2">
              <span>{address}</span>
              <a href={`tel:${phone}`} className="hover:text-ink">
                {phone}
              </a>
              <a href={`mailto:${email}`} className="hover:text-ink">
                {email}
              </a>
              <span>Registration number: {registrationNumber}</span>
            </address>
          </div>
        </div>

        <div className="mt-10 border-t border-ink/10 pt-6 text-xs text-ink-3">
          <p>
            {settings.shelter_name} never asks for payment before a meet and greet, and never ships
            or delivers an animal. Adoption is local pickup only.
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} {settings.shelter_name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
