import { z } from "zod";

export const storySchema = z
  .object({
    title: z.string().trim().min(1, "Enter a title"),
    pet_id: z.string().optional(),
    adopter_first_name: z.string().trim().max(80, "Keep it under 80 characters").optional(),
    body: z.string().trim().min(10, "Tell the story, at least 10 characters"),
    consent_given: z.boolean(),
    published: z.boolean(),
  })
  .refine((data) => !data.published || data.consent_given, {
    message: "Get the adopter's consent before publishing",
    path: ["published"],
  });

export type StoryFormValues = z.infer<typeof storySchema>;

export const STORY_DEFAULT_VALUES: StoryFormValues = {
  title: "",
  pet_id: "",
  adopter_first_name: "",
  body: "",
  consent_given: false,
  published: false,
};
