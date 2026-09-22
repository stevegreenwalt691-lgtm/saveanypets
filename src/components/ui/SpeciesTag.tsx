import { SPECIES, type Species } from "@/lib/species";
import { cn } from "@/lib/utils";

interface SpeciesTagProps {
  species: Species;
  /** Use the white translucent background for tags placed over a photo. */
  onPhoto?: boolean;
  className?: string;
}

export function SpeciesTag({ species, onPhoto, className }: SpeciesTagProps) {
  const info = SPECIES[species];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[13px] font-bold",
        info.color,
        onPhoto ? "bg-white/80" : info.tint,
        className,
      )}
    >
      {info.label}
    </span>
  );
}
