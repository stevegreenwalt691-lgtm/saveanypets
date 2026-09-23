import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

interface LegalPageLayoutProps {
  title: string;
  intro: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, intro, children }: LegalPageLayoutProps) {
  return (
    <main className="mx-auto w-full max-w-[760px] px-4 py-16 sm:px-14">
      <h1 className="text-[34px] sm:text-[44px]">{title}</h1>
      <p className="mt-3 text-ink-2">{intro}</p>

      <div className="mt-6 rounded-[16px] bg-warning/10 px-5 py-4 text-sm font-bold text-warning">
        This is a general template. The client must review every [PLACEHOLDER] section and confirm
        the whole page with their own advice before launch.
      </div>

      <GlassCard className="mt-8 flex flex-col gap-6">{children}</GlassCard>
    </main>
  );
}
