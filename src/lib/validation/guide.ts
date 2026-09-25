import { z } from "zod";
import { PET_SPECIES } from "@/lib/validation/pet";

export const guideSchema = z.object({
  title: z.string().trim().min(1, "Enter a title"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter a slug")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  species: z.union([z.enum(PET_SPECIES), z.literal("")]).optional(),
  summary: z.string().trim().max(300, "Keep it under 300 characters").optional(),
  body_md: z.string().trim().min(10, "Write the guide, at least 10 characters"),
  published: z.boolean(),
});

export type GuideFormValues = z.infer<typeof guideSchema>;

export const GUIDE_DEFAULT_VALUES: GuideFormValues = {
  title: "",
  slug: "",
  species: "",
  summary: "",
  body_md: "",
  published: false,
};
