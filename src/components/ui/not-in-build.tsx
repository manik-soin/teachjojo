import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps a control that exists in RevisionDojo but is deliberately not part of
 * this build. The child keeps the product's hover treatment so the shell feels
 * alive, but it is inert, not focusable as an action, and explains itself on
 * hover or keyboard focus with the same pill everywhere (CSS only, no runtime).
 */
export function NotInBuild({
  children,
  label = "Not part of this build",
  side = "top",
  className,
  block,
}: {
  children: ReactNode;
  label?: string;
  side?: "top" | "top-end" | "bottom" | "right";
  className?: string;
  /** Render as a block-level wrapper (for full-width rows) instead of inline. */
  block?: boolean;
}) {
  return (
    <span className={cn("group/nib relative", block ? "block" : "inline-flex", "cursor-not-allowed", className)} aria-disabled tabIndex={-1}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 transition-opacity duration-150 group-hover/nib:opacity-100 group-focus-within/nib:opacity-100",
          side === "top" && "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
          side === "top-end" && "right-0 bottom-full mb-1.5",
          side === "bottom" && "top-full left-1/2 mt-1.5 -translate-x-1/2",
          side === "right" && "top-1/2 left-full ml-2 -translate-y-1/2",
        )}
      >
        {label}
      </span>
    </span>
  );
}
