import * as React from "react";
import { cn } from "@/lib/utils";

const field =
  "w-full border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-accent-primary-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(field, "h-10 rounded-2xl px-3 text-sm", className)} {...props} />;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(field, "min-h-10 rounded-2xl px-3 py-2 text-sm leading-6", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";
