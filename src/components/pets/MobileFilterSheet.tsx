"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MobileFilterSheetProps {
  children: ReactNode;
  activeCount: number;
}

export function MobileFilterSheet({ children, activeCount }: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button variant="outline" pill={false} onClick={() => setOpen(true)}>
        <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />
        Filters{activeCount > 0 ? ` (${activeCount})` : ""}
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div className="glass-strong relative max-h-[85vh] overflow-y-auto rounded-t-[28px] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl">Filters</h2>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/60"
              >
                <X className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}
