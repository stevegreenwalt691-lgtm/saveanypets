import { z } from "zod";
import { SPECIES_APPLICATION_QUESTIONS, type Species } from "@/lib/species";

export const HOME_TYPES = ["apartment", "house", "townhouse", "other"] as const;

export const HOME_TYPE_LABELS: Record<(typeof HOME_TYPES)[number], string> = {
  apartment: "Apartment",
  house: "House",
  townhouse: "Townhouse",
  other: "Other",
};

export const aboutYouSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name"),
  email: z.email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  city: z.string().trim().min(2, "Enter your city"),
});
export type AboutYouInput = z.infer<typeof aboutYouSchema>;

export const homeSchema = z.object({
  home_type: z.enum(HOME_TYPES, "Choose your home type"),
  owns_home: z.boolean(),
  landlord_allows_pets: z.boolean(),
  has_secure_outdoor_space: z.boolean(),
  household_size: z
    .number({ error: "Enter how many people are in your household" })
    .int()
    .min(1, "Enter at least 1")
    .max(20, "Enter a number 20 or below"),
  hours_alone: z
    .number({ error: "Enter a number of hours" })
    .int()
    .min(0, "Enter 0 or more")
    .max(24, "Enter a number up to 24"),
});
export type HomeInput = z.infer<typeof homeSchema>;

/** `reptile_experience` is only required when the pet is a bearded dragon. */
export function experienceSchema(species: Species) {
  const questions = SPECIES_APPLICATION_QUESTIONS[species];
  return z.object({
    current_pets: z.string().trim().max(500, "Keep it under 500 characters").optional(),
    reptile_experience: questions.showReptileExperience
      ? z.string().trim().min(10, "Tell us about your reptile experience")
      : z.string().trim().optional(),
    has_uvb_setup: z.boolean(),
    reason: z
      .string()
      .trim()
      .min(10, "Tell us a bit more, at least 10 characters")
      .max(1000, "Keep it under 1000 characters"),
  });
}
export type ExperienceInput = z.infer<ReturnType<typeof experienceSchema>>;

export const meetGreetSchema = z.object({
  slot_id: z.uuid("Choose a meet and greet time"),
});
export type MeetGreetInput = z.infer<typeof meetGreetSchema>;

export const reviewSchema = z.object({
  agreed_to_terms: z.boolean().refine((value) => value === true, {
    message: "You must agree before applying",
  }),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

/**
 * The full form, used by the wizard's resolver. `species` only changes which
 * fields are required, never the shape, so the type is the same for every
 * species.
 */
export function buildApplicationSchema(species: Species) {
  return aboutYouSchema
    .extend(homeSchema.shape)
    .extend(experienceSchema(species).shape)
    .extend(meetGreetSchema.shape)
    .extend(reviewSchema.shape);
}

export type ApplicationFormValues = z.infer<ReturnType<typeof buildApplicationSchema>>;

export const APPLICATION_STEPS = [
  "About you",
  "Your home",
  "Experience",
  "Meet and greet",
  "Review",
] as const;

export const STEP_FIELDS: Record<number, (keyof ApplicationFormValues)[]> = {
  1: Object.keys(aboutYouSchema.shape) as (keyof ApplicationFormValues)[],
  2: Object.keys(homeSchema.shape) as (keyof ApplicationFormValues)[],
  3: ["current_pets", "reptile_experience", "has_uvb_setup", "reason"],
  4: Object.keys(meetGreetSchema.shape) as (keyof ApplicationFormValues)[],
  5: Object.keys(reviewSchema.shape) as (keyof ApplicationFormValues)[],
};

export const APPLICATION_DEFAULT_VALUES: ApplicationFormValues = {
  full_name: "",
  email: "",
  phone: "",
  city: "",
  home_type: "apartment",
  owns_home: false,
  landlord_allows_pets: false,
  has_secure_outdoor_space: false,
  household_size: 1,
  hours_alone: 4,
  current_pets: "",
  reptile_experience: "",
  has_uvb_setup: false,
  reason: "",
  slot_id: "",
  agreed_to_terms: false,
};
