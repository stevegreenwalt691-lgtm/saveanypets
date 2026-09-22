import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
  /** Omit the default 28/36px padding so the caller can set its own. */
  noPadding?: boolean;
}

export function GlassCard({ strong, noPadding, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-[28px]",
        !noPadding && "p-7 sm:p-9",
        className,
      )}
      {...props}
    />
  );
}
