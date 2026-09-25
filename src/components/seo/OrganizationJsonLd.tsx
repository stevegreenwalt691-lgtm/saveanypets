import { SITE_URL } from "@/lib/site-url";
import type { SiteSettings } from "@/lib/site-settings";

interface OrganizationJsonLdProps {
  settings: SiteSettings;
}

/** Structured data for the shelter, read by search engines. No visible output. */
export function OrganizationJsonLd({ settings }: OrganizationJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "AnimalShelter",
    name: settings.shelter_name,
    url: SITE_URL,
    ...(settings.address ? { address: settings.address } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
