"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { IconX } from "@tabler/icons-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

/**
 * Centered modal over a dimmed page (flat black at 50%, no blur), as the product does for the wizard,
 * objectives and Session Complete. Centering is done by a grid wrapper, not a
 * transform, so it cannot fight the enter animation or mobile viewports.
 */
export function DialogContent({
  className,
  children,
  hideClose,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { hideClose?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-fade-in" />
      <div className="pointer-events-none fixed inset-0 z-50 grid grid-cols-[minmax(0,1fr)] place-items-center p-4">
        <DialogPrimitive.Content
          className={cn(
            "pointer-events-auto relative max-h-[calc(100dvh-2rem)] w-full min-w-0 overflow-x-hidden overflow-y-auto rounded-2xl border-2 border-subtle bg-card p-6 focus:outline-none data-[state=open]:animate-dialog-in sm:p-8",
            className,
          )}
          {...props}
        >
          {children}
          {hideClose ? null : (
            <DialogPrimitive.Close
              aria-label="Close"
              className="absolute top-4 right-4 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-muted-foreground transition-all hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
            >
              <IconX className="size-5" stroke={2} />
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
}
