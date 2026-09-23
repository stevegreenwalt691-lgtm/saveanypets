import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { ApplicationFormValues } from "@/lib/validation/application";
import type { MeetSlotDayGroup } from "@/lib/meet-slots";

interface StepMeetGreetProps {
  register: UseFormRegister<ApplicationFormValues>;
  errors: FieldErrors<ApplicationFormValues>;
  groups: MeetSlotDayGroup[];
  selectedSlotId: string;
}

export function StepMeetGreet({ register, errors, groups, selectedSlotId }: StepMeetGreetProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl">Meet and greet</h2>
        <p className="mt-1 text-sm text-ink-2">Choose a time to meet in person before anything is final.</p>
      </div>

      {groups.length === 0 ? (
        <p className="rounded-[16px] bg-white/65 p-4 text-sm text-ink-2">
          There are no open times right now. Please check back soon or contact us directly.
        </p>
      ) : (
        <fieldset className="flex flex-col gap-5">
          <legend className="sr-only">Meet and greet time</legend>
          {groups.map((group) => (
            <div key={group.dayKey}>
              <p className="text-sm font-bold text-ink-3">{group.dayLabel}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.slots.map((slot) => {
                  const checked = selectedSlotId === slot.id;
                  return (
                    <label
                      key={slot.id}
                      className={cn(
                        "cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition-colors",
                        checked ? "bg-ink text-white" : "glass text-ink hover:bg-white/70",
                      )}
                    >
                      <input
                        type="radio"
                        value={slot.id}
                        className="sr-only"
                        {...register("slot_id")}
                      />
                      {slot.timeLabel}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </fieldset>
      )}

      {errors.slot_id ? <p className="text-sm text-danger">{errors.slot_id.message}</p> : null}
    </div>
  );
}
