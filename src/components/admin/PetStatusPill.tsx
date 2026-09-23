import { cn } from "@/lib/utils";
import { formatPetStatus } from "@/lib/pets";
import type { Database } from "@/lib/supabase/database.types";

type PetStatus = Database["public"]["Enums"]["pet_status"];

const STATUS_STYLES: Record<PetStatus, string> = {
  draft: "bg-neutral-tint text-ink-2",
  available: "bg-dragon-tint text-dragon",
  pending: "bg-warning/15 text-warning",
  adopted: "bg-cat-tint text-cat",
  on_hold: "bg-brand-tint text-brand",
};

interface PetStatusPillProps {
  status: PetStatus;
  className?: string;
}

export function PetStatusPill({ status, className }: PetStatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
        STATUS_STYLES[status],
        className,
      )}
    >
      {formatPetStatus(status)}
    </span>
  );
}
