import type { Metadata } from "next";
import { TeachJojoHome } from "@/components/teach-jojo/teach-jojo-home";
import { requireUserId } from "@/lib/auth/user";
import { listSessionsForUser } from "@/lib/sessions/repo";
import { toRail } from "@/lib/sessions/rail";
import { SUBJECTS, toPublicSubjects } from "@/lib/syllabus/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Teach Jojo" };

export default async function TeachJojoPage({ searchParams }: { searchParams: Promise<{ start?: string; subject?: string; topic?: string }> }) {
  const [sessions, params] = await Promise.all([listSessionsForUser(await requireUserId()), searchParams]);
  return (
    <TeachJojoHome
      sessions={toRail(sessions)}
      subjects={toPublicSubjects(SUBJECTS)}
      startOpen={params.start === "1"}
      preset={{ subjectId: params.subject, topicId: params.topic }}
    />
  );
}
