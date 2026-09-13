import { IconAlertCircleFilled, IconLoader2 } from "@tabler/icons-react";
import type { Objective, ObjectiveStatus } from "@/lib/jojo/contract";
import { STATUS_LABEL } from "@/lib/jojo/objectives";
import { cn } from "@/lib/utils";

/** Status glyphs exactly as the product's "All Learning Objectives" and "Session Complete" dialogs draw them. */
export function StatusGlyph({ status, className }: { status: ObjectiveStatus; className?: string }) {
  if (status === "needs_review") return <IconAlertCircleFilled className={cn("size-[18px] shrink-0 text-red-500", className)} />;
  // The product marks the objective Jojo is on with an amber loader ring.
  if (status === "in_progress") return <IconLoader2 className={cn("size-[16px] shrink-0 text-amber-500", className)} stroke={2.5} />;
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-[14px] shrink-0 rounded-full border-2",
        status === "completed" && "border-emerald-500 bg-emerald-500",
        status === "not_started" && "border-border bg-transparent",
        className,
      )}
    />
  );
}

const LABEL_COLOR: Record<ObjectiveStatus, string> = {
  completed: "text-[#16a34a]",
  in_progress: "text-amber-500",
  needs_review: "text-[#f97316]",
  not_started: "text-muted-foreground",
};

/** Rows with label above text, as in the objectives dialog. */
export function ObjectiveRows({ objectives, showTopic }: { objectives: Objective[]; showTopic?: boolean }) {
  return (
    <ul className="space-y-6">
      {objectives.map((o) => (
        <li key={o.id} className="grid grid-cols-[18px_1fr] gap-x-3">
          <StatusGlyph status={o.status} className="mt-1 justify-self-center" />
          <p className={cn("text-[15px]", LABEL_COLOR[o.status])}>{STATUS_LABEL[o.status]}</p>
          <p className="col-start-2 mt-1.5 text-[15px] leading-6 text-foreground">{o.text}</p>
          {showTopic && o.topicLabel ? <p className="col-start-2 mt-1 text-sm text-muted-foreground">{o.topicLabel}</p> : null}
        </li>
      ))}
    </ul>
  );
}

/** Compact rows with the status label beneath, as in the Session Complete dialog and end-of-transcript list. */
export function ObjectiveSummary({ objectives, className }: { objectives: Objective[]; className?: string }) {
  return (
    <ul className={cn("space-y-4", className)}>
      {objectives.map((o) => (
        <li key={o.id} className="grid grid-cols-[18px_1fr] gap-x-3">
          <StatusGlyph status={o.status} className="mt-1 justify-self-center" />
          <p className="text-[15px] leading-6 text-foreground">{o.text}</p>
          {o.status !== "completed" ? <p className={cn("col-start-2 text-sm", LABEL_COLOR[o.status])}>{STATUS_LABEL[o.status]}</p> : null}
        </li>
      ))}
    </ul>
  );
}
