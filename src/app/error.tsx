"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-cream px-4 text-center">
      <h1 className="font-display text-3xl font-bold text-ink">Something went wrong</h1>
      <p className="max-w-md text-ink-2">
        We could not load this page. Please try again, or come back in a moment.
      </p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-[22px] py-3 text-[15px] font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        <RefreshCw className="h-4 w-4" strokeWidth={2} />
        Try again
      </button>
    </div>
  );
}
