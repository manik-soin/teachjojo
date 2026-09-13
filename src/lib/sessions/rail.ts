import type { RailSession } from "@/components/teach-jojo/sessions-rail";
import type { ObjectiveRow, SessionRow } from "@/lib/db/schema";

/** Shape the past-sessions rail needs, derived from session + objective rows. */
export function toRail(sessions: (SessionRow & { objectives: ObjectiveRow[] })[]): RailSession[] {
  return sessions.map((s) => ({
    id: s.id,
    subjectName: s.subjectName,
    title: s.title,
    status: s.status,
    updatedAt: s.updatedAt,
    objectives: s.objectives.map((o) => ({ status: o.status })),
    firstObjective: s.objectives[0]?.text ?? s.title,
  }));
}
