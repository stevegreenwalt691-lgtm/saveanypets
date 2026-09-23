import { z } from "zod";
import { PET_STATUSES, type PetRow } from "@/lib/pets";

export const PET_SPECIES = ["dog", "cat", "bearded_dragon"] as const;
export const PET_SEXES = ["male", "female", "unknown"] as const;
export const PET_SIZES = ["small", "medium", "large"] as const;

export const TRI_STATE_OPTIONS = ["unknown", "true", "false"] as const;
export type TriState = (typeof TRI_STATE_OPTIONS)[number];

function optionalNumberField(message = "Enter a valid number") {
  return z
    .string()
    .optional()
    .transform((value) => (value && value.trim() !== "" ? value.trim() : undefined))
    .refine((value) => value === undefined || !Number.isNaN(Number(value)), { message })
    .transform((value) => (value === undefined ? null : Number(value)));
}

function optionalDateField() {
  return z
    .string()
    .optional()
    .transform((value) => (value && value.trim() !== "" ? value : null));
}

function optionalTextField(max: number) {
  return z
    .string()
    .max(max, `Keep it under ${max} characters`)
    .optional()
    .transform((value) => (value && value.trim() !== "" ? value.trim() : null));
}

const optionalUrlField = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || z.url().safeParse(value).success, "Enter a valid URL")
  .transform((value) => (value ? value : null));

const triStateField = z.enum(TRI_STATE_OPTIONS).transform((value) => (value === "unknown" ? null : value === "true"));

export const petSchema = z.object({
  name: z.string().trim().min(1, "Enter a name"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter a slug")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  species: z.enum(PET_SPECIES),
  breed: optionalTextField(120),
  sex: z.enum(PET_SEXES),
  size: z
    .union([z.enum(PET_SIZES), z.literal("")])
    .optional()
    .transform((value) => (value ? value : null)),
  birth_date: optionalDateField(),
  weight_kg: optionalNumberField(),
  length_cm: optionalNumberField(),
  story: optionalTextField(2000),
  personality: z.array(z.string().trim().min(1)).default([]),
  good_with_kids: triStateField,
  good_with_dogs: triStateField,
  good_with_cats: triStateField,
  vaccinated: z.boolean(),
  spayed_neutered: z.boolean(),
  vet_checked: z.boolean(),
  health_notes: optionalTextField(2000),
  care_needs: z.array(z.string().trim().min(1)).default([]),
  adoption_fee: optionalNumberField(),
  status: z.enum(PET_STATUSES),
  featured: z.boolean(),
  video_url: optionalUrlField,
  intake_date: z.string().min(1, "Enter an intake date"),
});

export type PetFormValues = z.infer<typeof petSchema>;

/** The shape react-hook-form actually holds before zod transforms run. */
export type PetFormInput = z.input<typeof petSchema>;

/**
 * Re-validates the already-transformed values a trusted browser sent (never trust the client).
 * `petSchema` above parses the raw strings from the form; this parses the final shape those
 * transforms produce, since the client sends `PetFormValues`, not `PetFormInput`.
 */
export const petValuesSchema = z.object({
  name: z.string().trim().min(1, "Enter a name"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter a slug")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  species: z.enum(PET_SPECIES),
  breed: z.string().max(120).nullable(),
  sex: z.enum(PET_SEXES),
  size: z.enum(PET_SIZES).nullable(),
  birth_date: z.string().nullable(),
  weight_kg: z.number().nullable(),
  length_cm: z.number().nullable(),
  story: z.string().max(2000).nullable(),
  personality: z.array(z.string().trim().min(1)),
  good_with_kids: z.boolean().nullable(),
  good_with_dogs: z.boolean().nullable(),
  good_with_cats: z.boolean().nullable(),
  vaccinated: z.boolean(),
  spayed_neutered: z.boolean(),
  vet_checked: z.boolean(),
  health_notes: z.string().max(2000).nullable(),
  care_needs: z.array(z.string().trim().min(1)),
  adoption_fee: z.number().nullable(),
  status: z.enum(PET_STATUSES),
  featured: z.boolean(),
  video_url: z.url().nullable(),
  intake_date: z.string().min(1, "Enter an intake date"),
});

export const PET_FORM_DEFAULT_VALUES: PetFormInput = {
  name: "",
  slug: "",
  species: "dog",
  breed: "",
  sex: "unknown",
  size: "",
  birth_date: "",
  weight_kg: "",
  length_cm: "",
  story: "",
  personality: [],
  good_with_kids: "unknown",
  good_with_dogs: "unknown",
  good_with_cats: "unknown",
  vaccinated: false,
  spayed_neutered: false,
  vet_checked: false,
  health_notes: "",
  care_needs: [],
  adoption_fee: "",
  status: "draft",
  featured: false,
  video_url: "",
  intake_date: new Date().toISOString().slice(0, 10),
};

export function triStateFromBoolean(value: boolean | null): TriState {
  if (value === null) return "unknown";
  return value ? "true" : "false";
}

/** Converts a pets row from the database into the string-shaped values the edit form needs. */
export function petRowToFormInput(pet: PetRow): PetFormInput {
  return {
    name: pet.name,
    slug: pet.slug,
    species: pet.species,
    breed: pet.breed ?? "",
    sex: pet.sex,
    size: pet.size ?? "",
    birth_date: pet.birth_date ?? "",
    weight_kg: pet.weight_kg !== null ? String(pet.weight_kg) : "",
    length_cm: pet.length_cm !== null ? String(pet.length_cm) : "",
    story: pet.story ?? "",
    personality: pet.personality,
    good_with_kids: triStateFromBoolean(pet.good_with_kids),
    good_with_dogs: triStateFromBoolean(pet.good_with_dogs),
    good_with_cats: triStateFromBoolean(pet.good_with_cats),
    vaccinated: pet.vaccinated,
    spayed_neutered: pet.spayed_neutered,
    vet_checked: pet.vet_checked,
    health_notes: pet.health_notes ?? "",
    care_needs: pet.care_needs,
    adoption_fee: pet.adoption_fee !== null ? String(pet.adoption_fee) : "",
    status: pet.status,
    featured: pet.featured,
    video_url: pet.video_url ?? "",
    intake_date: pet.intake_date,
  };
}
