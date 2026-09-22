import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildAdoptHref, type AdoptFilters } from "@/lib/adopt-filters";
import { cn } from "@/lib/utils";

interface PaginationProps {
  filters: AdoptFilters;
  totalPages: number;
}

export function Pagination({ filters, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const page = filters.page;
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-3">
      <Link
        href={buildAdoptHref({ ...filters, page: Math.max(1, page - 1) })}
        aria-disabled={isFirst}
        tabIndex={isFirst ? -1 : undefined}
        className={cn(
          "glass flex h-11 w-11 items-center justify-center rounded-full text-ink",
          isFirst && "pointer-events-none opacity-40",
        )}
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
        <span className="sr-only">Previous page</span>
      </Link>

      <span className="px-3 text-sm font-bold text-ink-2">
        Page {page} of {totalPages}
      </span>

      <Link
        href={buildAdoptHref({ ...filters, page: Math.min(totalPages, page + 1) })}
        aria-disabled={isLast}
        tabIndex={isLast ? -1 : undefined}
        className={cn(
          "glass flex h-11 w-11 items-center justify-center rounded-full text-ink",
          isLast && "pointer-events-none opacity-40",
        )}
      >
        <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
        <span className="sr-only">Next page</span>
      </Link>
    </nav>
  );
}
