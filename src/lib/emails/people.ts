import { SPECIES } from "@/lib/species";
import type { Species } from "@/lib/species";
import type { SignupType } from "@/lib/validation/people-signup";

export function staffSignupAlertEmail(input: {
  type: SignupType;
  fullName: string;
  email: string;
  phone?: string;
  speciesInterest: Species[];
  message?: string;
}) {
  const label = input.type === "foster" ? "foster" : "volunteer";
  return {
    subject: `New ${label} signup: ${input.fullName}`,
    text: [
      `A new ${label} signup came in.`,
      "",
      `Name: ${input.fullName}`,
      `Email: ${input.email}`,
      input.phone ? `Phone: ${input.phone}` : null,
      input.speciesInterest.length > 0
        ? `Interested in: ${input.speciesInterest.map((species) => SPECIES[species].label).join(", ")}`
        : null,
      input.message ? `Message: ${input.message}` : null,
      "",
      "Open the admin panel to follow up.",
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

export function staffSurrenderAlertEmail(input: {
  ownerName: string;
  email?: string;
  phone: string;
  species: Species;
  petName?: string;
  petAge?: string;
  reason: string;
}) {
  return {
    subject: `New surrender request: ${input.ownerName}`,
    text: [
      `A new surrender request came in.`,
      "",
      `Owner: ${input.ownerName}`,
      input.email ? `Email: ${input.email}` : null,
      `Phone: ${input.phone}`,
      `Species: ${SPECIES[input.species].label}`,
      input.petName ? `Pet name: ${input.petName}` : null,
      input.petAge ? `Pet age: ${input.petAge}` : null,
      "",
      `Reason: ${input.reason}`,
      "",
      "Open the admin panel to follow up.",
    ]
      .filter(Boolean)
      .join("\n"),
  };
}
