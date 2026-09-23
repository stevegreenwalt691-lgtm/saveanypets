import type { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <GlassCard className="flex items-center justify-between">
      <div>
        <p className="text-sm text-ink-3">{label}</p>
        <p className="mt-1 font-display text-4xl font-bold text-ink">{value}</p>
      </div>
      {Icon ? <Icon className="h-8 w-8 shrink-0 text-brand" strokeWidth={1.6} /> : null}
    </GlassCard>
  );
}
