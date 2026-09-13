"use client";

import { IconCheck, IconChevronDown, IconChevronLeft, IconChevronRight, IconClockHour4, IconLayoutList, IconMessage, IconMicrophone, IconSearch } from "@tabler/icons-react";
import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { startSessionAction } from "@/app/teach-jojo/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Difficulty, SessionDepth } from "@/lib/jojo/contract";
import { MAX_TOPICS, type Subject } from "@/lib/syllabus/data";
import { NotInBuild } from "@/components/ui/not-in-build";
import { cn } from "@/lib/utils";

/**
 * The product's five-step setup dialog, rebuilt from its live markup:
 * subject → topics (or custom material) → teaching difficulty → session length → how to review.
 * Nothing is preselected on steps 3–5; pressing Next without a choice shows the product's red validation.
 */

const DIFFICULTIES: { value: Difficulty; title: string; body: string; face: string }[] = [
  { value: "clueless", title: "Easy", body: "Knows nothing. Simple explanations are enough.", face: "/jojo/baby-jojo-dumb.svg" },
  { value: "knows_a_bit", title: "Medium", body: "Knows the basics but mixes things up.", face: "/jojo/baby-jojo-normal.svg" },
  { value: "pretty_familiar", title: "Hard", body: "Gets the basics and grills you on the tricky parts.", face: "/jojo/baby-jojo-smart.svg" },
];

const DEPTHS: { value: SessionDepth; title: string; body: string; icon: React.ReactNode }[] = [
  { value: "quick", title: "Quick Review", body: "Shorter session, best for quick recaps.", icon: <IconClockHour4 className="absolute -right-6 -bottom-6 size-28 text-muted-foreground/20" stroke={2.2} /> },
  { value: "in_depth", title: "In-Depth", body: "Longer session, best for thorough reviews.", icon: <IconLayoutList className="absolute -right-6 -bottom-6 size-28 text-muted-foreground/20" stroke={2.2} /> },
];

export type WizardPreset = { subjectId?: string; topicId?: string };

export function NewSessionDialog({ subjects, open, onOpenChange, preset }: { subjects: Subject[]; open: boolean; onOpenChange: (o: boolean) => void; preset?: WizardPreset }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[896px] p-0 sm:p-0">{open ? <Wizard subjects={subjects} preset={preset} /> : null}</DialogContent>
    </Dialog>
  );
}

/** Their radio-card label: 2px border, colour transition, muted-foreground border on hover, foreground when checked, destructive when the step failed validation. */
const CARD =
  "relative flex cursor-pointer overflow-hidden rounded-2xl border-2 bg-background text-sm font-medium leading-none transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-foreground/40 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-card";
const cardBorder = (checked: boolean, invalid: boolean) =>
  checked ? "border-foreground hover:border-foreground" : invalid ? "border-destructive hover:border-destructive" : "border-border hover:border-muted-foreground";

