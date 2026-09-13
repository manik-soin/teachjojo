"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tab = "transcript" | "help" | "review";

/** The review header: Go back, the segmented Transcript / Ask Jojo Chat control (plus Review below lg), warning count. Keyboard: arrows move between tabs. */
export function TranscriptTabs({ leading, trailing, transcript, help, review, helpCount }: { leading: ReactNode; trailing: ReactNode; transcript: ReactNode; help: ReactNode; review: ReactNode; helpCount: number }) {
  const [tab, setTab] = useState<Tab>("transcript");
  const base = useId();
  const tabs: { key: Tab; label: string; className?: string }[] = [
    { key: "transcript", label: "Transcript" },
    { key: "help", label: `Ask Jojo Chat${helpCount ? ` · ${helpCount}` : ""}` },
    { key: "review", label: "Review", className: "lg:hidden" },
  ];
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const visible = tabs.filter((t) => t.key !== "review" || window.innerWidth < 1024);
    const i = visible.findIndex((t) => t.key === tab);
    const next = visible[(i + (e.key === "ArrowRight" ? 1 : visible.length - 1)) % visible.length];
    setTab(next.key);
    document.getElementById(`${base}-tab-${next.key}`)?.focus();
  };
  return (
    <>
      <div className="sticky top-0 z-10 border-b-2 border-border bg-background px-4 py-3 sm:px-6">
        {/* The tab list never scrolls out of view: at laptop widths where the rail, the review panel and the transcript compete, it wraps under Go back instead. */}
        <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-x-3 gap-y-2">
          {leading}
          <div role="tablist" aria-label="Session views" onKeyDown={onKey} className="flex shrink-0 items-center gap-1 rounded-full bg-muted p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                id={`${base}-tab-${t.key}`}
                role="tab"
                type="button"
                aria-selected={tab === t.key}
                aria-controls={`${base}-panel`}
                tabIndex={tab === t.key ? 0 : -1}
                onClick={() => setTab(t.key)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30",
                  t.className,
                  tab === t.key ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          {trailing}
        </div>
      </div>
      <div id={`${base}-panel`} role="tabpanel" className="flex min-h-0 flex-1 flex-col">
        {tab === "transcript" ? transcript : tab === "help" ? help : <div className="contents lg:hidden">{review}</div>}
        {tab === "review" ? <div className="hidden lg:contents">{transcript}</div> : null}
      </div>
    </>
  );
}
