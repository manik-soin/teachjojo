"use client";

import {
  IconBookmark,
  IconBooks,
  IconBriefcase,
  IconCalendar,
  IconChevronRight,
  IconDots,
  IconFileText,
  IconGift,
  IconHome,
  IconLayoutSidebar,
  IconSettings,
  IconWriting,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, type ReactNode } from "react";
import { JojoMark } from "@/components/teach-jojo/jojo-avatar";
import { NotInBuild } from "@/components/ui/not-in-build";
import { cn } from "@/lib/utils";

type Item = { label: string; icon?: ReactNode; href?: string; children?: { label: string; href?: string }[] };

/** The product's DP navigation. Only Teach Jojo is live in this build; other rows are inert and say so on hover. */
const NAV: Item[] = [
  { label: "Home", icon: <IconHome className="size-5" /> },
  { label: "My Subjects", icon: <IconBooks className="size-5" />, children: [] },
  { label: "Jojo AI Tutor", icon: <JojoMark className="size-5" /> },
  { label: "Study Planner", icon: <IconCalendar className="size-5" /> },
  {
    label: "All Resources",
    icon: <IconFileText className="size-5" />,
    children: [{ label: "Question Bank" }, { label: "Study Notes" }, { label: "Cheatsheets" }, { label: "Teach Jojo", href: "/teach-jojo" }],
  },
  { label: "IA/EE/TOK", icon: <IconWriting className="size-5" />, children: [{ label: "Coursework Studio" }, { label: "Grade IA/EE/TOK" }, { label: "Examples" }] },
  { label: "Tools", icon: <IconBriefcase className="size-5" />, children: [{ label: "Plagiarism & AI" }] },
  { label: "Saved", icon: <IconBookmark className="size-5" /> },
];

const OpenCtx = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} });

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <OpenCtx.Provider value={{ open, setOpen }}>{children}</OpenCtx.Provider>;
}

export function SidebarTrigger() {
  const { open, setOpen } = useContext(OpenCtx);
  return (
    <button
      type="button"
      aria-label="Toggle navigation"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
    >
      <IconLayoutSidebar className="size-5" stroke={1.8} />
    </button>
  );
}

/** Their nav row: rounded-xl, text-primary/60 at rest, muted background and full-strength text on hover, 150ms colour transition. */
const ROW =
  "group/navitem relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-[15px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary-foreground/50 [@media(hover:hover)]:hover:bg-muted [@media(hover:hover)]:hover:text-foreground";

export function SidebarNav() {
  const { open, setOpen } = useContext(OpenCtx);
  const pathname = usePathname();

  return (
    <>
      {open ? <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setOpen(false)} /> : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[240px] shrink-0 flex-col overflow-y-auto bg-background px-2 pt-4 pb-3 transition-[transform,width,padding] lg:static lg:z-auto lg:h-[calc(100dvh-4.25rem)] lg:translate-x-0 lg:overflow-hidden lg:pt-0",
          open ? "translate-x-0" : "-translate-x-full",
          open ? "lg:w-0 lg:px-0" : "lg:w-[220px] lg:px-2",
        )}
      >
        <div className="mb-3 flex w-full rounded-full bg-muted p-1 text-sm">
          {["DP", "MYP", "SAT/ACT/AP"].map((t, i) =>
            i === 0 ? (
              <button key={t} type="button" aria-pressed className="flex-1 rounded-full bg-background px-2 py-1.5 font-medium text-foreground shadow-sm transition-colors">
                {t}
              </button>
            ) : (
              <NotInBuild key={t} className="flex-1" side="bottom">
                <span className="block w-full rounded-full px-2 py-1.5 text-center text-muted-foreground transition-colors group-hover/nib:text-foreground">{t}</span>
              </NotInBuild>
            ),
          )}
        </div>

        <nav className="flex flex-1 flex-col">
          <ul className="space-y-0.5">
            {NAV.map((item) => (
              <li key={item.label}>
                <Row item={item} pathname={pathname} />
                {item.children && item.children.length > 0 ? (
                  <ul className="mt-0.5 ml-[18px] border-l-2 border-subtle pl-2">
                    {item.children.map((c) => (
                      <li key={c.label}>
                        <Row item={c} pathname={pathname} sub />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <ul className="mt-auto space-y-0.5 pt-4">
            <li>
              <NotInBuild block side="top">
                <span className={cn(ROW, "text-accent-fuchsia-foreground [@media(hover:hover)]:hover:bg-accent-fuchsia/60 [@media(hover:hover)]:hover:text-accent-fuchsia-foreground")}>
                  <IconGift className="size-5" /> OnePrep, 7 days free
                </span>
              </NotInBuild>
            </li>
            <li>
              <Row item={{ label: "More", icon: <IconDots className="size-5" />, children: [] }} pathname={pathname} />
            </li>
            <li>
              <Row item={{ label: "Settings", icon: <IconSettings className="size-5" /> }} pathname={pathname} />
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

function Row({ item, pathname, sub }: { item: Item | { label: string; href?: string }; pathname: string; sub?: boolean }) {
  const href = "href" in item ? item.href : undefined;
  const active = href ? pathname === href || pathname.startsWith(`${href}/`) : false;
  const icon = "icon" in item ? item.icon : null;
  const hasChildren = "children" in item && item.children !== undefined;
  const classes = cn(ROW, active ? "bg-muted font-medium text-foreground" : "text-primary/60", sub && "py-1.5 text-sm");
  if (href) {
    return (
      <Link href={href} className={classes} aria-current={active ? "page" : undefined}>
        {icon}
        <span className="truncate">{item.label}</span>
      </Link>
    );
  }
  return (
    <NotInBuild block side="top">
      <span className={classes}>
        {icon}
        <span className="truncate">{item.label}</span>
        {hasChildren ? <IconChevronRight className="ml-auto size-4 opacity-60 transition-transform group-hover/navitem:translate-x-0.5" /> : null}
      </span>
    </NotInBuild>
  );
}
