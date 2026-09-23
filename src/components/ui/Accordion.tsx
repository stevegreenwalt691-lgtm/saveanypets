"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItemData[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col divide-y divide-ink/10">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `accordion-panel-${index}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-bold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                {item.question}
                <ChevronDown
                  aria-hidden
                  className={cn("h-5 w-5 shrink-0 text-ink-3 transition-transform", open && "rotate-180")}
                  strokeWidth={1.8}
                />
              </button>
            </h3>
            <div id={panelId} hidden={!open} className="pb-5 text-sm leading-relaxed text-ink-2">
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
