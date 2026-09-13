"use client";

import { IconAlertTriangleFilled, IconCheck, IconCircleCheckFilled, IconCopy, IconStarFilled } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import type { MessageTag } from "@/lib/jojo/contract";
import { cn } from "@/lib/utils";

/**
 * Chat bubbles as the product renders them: Jojo groups get an avatar row, then
 * `bg-muted px-4 py-3 text-[15px]` bubbles whose corners tighten between
 * consecutive bubbles; the student is `bg-accent-purple` at max 75%; a copy
 * button appears on hover; tags are soft pills under the student turn and the
 * flagged span is underlined in the warning colour.
 */

function groupRadius(i: number, n: number, side: "start" | "end") {
  const first = i === 0;
  const last = i === n - 1;
  if (side === "start") {
    return cn(first ? "rounded-tl-2xl" : "rounded-tl-md", "rounded-tr-2xl rounded-br-2xl", last ? "rounded-bl-2xl" : "rounded-bl-md");
  }
  return cn(first ? "rounded-tr-2xl" : "rounded-tr-md", "rounded-tl-2xl rounded-bl-2xl", last ? "rounded-br-2xl" : "rounded-br-md");
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="absolute top-1/2 -right-10 flex -translate-y-1/2 flex-col gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
      <button
        type="button"
        aria-label={done ? "Copied" : "Copy message"}
        onClick={() => {
          void navigator.clipboard?.writeText(text);
          setDone(true);
          window.setTimeout(() => setDone(false), 1200);
        }}
        className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
      >
        {done ? <IconCheck className="size-4" /> : <IconCopy className="size-4" />}
      </button>
    </div>
  );
}

