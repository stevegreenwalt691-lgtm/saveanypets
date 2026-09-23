import { z } from "zod";
import { PET_SPECIES } from "@/lib/validation/pet";

export const surrenderSchema = z.object({
  owner_name: z.string().trim().min(2, "Enter your full name"),
  email: z.email("Enter a valid email address").optional().or(z.literal("")),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  species: z.enum(PET_SPECIES),
  pet_name: z.string().trim().max(80, "Keep it under 80 characters").optional(),
  pet_age: z.string().trim().max(40, "Keep it under 40 characters").optional(),
  reason: z.string().trim().min(10, "Tell us a bit more, at least 10 characters").max(2000, "Keep it under 2000 characters"),
});

export type SurrenderInput = z.infer<typeof surrenderSchema>;

export const SURRENDER_DEFAULT_VALUES: SurrenderInput = {
  owner_name: "",
  email: "",
  phone: "",
  species: "dog",
  pet_name: "",
  pet_age: "",
  reason: "",
};
