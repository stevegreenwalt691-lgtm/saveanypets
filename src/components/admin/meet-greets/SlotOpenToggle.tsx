"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { setMeetSlotOpen } from "@/lib/actions/meet-slots-admin";

interface SlotOpenToggleProps {
  slotId: string;
  isOpen: boolean;
}

export function SlotOpenToggle({ slotId, isOpen }: SlotOpenToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await setMeetSlotOpen(slotId, !isOpen);
      if (result.ok) router.refresh();
    });
  }

  return (
    <Button type="button" variant="outline" pill={false} disabled={isPending} onClick={handleClick}>
      {isOpen ? "Close slot" : "Open slot"}
    </Button>
  );
}
