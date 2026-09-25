import { SPECIES } from "@/lib/species";
import { formatFee } from "@/lib/pets";
import { SITE_URL } from "@/lib/site-url";
import type { Species } from "@/lib/species";

interface ApplicationEmailInput {
  applicantName: string;
  petName: string;
  species: Species;
  adoptionFee: number | null;
  slotLabel: string;
  shelterName: string;
  shelterEmail: string | null;
  shelterPhone: string | null;
}

export function applicantConfirmationEmail(input: ApplicationEmailInput) {
  const speciesLabel = SPECIES[input.species].label.toLowerCase();

  return {
    subject: `We got your application for ${input.petName}`,
    text: [
      `Hi ${input.applicantName},`,
      "",
      `Thanks for applying to adopt ${input.petName}, our ${speciesLabel}. Your application has been received.`,
      "",
      `What happens next: our team will review your answers and reach out to confirm your meet and greet on ${input.slotLabel}.`,
      "",
      `Adoption fee: ${formatFee(input.adoptionFee)}. This is paid in person, after your meet and greet. No payment is taken before then, and adoption is local pickup only.`,
      "",
      input.shelterEmail || input.shelterPhone
        ? `Questions? Reach us at ${[input.shelterEmail, input.shelterPhone].filter(Boolean).join(" or ")}.`
        : "Questions? Reply to this email and we will help.",
      "",
      `${input.shelterName}`,
    ].join("\n"),
  };
}

export function staffAlertEmail(input: ApplicationEmailInput & { applicantEmail: string; applicantPhone: string }) {
  return {
    subject: `New application: ${input.petName}`,
    text: [
      `A new application came in for ${input.petName}.`,
      "",
      `Applicant: ${input.applicantName}`,
      `Email: ${input.applicantEmail}`,
      `Phone: ${input.applicantPhone}`,
      `Requested meet and greet: ${input.slotLabel}`,
      "",
      `Review and respond: ${SITE_URL}/admin/applications`,
    ].join("\n"),
  };
}
