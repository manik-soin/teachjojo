"use client";

import { IconArrowUp, IconChevronLeft, IconClockHour4, IconLanguage, IconMicrophone, IconPlus, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { endSessionAction } from "@/app/teach-jojo/actions";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { NotInBuild } from "@/components/ui/not-in-build";
import type { Confidence, JojoTurnResponse, MessageTag, Objective } from "@/lib/jojo/contract";
import { jojoTurnResponse } from "@/lib/jojo/contract";
import { completedCount, currentObjective } from "@/lib/jojo/objectives";
import { JojoGroup, StudentBubble, TagPill, TypingIndicator } from "./bubbles";
import { HelpDrawer, type HelpTurn } from "./help-drawer";
import { ObjectiveRows, ObjectiveSummary, StatusGlyph } from "./objective-list";
import { SessionsRail, type RailSession } from "./sessions-rail";

export type ChatTurn = {
  id: string;
  turnIndex: number;
  role: "user" | "assistant";
  bubbles: string[];
  tag?: { value: MessageTag; reason: string; quotes?: string[] } | null;
  streaming?: boolean;
  settled?: boolean;
};

export type SessionChatProps = {
  sessionId: string;
  subjectName: string;
  objectives: Objective[];
  initialTurns: ChatTurn[];
  initialHelp: HelpTurn[];
  turnsUsed: number;
  maxTurns: number;
  confidence: Confidence;
  status: "started" | "pending_completion" | "completed";
  startedAt: string;
  completedAt: string | null;
  demo: boolean;
  rail: RailSession[];
};

/** Mirrors the server contract (`jojoTurnInput.message.max`). */
const MAX_MESSAGE_CHARS = 4000;

type Live = Pick<SessionChatProps, "objectives" | "turnsUsed" | "maxTurns" | "confidence" | "status">;

/** The product's progress pill counts every objective the student has started on, not only the completed ones. */
export function startedCount(objectives: Objective[]): number {
  return objectives.filter((o) => o.status !== "not_started").length;
}

export function SessionChat(props: SessionChatProps) {
  const router = useRouter();
  const [turns, setTurns] = useState<ChatTurn[]>(props.initialTurns);
  const [live, setLive] = useState<Live>(props);
  const [draft, setDraft] = useState("");
  /** True from send until the final validated object has landed (or failed). Streaming partials do NOT clear it. */
  const [pending, setPending] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showObjectives, setShowObjectives] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  /** Review generation: idle (session live), ending (review being written), stalled, failed, done. */
  const [complete, setComplete] = useState<"idle" | "ending" | "stalled" | "failed" | "done">(props.status === "started" ? "idle" : props.status === "pending_completion" ? "ending" : "done");
  /** The Session Complete dialog can be dismissed with View Chat while the review is still generating. */
  const [showComplete, setShowComplete] = useState(props.status !== "started");
  const [celebrate, setCelebrate] = useState<string | null>(null);
  const recoverRef = useRef(props.status === "pending_completion");
  const requestRef = useRef<{ text: string; id: string } | null>(null);
  const [, startEnd] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const objectivesBtnRef = useRef<HTMLButtonElement>(null);
  const helpBtnRef = useRef<HTMLButtonElement>(null);

  const active = live.status === "started" && complete === "idle";
  const current = useMemo(() => currentObjective(live.objectives), [live.objectives]);
  const done = completedCount(live.objectives);
  const started = startedCount(live.objectives);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: streaming ? "auto" : "smooth", block: "end" });
  }, [turns, pending, streaming]);

  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  /** End Session. While another worker holds the review claim we poll a bounded number of times, then offer a retry. */
  const endSession = useCallback(
    (attempt = 0) => {
      setComplete("ending");
      // Open the dialog when ending starts; a poll retry must not reopen one the student dismissed with View Chat.
      if (attempt === 0) setShowComplete(true);
      startEnd(async () => {
        const res = await endSessionAction(props.sessionId);
        if ("error" in res) {
          setError(res.error);
          setComplete("failed");
          return;
        }
        if (res.outcome === "in_progress") {
          if (attempt >= 20) {
            setComplete("stalled");
            return;
          }
          window.setTimeout(() => endSession(attempt + 1), 3000);
          return;
        }
        if (res.outcome === "failed") {
          setComplete("failed");
          setLive((l) => ({ ...l, status: "completed", objectives: res.objectives }));
          router.refresh();
          return;
        }
        setComplete("done");
        setLive((l) => ({ ...l, status: "completed", objectives: res.objectives }));
        router.refresh();
      });
    },
    [props.sessionId, router],
  );

  useEffect(() => {
    if (recoverRef.current) {
      recoverRef.current = false;
      endSession();
    }
  }, [endSession]);

  // Abort an in-flight send if the component unmounts (navigation mid-stream).
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(async () => {
    const text = draft.trim();
    if (!text || pending || !active) return;
    const controller = new AbortController();
    abortRef.current = controller;
    // The route allows 60 s; a stalled connection must not leave the composer disabled forever.
    const timer = window.setTimeout(() => controller.abort(), 75_000);
    const localId = `local-${Date.now()}`;
    const nextIndex = (turns.at(-1)?.turnIndex ?? -1) + 1;
    const requestId = requestRef.current?.text === text ? requestRef.current.id : crypto.randomUUID();
    requestRef.current = { text, id: requestId };
    setError(null);
    setPending(true);
    setDraft("");
    setTurns((t) => [...t, { id: localId, turnIndex: nextIndex, role: "user", bubbles: [text] }]);

    try {
      const post = () =>
        fetch("/api/ai/jojo", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/x-ndjson" },
          body: JSON.stringify({ sessionId: props.sessionId, message: text, requestId }),
          signal: controller.signal,
        });
      let r = await post();
      // A provider rate limit (503) clears in seconds; retry once quietly with the same request id, which the server treats as the same send.
      if (r.status === 503) {
        await new Promise((resolve) => window.setTimeout(resolve, 4000));
        if (!controller.signal.aborted) r = await post();
      }
      if (!r.ok || !r.body) {
        const json = await r.json().catch(() => null);
        throw new Error(json?.message ?? (r.status === 400 ? `Keep each message under ${MAX_MESSAGE_CHARS} characters.` : "Jojo got confused. Try that again."));
      }
      const draftId = `draft-${Date.now()}`;
      let sawDraft = false;
      let final: JojoTurnResponse | null = null;
      const reader = r.body.getReader();
      controller.signal.addEventListener("abort", () => reader.cancel().catch(() => undefined), { once: true });
      const decoder = new TextDecoder();
      let buffer = "";
      const handle = (line: string) => {
        if (!line.trim()) return;
        const evt = JSON.parse(line) as { type: "partial"; bubbles: string[] } | ({ type: "final" } & JojoTurnResponse) | { type: "error"; message: string };
        if (evt.type === "partial") {
          sawDraft = true;
          setStreaming(true);
          setTurns((t) => [...t.filter((x) => x.id !== draftId), { id: draftId, turnIndex: nextIndex + 1, role: "assistant", bubbles: evt.bubbles, streaming: true }]);
        } else if (evt.type === "final") {
          final = jojoTurnResponse.parse(evt);
        } else {
          throw new Error(evt.message);
        }
      };
      for (;;) {
        const { value, done: eof } = await reader.read();
        if (eof) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        lines.forEach(handle);
      }
      if (buffer.trim()) handle(buffer);
      if (!final) throw new Error("Jojo's reply was cut off. Try that again.");
      const res: JojoTurnResponse = final;
      requestRef.current = null;
      setTurns((t) => [
        ...t.filter((x) => x.id !== draftId).map((x) => (x.id === localId ? { ...x, tag: res.tag } : x)),
        { id: `a-${res.turnIndex}`, turnIndex: res.turnIndex, role: "assistant", bubbles: res.bubbles, settled: sawDraft },
      ]);
      const justDone = res.objectives.find((o, i) => o.status === "completed" && live.objectives[i]?.status !== "completed");
      if (justDone) {
        setCelebrate(justDone.text);
        window.setTimeout(() => setCelebrate(null), 3200);
      }
      setLive({ objectives: res.objectives, turnsUsed: res.turnsUsed, maxTurns: res.maxTurns, confidence: res.confidence, status: res.status });
      if (res.status === "pending_completion") endSession();
    } catch (e) {
      const aborted = controller.signal.aborted;
      setError(aborted ? "Jojo took too long to reply. Try that again." : e instanceof Error ? e.message : "Something went wrong.");
      setTurns((t) => t.filter((x) => x.id !== localId && !x.id.startsWith("draft-")));
      setDraft(text);
    } finally {
      window.clearTimeout(timer);
      if (abortRef.current === controller) abortRef.current = null;
      setStreaming(false);
      setPending(false);
      // The textarea was disabled while pending, which drops keyboard focus to <body>; give it back.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [active, draft, endSession, live.objectives, pending, props.sessionId, turns]);

  const reviewHref = `/teach-jojo/${props.sessionId}/review`;

  return (
    <div className="flex h-full min-h-0 w-full">
      <SessionsRail sessions={props.rail} />

      <div className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* Progress header, sticky, as in the product. Once the session has ended it reads "Session completed" with the review button. */}
        <div className="sticky top-3 z-10 mx-auto mt-3 w-full max-w-3xl px-3">
          <div className="overflow-hidden rounded-xl border-2 border-border bg-background">
            <div className="flex items-center justify-between gap-2 p-2">
              <Link
                href="/teach-jojo"
                className="inline-flex w-fit shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground transition-all hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
              >
                <IconChevronLeft className="size-4" /> Back
              </Link>
              {active ? (
                <>
                  <p className="min-w-0 flex-1 pl-2 text-center text-sm font-medium text-muted-foreground">
                    Progress {started}/{live.objectives.length} ·{" "}
                    <button
                      ref={objectivesBtnRef}
                      type="button"
                      onClick={() => setShowObjectives(true)}
                      className="rounded underline decoration-dotted underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
                    >
                      View learning objectives
                    </button>
                  </p>
                  <button
                    type="button"
                    onClick={() => setConfirmEnd(true)}
                    disabled={pending}
                    title={pending ? "Wait for Jojo to finish replying" : undefined}
                    className="inline-flex w-fit shrink-0 cursor-pointer items-center rounded-lg px-3 py-1 text-sm font-medium text-red-600 transition-all hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-600/20"
                  >
                    End Session
                  </button>
                </>
              ) : (
                <>
                  <p className="min-w-0 flex-1 pl-2 text-sm font-medium text-muted-foreground">{complete === "ending" ? "Wrapping up your session" : "Session completed"}</p>
                  {complete === "done" || complete === "failed" ? (
                    <Link
                      href={reviewHref}
                      className="inline-flex w-fit shrink-0 items-center rounded-full bg-accent-purple-foreground px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-accent-purple-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple-foreground/50 dark:bg-[#7c3aed] dark:hover:bg-[#6d31d9]"
                    >
                      View Session Review
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowComplete(true)}
                      className="inline-flex w-fit shrink-0 items-center rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-foreground/50"
                    >
                      Generating review…
                    </button>
                  )}
                </>
              )}
            </div>
            {active && current ? (
              <div className="p-1.5 pt-0">
                <div className="rounded-lg bg-muted p-1 pr-2">
                  <div className="mt-0.5 flex items-start gap-2 p-1 text-sm font-medium text-pretty text-foreground">
                    <StatusGlyph status={current.status} className="mt-0.5 size-4" />
                    <span className="min-w-0 flex-1">{current.text}</span>
                    {props.demo ? (
                      <span className="shrink-0 rounded bg-amber-500/10 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400" title="No model credentials are configured, so a deterministic stand-in is answering. Assessments are illustrative.">
                        Demo model
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col pt-3">
          <div className="flex min-h-0 flex-1 overflow-hidden px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="mx-auto flex h-full w-full max-w-2xl flex-col">
              <div role="log" aria-relevant="additions" className="scrollbar-thin relative flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto overscroll-contain px-2 py-4 pb-8">
                {turns.map((t, i) =>
                  t.role === "assistant" ? (
                    <JojoGroup key={t.id} bubbles={t.bubbles} animate={i >= props.initialTurns.length && !t.settled} streaming={t.streaming} />
                  ) : (
                    <div key={t.id} className="mt-3 flex w-full flex-col items-end gap-1.5">
                      <StudentBubble animate={i >= props.initialTurns.length} flagged={t.tag?.value === "inaccurate" || t.tag?.value === "mistake"} reason={t.tag?.reason} quotes={t.tag?.quotes}>
                        {t.bubbles[0]}
                      </StudentBubble>
                      {t.tag ? <TagPill tag={t.tag.value} reason={t.tag.reason} animate={i >= props.initialTurns.length} /> : null}
                    </div>
                  ),
                )}
                {pending && !streaming ? <TypingIndicator /> : null}
                {error ? (
                  <p role="alert" className="mx-auto mt-2 rounded-2xl bg-destructive-muted px-3 py-1.5 text-sm text-destructive-muted-foreground">
                    {error}
                  </p>
                ) : null}
                <div ref={endRef} />
              </div>

              {/* Composer, as in the product: muted rounded-2xl, tools row, black round send. It disappears once the session has ended. */}
              {active ? (
                <div className="relative pt-0.5">
                  <form
                    className="group relative flex flex-col overflow-hidden rounded-2xl bg-muted transition-opacity"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void send();
                    }}
                  >
                    <textarea
                      ref={inputRef}
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
                      placeholder="Teach Baby Jojo..."
                      aria-label="Teach Baby Jojo"
                      maxLength={MAX_MESSAGE_CHARS}
                      className="max-h-[200px] min-h-[24px] w-full resize-none bg-transparent px-5 py-4 text-[15px] text-foreground outline-none placeholder:text-black/30 field-sizing-content disabled:cursor-not-allowed dark:placeholder:text-white/50"
                    />
                    <div className="mt-0 flex justify-between px-2 pb-2">
                      <div className="flex gap-0">
                        <NotInBuild label="Attach a file · not part of this build">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-all group-hover/nib:bg-foreground/10 group-hover/nib:text-foreground">
                            <IconPlus className="size-5" />
                          </span>
                        </NotInBuild>
                        <NotInBuild label="Focus timer · not part of this build">
                          <span className="inline-flex size-10 items-center justify-center rounded-2xl text-muted-foreground transition-all group-hover/nib:bg-foreground/10 group-hover/nib:text-foreground">
                            <IconClockHour4 className="size-5" />
                          </span>
                        </NotInBuild>
                        <button
                          ref={helpBtnRef}
                          type="button"
                          onClick={() => setShowHelp(true)}
                          aria-label="Ask for help"
                          className="inline-flex h-auto w-fit cursor-pointer items-center gap-2 rounded-2xl py-2 pr-3 pl-2 font-medium text-muted-foreground transition-all hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
                        >
                          <Image src="/jojo/revisiondojo-favicon.svg" alt="" width={20} height={20} className="pointer-events-none size-5 select-none rounded-lg object-cover opacity-60" />
                          <span className="hidden sm:inline">Ask for help</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <NotInBuild label="Language: Auto · not part of this build" side="top-end" className="hidden sm:inline-flex">
                          <span className="relative flex size-10 items-center justify-center rounded-2xl bg-muted text-muted-foreground transition-colors group-hover/nib:bg-border">
                            <IconLanguage className="size-5" />
                          </span>
                        </NotInBuild>
                        <NotInBuild label="Voice · not part of this build" side="top-end">
                          <span className="inline-flex size-10 items-center justify-center rounded-2xl text-muted-foreground transition-all group-hover/nib:bg-foreground/10 group-hover/nib:text-foreground">
                            <IconMicrophone className="size-5" />
                          </span>
                        </NotInBuild>
                        <button
                          type="submit"
                          aria-label="Send"
                          disabled={!draft.trim() || pending}
                          className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-foreground text-background transition-all hover:bg-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary-foreground/50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <IconArrowUp className="size-5" stroke={2.2} />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {active ? <PetTimer subjectName={props.subjectName} /> : null}

        {celebrate ? (
          <div role="status" className="pointer-events-none absolute inset-x-0 top-28 z-20 flex justify-center px-4">
            <div className="flex max-w-[520px] animate-fade-up items-center gap-2 rounded-2xl bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
              <span className="truncate">
                Objective complete · <span className="font-medium">{celebrate}</span>
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <Dialog open={showObjectives} onOpenChange={setShowObjectives}>
        <DialogContent
          className="max-w-[640px]"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            objectivesBtnRef.current?.focus();
          }}
        >
          <DialogTitle className="h4 font-title">All Learning Objectives</DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">
            {done}/{live.objectives.length} completed
          </DialogDescription>
          <div className="mt-5">
            <ObjectiveRows objectives={live.objectives} showTopic />
          </div>
        </DialogContent>
      </Dialog>

      <HelpDrawer open={showHelp} onOpenChange={setShowHelp} sessionId={props.sessionId} initial={props.initialHelp} returnFocusTo={helpBtnRef} />

      {/* "Are you sure?" before ending, as in the product. */}
      <Dialog open={confirmEnd} onOpenChange={setConfirmEnd}>
        <DialogContent hideClose className="max-w-[380px] p-6 sm:p-6">
          <DialogTitle className="text-xl font-semibold">Are you sure?</DialogTitle>
          <DialogDescription className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            This will end your current conversation session. You can still review the conversation afterwards but won&apos;t be able to send new messages.
          </DialogDescription>
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmEnd(false)}
              className="inline-flex h-10 items-center justify-center rounded-full bg-muted px-4 text-[15px] font-medium text-foreground transition-colors hover:bg-muted-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-foreground/50"
            >
              Cancel
            </button>
            <button
              type="button"
              autoFocus
              onClick={() => {
                setConfirmEnd(false);
                endSession();
              }}
              className="inline-flex h-10 items-center justify-center rounded-full bg-accent-primary-foreground px-4 text-[15px] font-medium text-white transition-colors hover:bg-accent-primary-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary-foreground/50"
            >
              End Session
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Session Complete opens the moment the session ends; the review button waits for the review, View Chat does not. */}
      <Dialog open={complete !== "idle" && showComplete} onOpenChange={(o) => (o ? setShowComplete(true) : setShowComplete(false))}>
        <DialogContent hideClose className="max-w-[440px] p-6 text-center sm:p-6">
          <Image src="/jojo/jojo-and-baby-jojo.svg" alt="" width={196} height={140} className="mx-auto h-auto w-[160px]" />
          <DialogTitle className="h4 mt-4 font-title">Session Complete</DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">
            {done}/{live.objectives.length} objectives completed
          </DialogDescription>
          <div className="mt-5 text-left">
            <ObjectiveSummary objectives={live.objectives} />
          </div>
          <div className="mt-6 flex flex-col gap-2">
            {complete === "done" ? (
              <Link
                href={reviewHref}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-accent-purple-foreground text-base font-medium text-white transition-all hover:bg-accent-purple-foreground/90 dark:bg-[#7c3aed] dark:hover:bg-[#6d31d9]"
              >
                View Session Review
              </Link>
            ) : complete === "ending" ? (
              <p className="inline-flex h-11 items-center justify-center text-sm text-muted-foreground" aria-live="polite">
                Generating session review...
              </p>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground" role="status">
                  {complete === "stalled" ? "The review is taking longer than usual." : "Jojo could not write the review. Your session is saved."}
                </p>
                <button type="button" onClick={() => endSession()} className="inline-flex h-10 items-center justify-center rounded-xl bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/80">
                  Try again
                </button>
              </div>
            )}
            <button type="button" onClick={() => setShowComplete(false)} className="inline-flex h-11 items-center justify-center rounded-xl border-2 border-border text-base font-medium text-foreground transition-colors hover:bg-muted">
              View Chat
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function subscribeToSeconds(onChange: () => void) {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}

/**
 * The product's "pet timer": Baby Jojo floating over the composer with a clock
 * that counts the time spent on this visit (it starts at 0:00 whenever the page
 * opens, not at the session's start), plus a control to hide it.
 */
function PetTimer({ subjectName }: { subjectName: string }) {
  const [hidden, setHidden] = useState(false);
  // When this visit began. The server snapshot below is null, so the server and the hydrating client both render 0:00.
  const [openedAt] = useState(() => Math.floor(Date.now() / 1000) * 1000);
  const now = useSyncExternalStore(subscribeToSeconds, () => Math.floor(Date.now() / 1000) * 1000, () => null);
  const secs = now === null ? 0 : Math.max(0, Math.floor((now - openedAt) / 1000));
  const mm = Math.floor(secs / 60);
  const ss = String(secs % 60).padStart(2, "0");
  if (hidden) return null;
  return (
    <div className="group/pet absolute right-4 bottom-5 z-10 hidden flex-col items-center gap-2 xl:flex">
      <button
        type="button"
        onClick={() => setHidden(true)}
        aria-label="Hide pet timer"
        className="absolute -top-2 -right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover/pet:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
      >
        <IconX className="size-4" />
      </button>
      <Image src="/jojo/baby-jojo.svg" alt="" width={568} height={494} className="pointer-events-none h-auto w-[96px] animate-float" />
      <div className="pointer-events-none rounded-xl border-2 border-border bg-background px-3 py-1.5 text-center">
        <p className="text-base font-semibold tabular-nums" aria-live="off">
          {now === null ? "0:00" : `${mm}:${ss}`}
        </p>
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500" /> {subjectName}
        </p>
      </div>
    </div>
  );
}
