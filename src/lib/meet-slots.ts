export interface OpenMeetSlot {
  id: string;
  starts_at: string;
  capacity: number;
  booked: number;
}

export interface MeetSlotOption {
  id: string;
  startsAt: string;
  timeLabel: string;
}

export interface MeetSlotDayGroup {
  dayKey: string;
  dayLabel: string;
  slots: MeetSlotOption[];
}

const DAY_FORMAT = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});
const TIME_FORMAT = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

/** "Monday, September 29 at 10:00 AM", for confirmation emails and the review step. */
export function formatSlotLabel(startsAt: string): string {
  const date = new Date(startsAt);
  return `${DAY_FORMAT.format(date)} at ${TIME_FORMAT.format(date)}`;
}

/** Groups open slots by calendar day, in order, for the meet and greet picker. */
export function groupSlotsByDay(slots: OpenMeetSlot[]): MeetSlotDayGroup[] {
  const groups = new Map<string, MeetSlotDayGroup>();

  for (const slot of slots) {
    const date = new Date(slot.starts_at);
    const dayKey = date.toISOString().slice(0, 10);
    let group = groups.get(dayKey);
    if (!group) {
      group = { dayKey, dayLabel: DAY_FORMAT.format(date), slots: [] };
      groups.set(dayKey, group);
    }
    group.slots.push({ id: slot.id, startsAt: slot.starts_at, timeLabel: TIME_FORMAT.format(date) });
  }

  return Array.from(groups.values());
}
