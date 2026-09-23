import { z } from "zod";

export const OPENING_HOURS_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || z.email().safeParse(value).success, "Enter a valid email address");

export const siteSettingsSchema = z.object({
  shelter_name: z.string().trim().min(1, "Enter a shelter name"),
  address: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  email: optionalEmail,
  registration_number: z.string().trim().optional(),
  donation_details: z.string().trim().optional(),
  fees: z.object({
    dog: z.string().trim().optional(),
    cat: z.string().trim().optional(),
    bearded_dragon: z.string().trim().optional(),
  }),
  opening_hours: z.object(
    Object.fromEntries(OPENING_HOURS_DAYS.map((day) => [day, z.string().trim().optional()])) as Record<
      (typeof OPENING_HOURS_DAYS)[number],
      z.ZodOptional<z.ZodString>
    >,
  ),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
