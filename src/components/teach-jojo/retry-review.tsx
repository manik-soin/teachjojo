"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { endSessionAction } from "@/app/teach-jojo/actions";

/** Retry (or re-check) review generation from the review screen. Surfaces the action's error instead of refreshing silently. */
export function RetryReview({ sessionId, label = "Try again" }: { sessionId: string; label?: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            const res = await endSessionAction(sessionId);
            if ("error" in res) {
              setError(res.error);
              return;
            }
            if (res.outcome === "failed") {
              setError("Jojo could not write the review this time. Try again in a moment.");
              return;
            }
            router.refresh();
          })
        }
        className="mt-4 inline-flex h-9 items-center rounded-full bg-foreground px-3 text-sm font-medium text-background transition-all hover:bg-foreground/80 disabled:opacity-50"
      >
        {pending ? "Working…" : label}
      </button>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