function Wizard({ subjects, preset }: { subjects: Subject[]; preset?: WizardPreset }) {
  const presetSubject = subjects.find((s) => s.id === preset?.subjectId);
  const presetTopic = presetSubject?.units.flatMap((u) => u.topics).find((t) => t.id === preset?.topicId);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(presetTopic ? 2 : 1);
  const [subjectId, setSubjectId] = useState<string | null>(presetSubject?.id ?? null);
  const [topicIds, setTopicIds] = useState<string[]>(presetTopic ? [presetTopic.id] : []);
  const [focus, setFocus] = useState("");
  const [query, setQuery] = useState("");
  const [openUnits, setOpenUnits] = useState<Record<string, boolean>>({});
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [depth, setDepth] = useState<SessionDepth | null>(null);
  const [mode, setMode] = useState<"chat" | null>(null);
  const [invalid, setInvalid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const subject = useMemo(() => subjects.find((s) => s.id === subjectId) ?? null, [subjectId, subjects]);
  const units = useMemo(() => {
    if (!subject) return [];
    const q = query.trim().toLowerCase();
    return subject.units
      .map((u) => ({ ...u, topics: q ? u.topics.filter((t) => `${t.code} ${t.label}`.toLowerCase().includes(q)) : u.topics }))
      .filter((u) => u.topics.length > 0);
  }, [query, subject]);
  const hasFocus = focus.trim().length >= 12;

  const toggle = (id: string) => setTopicIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= MAX_TOPICS ? prev : [...prev, id]));
  const unitOpen = (id: string, i: number) => openUnits[id] ?? (i === 0 || query.length > 0);

  const next = () => {
    setInvalid(null);
    if (step === 1 && !subject) return setInvalid("Please choose a subject.");
    if (step === 2 && topicIds.length === 0 && !hasFocus) return setInvalid("Pick at least one topic, or describe what you want to review.");
    if (step === 3 && !difficulty) return setInvalid("Please choose a teaching difficulty.");
    if (step === 4 && !depth) return setInvalid("Please choose a session length.");
    setStep((s) => Math.min(5, s + 1) as typeof step);
  };
  const back = () => {
    setInvalid(null);
    setStep((s) => Math.max(1, s - 1) as typeof step);
  };
  const submit = () => {
    setInvalid(null);
    if (!mode) return setInvalid("Please choose how you want to review.");
    if (!subject || !difficulty || !depth) return;
    setError(null);
    startTransition(async () => {
      const res = await startSessionAction({ subjectId: subject.id, topicIds, focusText: focus.trim() || undefined, difficulty, sessionDepth: depth });
      if (res?.error) setError(res.error);
    });
  };

  const heading = ["Choose your subject", "Choose what to review", "Choose your teaching difficulty", "Session length", "How do you want to review?"][step - 1];
  const sub = [
    "Pick the subject you'd like to review with Jojo.",
    "Select topics or describe what you want to learn.",
    "The more Baby Jojo already knows, the harder the questions get.",
    "How long do you want to review for?",
    "Choose whether to type your answers or talk it through.",
  ][step - 1];

  return (
    <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex w-full flex-col gap-8 px-6 pt-14 pb-8">
          <div key={step} className="animate-slide-in-right">
            <div className="flex flex-col gap-6 md:grid md:grid-cols-[2fr_3fr] md:gap-8">
              <div className="md:sticky md:top-8 md:min-w-[180px] md:self-start">
                <div className="mb-4 flex items-center gap-2.5">
                  <p className="text-sm font-medium text-muted-foreground">Step {step} of 5</p>
                </div>
                <DialogTitle className="h3 text-center text-pretty font-title md:max-w-[260px] md:text-left">{heading}</DialogTitle>
                <DialogDescription className="mt-3 text-center text-pretty text-muted-foreground md:max-w-[260px] md:text-left">{sub}</DialogDescription>
              </div>

              <div className="min-w-0">
                {step === 1 ? (
                  <div>
                    <div className="grid grid-cols-2 gap-2">
                      {subjects.map((s) => {
                        const active = s.id === subject?.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setSubjectId(s.id);
                              setTopicIds([]);
                              setOpenUnits({});
                              setInvalid(null);
                            }}
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-muted p-5 text-left transition-all duration-200 hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary-foreground/50",
                              active && "ring-2 ring-foreground",
                            )}
                          >
                            <span className="min-w-0 flex-1 font-medium">{s.name}</span>
                            <IconCheck className={cn("size-6 shrink-0 transition-opacity", active ? "opacity-100" : "opacity-0")} />
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-6 mb-2 text-center text-sm text-muted-foreground">Or search for a subject</p>
                    <label className="flex h-12 items-center justify-between rounded-2xl bg-muted px-5 text-muted-foreground transition-colors hover:bg-muted-hover">
                      <input
                        list="tj-subjects"
                        placeholder="Search subjects..."
                        aria-label="Search subjects"
                        className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                        onChange={(e) => {
                          const hit = subjects.find((s) => s.name.toLowerCase() === e.target.value.trim().toLowerCase());
                          if (hit && hit.id !== subjectId) {
                            // Same invariant as the cards: a new subject never keeps another subject's topics.
                            setSubjectId(hit.id);
                            setTopicIds([]);
                          }
                        }}
                      />
                      <IconChevronDown className="size-4 shrink-0 opacity-60" />
                    </label>
                    <datalist id="tj-subjects">
                      {subjects.map((s) => (
                        <option key={s.id} value={s.name} />
                      ))}
                    </datalist>
                  </div>
                ) : null}

                {step === 2 && subject ? (
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">Choose up to {MAX_TOPICS} topics</p>
                    <label className="flex h-9 items-center gap-2 rounded-xl bg-muted px-3 ring-foreground transition-shadow focus-within:ring-2">
                      <IconSearch className="size-4 text-muted-foreground" />
                      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search topics..." aria-label="Search topics" className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
                    </label>
                    <div className="mt-2">
                      {units.length === 0 ? <p className="px-4 py-6 text-center text-sm text-muted-foreground">No topics match.</p> : null}
                      {units.map((unit, i) => {
                        const isOpen = unitOpen(unit.id, i);
                        return (
                          <div key={unit.id}>
                            <div className="flex min-w-0 items-center gap-2 rounded-xl px-4 transition-colors hover:bg-muted">
                              <button type="button" aria-expanded={isOpen} onClick={() => setOpenUnits((o) => ({ ...o, [unit.id]: !isOpen }))} className="flex min-w-0 flex-1 items-center justify-between gap-2 py-3 text-left font-medium transition-all focus-visible:outline-none">
                                <span className="truncate">{unit.label}</span>
                                <IconChevronDown className={cn("size-5 shrink-0 opacity-60 transition-transform duration-200", isOpen && "rotate-180")} />
                              </button>
                            </div>
                            {isOpen ? (
                              <div className="overflow-hidden pb-2 text-sm">
                                {unit.topics.map((t) => {
                                  const checked = topicIds.includes(t.id);
                                  const disabled = !checked && topicIds.length >= MAX_TOPICS;
                                  return (
                                    <label key={t.id} className={cn("flex min-w-0 cursor-pointer items-center gap-3 rounded-xl px-4 py-2 pl-8 transition-colors hover:bg-muted", disabled && "cursor-not-allowed opacity-50")}>
                                      <Checkbox checked={checked} disabled={disabled} onCheckedChange={() => toggle(t.id)} className="size-5 rounded-md" />
                                      <span className="truncate">
                                        {t.code} {t.label}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground tabular-nums">{topicIds.length}/{MAX_TOPICS} selected</p>
                    <div className="mt-6">
                      <p className="font-medium text-sm">Can&apos;t find your topic? Describe it here</p>
                      <p className="mt-1 text-sm text-muted-foreground">To study a topic that isn&apos;t listed, clear your selections and enter its name, what you want to cover, and your course or syllabus.</p>
                      <textarea
                        value={focus}
                        onChange={(e) => setFocus(e.target.value)}
                        rows={3}
                        maxLength={2000}
                        placeholder="e.g. Focus on key definitions, include exam-style practice, skip anything already covered in class."
                        className="mt-3 flex w-full resize-none rounded-lg bg-muted px-4 py-3 text-sm ring-offset-background placeholder:text-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-white/50 dark:focus-visible:ring-white"
                      />
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div role="radiogroup" className="flex flex-col gap-3">
                    {DIFFICULTIES.map((d) => {
                      const checked = difficulty === d.value;
                      return (
                        <label key={d.value} className={cn(CARD, "items-center gap-4 p-5", cardBorder(checked, Boolean(invalid)))}>
                          <input type="radio" name="tj-difficulty" className="sr-only" checked={checked} onChange={() => { setDifficulty(d.value); setInvalid(null); }} />
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-medium">{d.title}</p>
                            <p className="mt-1 text-sm font-normal text-pretty text-muted-foreground">{d.body}</p>
                          </div>
                          <Image src={d.face} alt="" width={72} height={64} loading="eager" className="h-auto w-[72px] shrink-0" />
                        </label>
                      );
                    })}
                  </div>
                ) : null}

                {step === 4 ? (
                  <div role="radiogroup" className="flex flex-col gap-3">
                    {DEPTHS.map((d) => {
                      const checked = depth === d.value;
                      return (
                        <label key={d.value} className={cn(CARD, "items-start gap-4 p-5 pr-16 pb-12", cardBorder(checked, Boolean(invalid)))}>
                          <input type="radio" name="tj-depth" className="sr-only" checked={checked} onChange={() => { setDepth(d.value); setInvalid(null); }} />
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-medium">{d.title}</p>
                            <p className="mt-1 text-sm font-normal text-pretty text-muted-foreground">{d.body}</p>
                          </div>
                          {d.icon}
                        </label>
                      );
                    })}
                  </div>
                ) : null}

                {step === 5 ? (
                  <div role="radiogroup" className="grid grid-cols-2 gap-2">
                    <label className={cn(CARD, "flex-col items-start gap-3 p-4 pb-12", cardBorder(mode === "chat", Boolean(invalid)))}>
                      <input type="radio" name="tj-mode" className="sr-only" checked={mode === "chat"} onChange={() => { setMode("chat"); setInvalid(null); }} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-medium">Chat</p>
                        </div>
                        <p className="mt-1 text-sm font-normal text-pretty text-muted-foreground">Type your answers and read Jojo&apos;s replies.</p>
                      </div>
                      <IconMessage className="absolute -right-4 -bottom-4 size-20 text-muted-foreground/20" stroke={2.2} />
                    </label>
                    <NotInBuild block label="Voice · not part of this build">
                    <div className={cn(CARD, "flex-col items-start gap-3 p-4 pb-12 border-border cursor-not-allowed opacity-70 hover:border-border")}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-medium">Voice</p>
                          <span className="rounded bg-accent-fuchsia-foreground px-1 py-0.5 text-[11px] font-medium text-accent-fuchsia">New</span>
                        </div>
                        <p className="mt-1 text-sm font-normal text-pretty text-muted-foreground">Talk it through out loud with Jojo.</p>
                      </div>
                      <IconMicrophone className="absolute -right-4 -bottom-4 size-20 text-muted-foreground/20" stroke={2.2} />
                    </div>
                    </NotInBuild>
                  </div>
                ) : null}

                {invalid ? (
                  <p role="alert" className="mt-3 text-sm text-destructive">
                    {invalid}
                  </p>
                ) : null}
                {error ? (
                  <p role="alert" className="mt-3 text-sm text-destructive">
                    {error}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 px-6 pt-4 pb-6">
        <div className="flex w-full items-center justify-between gap-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={back}
              disabled={pending}
              className="inline-flex w-fit cursor-pointer items-center justify-center gap-1 rounded-2xl bg-muted px-4 py-2 font-medium text-muted-foreground ring-offset-background transition-all hover:bg-muted-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IconChevronLeft className="size-5" /> Back
            </button>
          ) : (
            <span />
          )}
          {step < 5 ? (
            <button
              type="button"
              onClick={next}
              disabled={step === 1 && !subject}
              className="inline-flex w-fit cursor-pointer items-center justify-center gap-1 rounded-2xl bg-foreground px-4 py-2 font-medium text-background ring-offset-background transition-all hover:bg-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next <IconChevronRight className="size-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={pending}
              className="inline-flex w-fit cursor-pointer items-center justify-center gap-1 rounded-2xl bg-accent-primary-foreground px-4 py-2 font-medium text-background ring-offset-background transition-all hover:bg-accent-primary-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary-foreground/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Starting…" : "Start Review Session"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
