"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markSignupHandled, markSurrenderHandled } from "@/lib/actions/people-admin";

interface HandledToggleProps {
  id: string;
  handled: boolean;
  kind: "signup" | "surrender";
}

export function HandledToggle({ id, handled, kind }: HandledToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const action = kind === "signup" ? markSignupHandled : markSurrenderHandled;
      const result = await action(id, !handled);
      if (result.ok) router.refresh();
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleClick}
      className="rounded-full px-3 py-1.5 text-xs font-bold text-ink-2 hover:bg-white/80 disabled:opacity-50"
    >
      {handled ? "Mark not handled" : "Mark handled"}
    </button>
  );
}
