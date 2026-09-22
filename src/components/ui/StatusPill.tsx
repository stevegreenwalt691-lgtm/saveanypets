import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  new: "bg-brand-tint text-brand",
  in_review: "bg-cat-tint text-cat",
  approved: "bg-dragon-tint text-dragon",
  declined: "bg-neutral-tint text-ink-2",
} as const;

const STATUS_LABELS: Record<StatusPillStatus, string> = {
  new: "New",
  in_review: "In review",
  approved: "Approved",
  declined: "Declined",
};

export type StatusPillStatus = keyof typeof STATUS_STYLES;

interface StatusPillProps {
  status: StatusPillStatus;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
