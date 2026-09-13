"use client";

import { IconPlus, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import type { ObjectiveRow, SessionRow } from "@/lib/db/schema";
import { cn, formatRelative } from "@/lib/utils";

export type RailSession = Pick<SessionRow, "id" | "subjectName" | "title" | "status" | "updatedAt"> & { objectives: Pick<ObjectiveRow, "status">[]; firstObjective: string };

/**
 * The past-sessions rail from the product: sticky "New Session", sessions
 * grouped by day, each a `rounded-xl p-3 hover:bg-muted` button. Collapsible.
 */
export function SessionsRail({ sessions, onNewSession }: { sessions: RailSession[]; onNewSession?: () => void }) {
  const params = useParams<{ id?: string }>();
  const [collapsed, setCollapsed] = useState(false);
  const groups = groupByDay(sessions);

  if (collapsed) {
    return (
      <div className="hidden w-10 flex-none items-start pt-3 pl-3 lg:flex">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label="Open Past sessions"
          className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all hover:bg-muted-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-foreground/50"
        >
          <IconPlus className="size-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="hidden h-full flex-none lg:flex">
      <div className="scrollbar-thin flex w-[280px] flex-1 flex-col overflow-y-auto overscroll-none border-r-2 border-subtle bg-background p-3">
        <div className="-top-3 -mt-3 sticky z-10 flex flex-col gap-3 bg-background pt-3">
          {onNewSession ? (
            <button
              type="button"
              onClick={onNewSession}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl bg-accent-primary-foreground px-4 py-2 font-medium text-background transition-all hover:bg-accent-primary-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary-foreground/50"
            >
              <IconPlus className="size-5 opacity-60" /> New Session
            </button>
          ) : (
            <Link
              href="/teach-jojo?start=1"
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl bg-accent-primary-foreground px-4 py-2 font-medium text-background transition-all hover:bg-accent-primary-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary-foreground/50"
            >
              <IconPlus className="size-5 opacity-60" /> New Session
            </Link>
          )}
        </div>
        <div className="mt-3">
          <SessionGroups groups={groups} currentId={params?.id} />
        </div>
      </div>
      <div className="ml-3 flex w-10 flex-none items-start pt-3">
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label="Close Past sessions"
          className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all hover:bg-muted-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-foreground/50"
        >
          <IconX className="size-5" />
        </button>
      </div>
    </div>
  );
}

/**
 * Below `lg` the rail is not rendered, so history would be unreachable. The
 * home page shows the same list inline instead; Back / Go back lead here.
 */
export function MobileSessions({ sessions }: { sessions: RailSession[] }) {
  const groups = groupByDay(sessions);
  if (groups.length === 0) return null;
  return (
    <section aria-labelledby="past-sessions" className="mt-10 text-left lg:hidden">
      <h3 id="past-sessions" className="px-3 text-lg font-medium">
        Past sessions
      </h3>
      <div className="mt-1">
        <SessionGroups groups={groups} />
      </div>
    </section>
  );
}

function SessionGroups({ groups, currentId }: { groups: { label: string; items: RailSession[] }[]; currentId?: string }) {
  return (
    <>
          {groups.length === 0 ? (
            <p className="px-3 pt-3 text-sm text-muted-foreground">No sessions yet. Start one and it will show up here.</p>
          ) : null}
          {groups.map((g) => (
            <div key={g.label}>
              <p className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</p>
              <div className="flex flex-col gap-1">
                {g.items.map((s) => {
                  const current = currentId === s.id;
                  return (
                    <Link
                      key={s.id}
                      href={`/teach-jojo/${s.id}`}
                      className={cn("group relative flex w-full flex-col gap-2 rounded-xl p-3 text-left transition-colors hover:bg-muted", current && "bg-muted")}
                    >
                      <div className="flex items-center gap-2 text-xs">
                        {s.status === "completed" ? (
                          <>
                            <span className="font-medium text-green-600 dark:text-green-400">Completed</span>
                            <span className="text-muted-foreground/60">·</span>
                          </>
                        ) : null}
                        <span className="line-clamp-1 text-muted-foreground">{s.subjectName}</span>
                        <span className="ml-auto shrink-0 text-muted-foreground">{formatRelative(s.updatedAt)}</span>
                      </div>
                      <p className="line-clamp-2 text-sm font-medium leading-snug">{s.firstObjective}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
    </>
  );
}

function groupByDay(sessions: RailSession[]) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
  const buckets: Record<string, RailSession[]> = { Today: [], Yesterday: [], Earlier: [] };
  for (const s of sessions) {
    const d = new Date(s.updatedAt);
    if (d >= startOfToday) buckets.Today.push(s);
    else if (d >= startOfYesterday) buckets.Yesterday.push(s);
    else buckets.Earlier.push(s);
  }
  return Object.entries(buckets)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}
