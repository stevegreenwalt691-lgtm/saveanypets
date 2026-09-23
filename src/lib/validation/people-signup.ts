import { z } from "zod";
import { PET_SPECIES } from "@/lib/validation/pet";

export const SIGNUP_TYPES = ["foster", "volunteer"] as const;
export type SignupType = (typeof SIGNUP_TYPES)[number];

export const peopleSignupSchema = z.object({
  type: z.enum(SIGNUP_TYPES),
  full_name: z.string().trim().min(2, "Enter your full name"),
  email: z.email("Enter a valid email address"),
  phone: z.string().trim().max(40, "Keep it under 40 characters").optional(),
  species_interest: z.array(z.enum(PET_SPECIES)),
  message: z.string().trim().max(1000, "Keep it under 1000 characters").optional(),
});

export type PeopleSignupInput = z.infer<typeof peopleSignupSchema>;

export const PEOPLE_SIGNUP_DEFAULT_VALUES: PeopleSignupInput = {
  type: "foster",
  full_name: "",
  email: "",
  phone: "",
  species_interest: [],
  message: "",
};