export function JojoGroup({ bubbles, className, animate, streaming }: { bubbles: string[]; className?: string; animate?: boolean; streaming?: boolean }) {
  return (
    <div className={cn("flex w-full flex-col items-start", className)} aria-live={streaming ? "polite" : undefined}>
      <div className="mt-4 mb-1.5 flex w-full items-center gap-3 px-2">
        <Image src="/jojo/baby-jojo-icon.svg" alt="Baby Jojo" width={32} height={32} className="size-8 flex-none rounded-xl object-cover" />
        <span className="font-medium">Baby Jojo</span>
      </div>
      {bubbles.map((b, i) => (
        <div key={i} className={cn("max-w-[75%] px-2", i > 0 && "mt-1", animate && "animate-bubble-in")} style={animate ? { animationDelay: `${i * 140}ms` } : undefined}>
          <div className="group relative inline-block min-w-0 max-w-full text-left">
            <div className={cn("bg-muted px-4 py-3 text-[15px] leading-relaxed text-foreground whitespace-pre-wrap break-words [overflow-wrap:anywhere]", groupRadius(i, bubbles.length, "start"))}>
              {b}
              {streaming && i === bubbles.length - 1 ? <span aria-hidden className="ml-1 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse rounded-sm bg-muted-foreground/60" /> : null}
            </div>
            {!streaming ? <CopyButton text={b} /> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Splits the student's text so that each quoted span (the tag's `quotes`, verbatim
 * evidence the grader cited) can be underlined on its own, as the product does.
 * Matching is case-insensitive; a flagged turn with no matching quote underlines the whole message.
 */
export function highlightQuotes(text: string, quotes: string[]): { text: string; hit: boolean }[] {
  const wanted = quotes.map((q) => q.trim()).filter((q) => q.length > 0);
  if (wanted.length === 0) return [{ text, hit: false }];
  const lower = text.toLowerCase();
  const spans: [number, number][] = [];
  for (const q of wanted) {
    let from = 0;
    const ql = q.toLowerCase();
    for (;;) {
      const at = lower.indexOf(ql, from);
      if (at < 0) break;
      spans.push([at, at + q.length]);
      from = at + q.length;
    }
  }
  if (spans.length === 0) return [{ text, hit: false }];
  spans.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const s of spans) {
    const last = merged.at(-1);
    if (last && s[0] <= last[1]) last[1] = Math.max(last[1], s[1]);
    else merged.push([...s]);
  }
  const out: { text: string; hit: boolean }[] = [];
  let cursor = 0;
  for (const [a, b] of merged) {
    if (a > cursor) out.push({ text: text.slice(cursor, a), hit: false });
    out.push({ text: text.slice(a, b), hit: true });
    cursor = b;
  }
  if (cursor < text.length) out.push({ text: text.slice(cursor), hit: false });
  return out;
}

export function StudentBubble({ children, animate, flagged, reason, quotes }: { children: string; animate?: boolean; flagged?: boolean; reason?: string; quotes?: string[] }) {
  const parts = flagged ? highlightQuotes(children, quotes ?? []) : [{ text: children, hit: false }];
  const anyHit = parts.some((p) => p.hit);
  return (
    <div className={cn("flex w-full flex-col items-end gap-1.5", animate && "animate-bubble-in")}>
      <div className="group relative max-w-[75%] rounded-2xl bg-accent-purple px-4 py-3 text-[15px] leading-relaxed text-accent-purple-foreground">
        <p className="m-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
          {flagged
            ? parts.map((p, i) =>
                p.hit || !anyHit ? (
                  <mark key={i} className="bg-transparent text-inherit underline decoration-2 decoration-warning underline-offset-4" title={reason}>
                    {p.text}
                  </mark>
                ) : (
                  <span key={i}>{p.text}</span>
                ),
              )
            : children}
        </p>
        <CopyButton text={children} />
      </div>
    </div>
  );
}

const TAG: Record<MessageTag, { label: string; className: string; icon: React.ReactNode }> = {
  // The product draws Great as a blue star pill (accent-primary), Good as a green check.
  great: { label: "Great", className: "bg-accent-primary text-accent-primary-foreground", icon: <IconStarFilled className="size-4" /> },
  good: { label: "Good", className: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400", icon: <IconCircleCheckFilled className="size-4" /> },
  inaccurate: { label: "Inaccurate", className: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400", icon: <IconAlertTriangleFilled className="size-4 text-amber-500" /> },
  mistake: { label: "Mistake", className: "bg-red-500/10 text-red-700 dark:bg-red-500/15 dark:text-red-400", icon: <IconAlertTriangleFilled className="size-4 text-red-500" /> },
};

/** Tag pill under a student turn. Click or focus to read the reason (a tooltip in the product; here a disclosure so it works on touch and keyboard). */
export function TagPill({ tag, reason, animate }: { tag: MessageTag; reason?: string; animate?: boolean }) {
  const t = TAG[tag];
  const [open, setOpen] = useState(false);
  const has = Boolean(reason?.trim());
  return (
    <div className={cn("flex flex-col items-end gap-1", animate && "animate-bubble-in")} style={animate ? { animationDelay: "160ms" } : undefined}>
      <button
        type="button"
        onClick={() => has && setOpen((o) => !o)}
        aria-expanded={has ? open : undefined}
        aria-label={has ? `${t.label}. ${open ? "Hide" : "Show"} why` : t.label}
        title={has && !open ? reason : undefined}
        className={cn("inline-flex items-center gap-1.5 rounded-2xl px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40", t.className, has ? "cursor-pointer hover:brightness-95" : "cursor-default")}
      >
        {t.icon}
        <span className="text-sm font-medium">{t.label}</span>
      </button>
      {open && has ? <p className="max-w-[75%] animate-fade-in text-right text-sm leading-relaxed text-muted-foreground">{reason}</p> : null}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex w-full flex-col items-start">
      <div className="mt-4 mb-1.5 flex w-full items-center gap-3 px-2">
        <Image src="/jojo/baby-jojo-icon.svg" alt="Baby Jojo" width={32} height={32} className="size-8 flex-none rounded-xl object-cover" />
        <span className="font-medium">Baby Jojo</span>
      </div>
      <div className="px-2">
        <div className="w-fit animate-bubble-in rounded-2xl bg-muted px-4 py-3.5" aria-label="Jojo is typing">
          <div className="flex gap-1.5">
            {[0, 150, 300].map((d) => (
              <span key={d} className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** `h-0.5 bg-muted` rule with a centred caption, as in the transcript. */
export function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="h-0.5 flex-1 bg-muted" />
      <p className="whitespace-nowrap text-xs font-medium text-muted-foreground">{children}</p>
      <div className="h-0.5 flex-1 bg-muted" />
    </div>
  );
}
