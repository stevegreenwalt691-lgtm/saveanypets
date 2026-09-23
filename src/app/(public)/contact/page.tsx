import type { Metadata } from "next";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { getSiteSettings, formatOpeningHours } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Contact | Save Any Pets",
  description: "Address, phone, WhatsApp and opening hours.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const hours = formatOpeningHours(settings);

  const address = settings.address ?? "[PLACEHOLDER ADDRESS]";
  const phone = settings.phone ?? "[PLACEHOLDER PHONE]";
  const email = settings.email ?? "[PLACEHOLDER EMAIL]";
  const whatsappDigits = settings.whatsapp?.replace(/[^\d]/g, "");
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <main className="mx-auto w-full max-w-[1000px] px-4 py-16 sm:px-14">
      <p className="text-[13px] font-bold uppercase tracking-[1px] text-brand">Contact</p>
      <h1 className="mt-2 text-[34px] sm:text-[52px]">Get in touch</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-2">
        Questions about a pet, an application, or how to help? Reach out any time.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <GlassCard className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.8} />
            <span className="text-ink-2">{address}</span>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.8} />
            <a href={`tel:${phone}`} className="text-ink-2 hover:text-ink">
              {phone}
            </a>
          </div>
          {settings.whatsapp ? (
            <div className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.8} />
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-2 hover:text-ink"
              >
                Chat on WhatsApp
              </a>
            </div>
          ) : null}
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.8} />
            <a href={`mailto:${email}`} className="text-ink-2 hover:text-ink">
              {email}
            </a>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.8} />
            <div className="text-ink-2">
              {hours && hours.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {hours.map((entry) => (
                    <li key={entry.day}>
                      <span className="font-bold text-ink">{entry.day}:</span> {entry.hours}
                    </li>
                  ))}
                </ul>
              ) : (
                <span>[PLACEHOLDER OPENING HOURS]</span>
              )}
            </div>
          </div>
          {settings.registration_number ? (
            <p className="text-sm text-ink-3">Registration number: {settings.registration_number}</p>
          ) : null}
        </GlassCard>

        <GlassCard noPadding className="overflow-hidden">
          <iframe
            title="Map"
            src={mapSrc}
            className="h-[360px] w-full border-0 sm:h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </GlassCard>
      </div>
    </main>
  );
}
