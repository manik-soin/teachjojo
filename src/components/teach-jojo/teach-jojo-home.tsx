"use client";

import { IconHelpCircleFilled } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Subject } from "@/lib/syllabus/data";
import { cn } from "@/lib/utils";
import { NewSessionDialog } from "./new-session-dialog";
import { MobileSessions, SessionsRail, type RailSession } from "./sessions-rail";

const PREVIEW: { who: "jojo" | "you"; text: string }[] = [
  { who: "jojo", text: "How does supply and demand actually work?" },
  { who: "you", text: "When more people want something than what's available, the price rises" },
  { who: "jojo", text: "What happens when there's too much supply?" },
  { who: "you", text: "Sellers drop the price until people buy it all" },
  { who: "jojo", text: "Can you explain photosynthesis to me?" },
  { who: "you", text: "Plants absorb sunlight and use it to convert CO₂ and water into glucose and oxygen" },
  { who: "jojo", text: "Why is chlorophyll so important for that?" },
];

/** The authenticated Teach Jojo home: sessions rail, animated preview over the mascots, "Learn by Teaching", How It Works. */
export function TeachJojoHome({ sessions, subjects, startOpen, preset }: { sessions: RailSession[]; subjects: Subject[]; startOpen: boolean; preset?: { subjectId?: string; topicId?: string } }) {
  const [open, setOpen] = useState(startOpen);
  const [cursor, setCursor] = useState(2);

  useEffect(() => {
    const id = window.setInterval(() => setCursor((c) => (c + 1) % PREVIEW.length), 2600);
    return () => window.clearInterval(id);
  }, []);
  const shown = [PREVIEW[(cursor + PREVIEW.length - 1) % PREVIEW.length], PREVIEW[cursor]];

  return (
    <div className="flex h-full min-h-0 w-full">
      <SessionsRail sessions={sessions} onNewSession={() => setOpen(true)} />
      <div className="scrollbar-thin relative flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="px-4 pt-0 pb-8 sm:px-6">
          <div className="mx-auto isolate w-full max-w-lg text-center">
            <div className="-mb-24">
              <div className="relative mx-auto mb-3 h-[200px] w-full max-w-md" aria-hidden>
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-background via-background/80 to-transparent" />
                <div className="flex h-full flex-col justify-end overflow-hidden px-4 pb-10">
                  <div className="flex flex-col gap-2.5">
                    {shown.map((m, i) => (
                      <div key={`${cursor}-${i}`} className={cn("flex animate-fade-up flex-col", m.who === "you" ? "items-end" : "items-start")}>
                        <span className="mb-1 px-2 text-xs font-medium text-muted-foreground/60">{m.who === "you" ? "You" : "Baby Jojo"}</span>
                        <div
                          className={cn(
                            "w-fit max-w-[65%] rounded-2xl p-2 px-3 text-left text-xs font-medium leading-relaxed text-pretty shadow-lg ring-2",
                            m.who === "you" ? "bg-accent-purple text-accent-purple-foreground ring-accent-purple-foreground/20" : "bg-background text-foreground/80 ring-foreground/5",
                          )}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Image src="/jojo/jojo-and-baby-jojo.svg" alt="Jojo and Baby Jojo" width={196} height={140} priority className="mx-auto w-full max-w-[240px]" />
            <h2 className="h2 mt-6 mb-4 text-pretty font-title">Learn by Teaching</h2>
            <p className="mt-2 text-balance font-medium text-muted-foreground">
              Review a concept by teaching it to Baby Jojo.
              <br />
              Practice learning with the{" "}
              <span className="inline-flex cursor-help items-center gap-0.5 underline decoration-dotted underline-offset-2" title="Explain it simply enough for a six-year-old. Where you stall is where you don't yet understand.">
                Feynman technique
                <IconHelpCircleFilled className="inline size-3.5 shrink-0" />
              </span>
              .
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-lg font-medium text-background ring-offset-background transition-all hover:bg-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
              >
                Start New Session
              </button>
            </div>
            <MobileSessions sessions={sessions} />
          </div>

          <section className="py-20">
            <h2 className="h2 mb-4 text-center font-title">How It Works</h2>
            <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
              <How img="/jojo/cards-study-notes.svg" title="Pick Your Topics" body="Choose up to 5 sub-topics from your syllabus, or describe custom material you want to review." />
              <How img="/jojo/cards-mini-report.svg" title="Track Your Mastery" body="Complete learning objectives one by one and watch your topic coverage grow across sessions." />
              <How img="/jojo/cards-ai-chat.svg" title="Teach Jojo" body="Explain concepts in your own words. Jojo asks follow-up questions to test your understanding." />
            </div>
          </section>
        </div>
      </div>

      <NewSessionDialog subjects={subjects} open={open} onOpenChange={setOpen} preset={preset} />
    </div>
  );
}

function How({ img, title, body }: { img: string; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="mx-auto mb-4 flex items-center justify-center">
        <Image src={img} alt={title} width={96} height={96} className="size-32 shrink-0 rounded-lg" />
      </div>
      <h3 className="mb-2 text-center text-lg font-medium leading-tight">{title}</h3>
      <p className="max-w-xs text-center text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
