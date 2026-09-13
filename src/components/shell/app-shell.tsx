import { IconBell, IconFlame, IconSearch, IconSparkles, IconStopwatch, IconUsers } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { getUserId } from "@/lib/auth/user";
import { userStats } from "@/lib/sessions/repo";
import { NotInBuild } from "@/components/ui/not-in-build";
import { SidebarNav, SidebarTrigger } from "./sidebar-nav";

/**
 * The RevisionDojo app frame: left rail with programme tabs and navigation, top
 * bar with search and the streak / XP pills, content in a bordered panel. Only
 * Teach Jojo is wired; the rest of the rail is the product's real navigation,
 * shown so the feature sits where it does in the product.
 */
export async function AppShell({ children }: { children: React.ReactNode }) {
  const userId = await getUserId();
  const stats = userId ? await userStats(userId).catch(() => ({ xp: 0, streak: 1 })) : { xp: 0, streak: 1 };

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-background text-foreground">
      <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
        <div className="flex min-w-0 shrink items-center gap-2 lg:w-[220px] lg:shrink-0">
          <Link href="/teach-jojo" className="flex items-center gap-2 pl-1">
            <Image src="/jojo/logo.svg" alt="RevisionDojo" width={187} height={29} priority className="h-[22px] w-auto dark:invert sm:h-6" />
          </Link>
          <SidebarTrigger />
        </div>
        <NotInBuild side="bottom" label="Search · not part of this build" className="hidden md:inline-flex">
          <span className="flex h-10 w-[160px] items-center gap-2 rounded-full bg-muted px-4 text-muted-foreground transition-colors group-hover/nib:bg-muted-hover">
            <IconSearch className="size-5" stroke={2} />
            <span className="text-[15px]">Search...</span>
          </span>
        </NotInBuild>
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
          <span className="hidden items-center gap-1 text-muted-foreground sm:flex">
            <NotInBuild side="bottom" label="Study groups · not part of this build">
              <span className="grid size-9 place-items-center rounded-xl transition-colors group-hover/nib:bg-foreground/10 group-hover/nib:text-foreground">
                <IconUsers className="size-6" stroke={1.8} />
              </span>
            </NotInBuild>
            <NotInBuild side="bottom" label="Focus timer · not part of this build">
              <span className="grid size-9 place-items-center rounded-xl transition-colors group-hover/nib:bg-foreground/10 group-hover/nib:text-foreground">
                <IconStopwatch className="size-6" stroke={1.8} />
              </span>
            </NotInBuild>
            <NotInBuild side="bottom" label="Notifications · not part of this build">
              <span className="relative grid size-9 place-items-center rounded-xl transition-colors group-hover/nib:bg-foreground/10 group-hover/nib:text-foreground">
                <IconBell className="size-6" stroke={1.8} />
                <span className="absolute top-1 right-1 size-2.5 rounded-full bg-red-500" />
              </span>
            </NotInBuild>
          </span>
          <NotInBuild side="bottom" label="Streak and XP · real counts, no detail page in this build">
          <span className="flex h-10 items-stretch overflow-hidden rounded-xl border border-border bg-card text-[15px] sm:h-11">
            <span className="flex items-center gap-1.5 px-2.5 transition-colors hover:bg-muted sm:px-3">
              <IconFlame className="size-5 fill-orange-500 text-orange-500" />
              <span className="tabular-nums text-orange-600">{stats.streak}</span>
            </span>
            <span className="flex items-center gap-1.5 border-l border-border px-2.5 transition-colors hover:bg-muted sm:px-3">
              <IconSparkles className="size-5 fill-accent-purple-foreground text-accent-purple-foreground" />
              <span className="tabular-nums">
                {stats.xp}
                <span className="text-muted-foreground">XP</span>
              </span>
            </span>
          </span>
          </NotInBuild>
          <NotInBuild side="bottom" label="Account menu · not part of this build">
            <span className="grid size-9 place-items-center overflow-hidden rounded-full bg-accent-purple ring-2 ring-transparent transition-shadow group-hover/nib:ring-accent-purple-foreground/30 sm:size-10">
              <Image src="/jojo/teach-jojo-light-tinted.svg" alt="Your avatar" width={40} height={40} className="size-full object-cover" />
            </span>
          </NotInBuild>
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 gap-2 px-2 pb-2 sm:px-3 sm:pb-3">
        <SidebarNav />
        <main className="relative flex h-[calc(100dvh-4.25rem)] min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border-2 border-subtle bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
