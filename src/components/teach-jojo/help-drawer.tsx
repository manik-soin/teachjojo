"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { IconArrowUp, IconBulb, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/ui/markdown";
import { helpResponse } from "@/lib/jojo/contract";
import { cn } from "@/lib/utils";
import { JojoMark } from "./jojo-avatar";

export type HelpTurn = { id: string; role: "user" | "assistant"; content: string };

/** The product's canned first request; the chip sends exactly this text. */
export const HINT_PROMPT = "Give me a hint";

/**
 * "Get help from Jojo AI": a centred modal (as in the product), a separate
 * transcript from the main chat, grown-up Jojo replies in markdown under a
 * "Jojo Tutor" label, and a "Give me a hint" chip when nothing has been asked yet.
 */
export function HelpDrawer({
  open,
  onOpenChange,
  sessionId,
  initial,
  returnFocusTo,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  sessionId: string;
  initial: HelpTurn[];
  /** The controlled trigger; Radix has no DialogTrigger to restore focus to. */
  returnFocusTo?: React.RefObject<HTMLElement | null>;
}) {
  const [turns, setTurns] = useState<HelpTurn[]>(initial);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: "end" });
  }, [open, turns, pending]);

  const send = async (raw?: string) => {
    const text = (raw ?? draft).trim();
    if (!text || pending) return;
    const localId = `h-${Date.now()}`;
    setError(null);
    setPending(true);
    setDraft("");
    setTurns((t) => [...t, { id: localId, role: "user", content: text }]);
    try {
      const post = () => fetch("/api/ai/jojo/help", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, message: text }) });
      let r = await post();
      if (r.status === 503) {
        await new Promise((resolve) => window.setTimeout(resolve, 4000));
        r = await post();
      }
      const json = await r.json().catch(() => null);
      if (!r.ok) throw new Error(json?.message ?? "Jojo got confused. Try that again.");
      const res = helpResponse.parse(json);
      setTurns((t) => [...t, { id: `h-${res.orderIndex}`, role: "assistant", content: res.content }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setTurns((t) => t.filter((x) => x.id !== localId));
      if (!raw) setDraft(text);
    } finally {
      setPending(false);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-fade-in" />
        <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-3 sm:p-6">
          <DialogPrimitive.Content
            onCloseAutoFocus={(e) => {
              if (!returnFocusTo?.current) return;
              e.preventDefault();
              returnFocusTo.current.focus();
            }}
            className="pointer-events-auto flex h-[min(820px,calc(100dvh-1.5rem))] w-full max-w-[672px] flex-col overflow-hidden rounded-2xl border-2 border-subtle bg-card focus:outline-none data-[state=open]:animate-dialog-in sm:h-[min(820px,calc(100dvh-3rem))]"
          >
            <header className="flex items-center justify-between gap-3 border-b-2 border-subtle px-4 py-3">
              <DialogPrimitive.Title className="text-[15px] font-medium">Get help from Jojo AI</DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">A nudge from Jojo, not the answer. This conversation stays out of the main transcript.</DialogPrimitive.Description>
              <DialogPrimitive.Close aria-label="Close" className="inline-flex h-8 w-8 items-center justify-center rounded-2xl text-muted-foreground transition-all hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50">
                <IconX className="size-5" />
              </DialogPrimitive.Close>
            </header>

            <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-4">
              {turns.length === 0 ? (
                <div className="flex flex-col items-center gap-3 pt-2 pb-6 text-center">
                  <Image src="/jojo/jojo-and-baby-jojo.svg" alt="" width={196} height={140} className="h-auto w-[170px]" />
                  <p className="text-[17px] font-medium">Need help teaching Baby Jojo?</p>
                  <p className="-mt-2 text-sm text-muted-foreground">He can be a little annoying sometimes, I get it...</p>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => void send(HINT_PROMPT)}
                    className="mt-2 inline-flex items-center gap-2 rounded-full border-2 border-accent-fuchsia-foreground/30 px-4 py-2 text-[15px] font-medium text-accent-fuchsia-foreground transition-colors hover:bg-accent-fuchsia focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fuchsia-foreground/40 disabled:opacity-50"
                  >
                    <IconBulb className="size-5" stroke={2} /> {HINT_PROMPT}
                  </button>
                </div>
              ) : null}
              <div className="flex flex-col gap-4">
                {turns.map((t) => (
                  <HelpMessage key={t.id} turn={t} />
                ))}
                {pending ? (
                  <div className="flex items-center gap-3">
                    <JojoMark className="size-7 text-accent-purple-foreground" />
                    <div className="flex gap-1.5">
                      {[0, 150, 300].map((d) => (
                        <span key={d} className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                ) : null}
                {error ? (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                ) : null}
                <div ref={endRef} />
              </div>
            </div>

            <form
              className="p-3"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <div className="flex flex-col overflow-hidden rounded-2xl bg-muted">
                <textarea
                  rows={1}
                  value={draft}
                  disabled={pending}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  placeholder="Ask Jojo for help..."
                  aria-label="Ask Jojo for help"
                  className="max-h-40 min-h-[24px] w-full resize-none bg-transparent px-5 py-4 text-[15px] text-foreground outline-none placeholder:text-muted-foreground field-sizing-content"
                />
                <div className="flex justify-end px-2 pb-2">
                  <button
                    type="submit"
                    aria-label="Send help request"
                    disabled={!draft.trim() || pending}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-all hover:bg-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary-foreground/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <IconArrowUp className="size-5" stroke={2.2} />
                  </button>
                </div>
              </div>
            </form>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** One help exchange as the product renders it: the student in a light-blue bubble, grown-up Jojo as "Jojo Tutor" with markdown. */
export function HelpMessage({ turn }: { turn: Pick<HelpTurn, "role" | "content"> }) {
  if (turn.role === "user") {
    return (
      <div className="flex w-full justify-end">
        <p className="max-w-[80%] whitespace-pre-wrap rounded-2xl bg-accent-primary px-4 py-2.5 text-[15px] leading-relaxed text-accent-primary-foreground break-words [overflow-wrap:anywhere]">{turn.content}</p>
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2.5">
        <JojoMark className="size-8 text-accent-purple-foreground" />
        <span className="font-medium">Jojo Tutor</span>
      </div>
      <Markdown text={turn.content} className={cn("pl-0")} />
    </div>
  );
}
