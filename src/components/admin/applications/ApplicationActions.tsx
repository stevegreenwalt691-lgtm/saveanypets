"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  markInReview,
  approveApplication,
  declineApplication,
  completeApplication,
} from "@/lib/actions/applications-admin";
import type { Database } from "@/lib/supabase/database.types";

type ApplicationStatus = Database["public"]["Enums"]["application_status"];

interface ApplicationActionsProps {
  applicationId: string;
  status: ApplicationStatus;
}

export function ApplicationActions({ applicationId, status }: ApplicationActionsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<{ ok: boolean; error?: string }>, confirmMessage?: string) {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      router.refresh();
    });
  }

  const canMarkInReview = status === "new";
  const canApprove = status === "new" || status === "in_review";
  const canDecline = status === "new" || status === "in_review";
  const canComplete = status === "approved";

  if (!canMarkInReview && !canApprove && !canDecline && !canComplete) {
    return <p className="text-sm text-ink-2">No further actions for this application.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {canMarkInReview ? (
          <Button
            type="button"
            variant="outline"
            pill={false}
            disabled={isPending}
            onClick={() => run(() => markInReview(applicationId))}
          >
            Mark in review
          </Button>
        ) : null}
        {canApprove ? (
          <Button type="button" pill={false} disabled={isPending} onClick={() => run(() => approveApplication(applicationId))}>
            Approve
          </Button>
        ) : null}
        {canDecline ? (
          <Button
            type="button"
            variant="outline"
            pill={false}
            disabled={isPending}
            onClick={() =>
              run(
                () => declineApplication(applicationId),
                "Decline this application? An email will be sent to the applicant.",
              )
            }
          >
            Decline
          </Button>
        ) : null}
        {canComplete ? (
          <Button
            type="button"
            pill={false}
            disabled={isPending}
            onClick={() =>
              run(
                () => completeApplication(applicationId),
                "Mark this adoption as completed? An email will be sent to the applicant.",
              )
            }
          >
            Mark completed
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
