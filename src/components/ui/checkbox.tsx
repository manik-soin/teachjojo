"use client";

import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function Checkbox({
  checked,
  onCheckedChange,
  disabled,
  className,
  id,
}: {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "peer relative grid size-4 shrink-0 place-items-center rounded-[0.3rem] border-2 border-accent-primary-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-accent-primary-foreground text-background" : "bg-transparent",
        className,
      )}
    >
      {checked ? <IconCheck className="size-3" stroke={3} /> : null}
    </button>
  );
}
