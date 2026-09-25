import { z } from "zod";

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export const createMeetSlotsSchema = z
  .object({
    start_date: z.string().min(1, "Choose a start date"),
    end_date: z.string().min(1, "Choose an end date"),
    capacity: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || (!Number.isNaN(Number(value)) && Number(value) >= 1), "Enter a number of 1 or more"),
    times: z.array(z.string().regex(TIME_REGEX, "Use 24 hour HH:MM, for example 10:00")).min(1, "Add at least one time"),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "End date must be on or after the start date",
    path: ["end_date"],
  });

export type CreateMeetSlotsInput = z.infer<typeof createMeetSlotsSchema>;

export const CREATE_MEET_SLOTS_DEFAULT_VALUES: CreateMeetSlotsInput = {
  start_date: "",
  end_date: "",
  capacity: "1",
  times: [],
};

/** Most slots one submission can create, so a typo in the date range cannot flood the table. */
export const MAX_SLOTS_PER_SUBMISSION = 300;
