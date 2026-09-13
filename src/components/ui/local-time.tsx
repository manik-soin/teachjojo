"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Formats an instant in the viewer's own locale and zone. Renders nothing on the server so hydration cannot mismatch. */
export function LocalTime({ iso, className }: { iso: string; className?: string }) {
  const text = useSyncExternalStore(
    noop,
    () => new Date(iso).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
    () => null,
  );
  return (
    <time dateTime={iso} className={className}>
      {text}
    </time>
  );
}
