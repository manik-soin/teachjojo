"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUserId } from "@/lib/auth/user";
import { difficulty, sessionDepth } from "@/lib/jojo/contract";
import { endSession, SessionError, startSession, type EndResult } from "@/lib/sessions/service";
import { MAX_TOPICS } from "@/lib/syllabus/data";

const startInput = z.object({
  subjectId: z.string().min(1),
  topicIds: z.array(z.string()).max(MAX_TOPICS),
  focusText: z.string().max(2000).optional(),
  difficulty,
  sessionDepth,
});

export type StartState = { error?: string };

export async function startSessionAction(input: z.input<typeof startInput>): Promise<StartState> {
  const parsed = startInput.safeParse(input);
  if (!parsed.success) return { error: "Check your selection and try again." };

  const userId = await requireUserId();
  let sessionId: string;
  try {
    sessionId = (await startSession({ userId, ...parsed.data })).id;
  } catch (error) {
    if (error instanceof SessionError) return { error: error.message };
    console.error("[teach-jojo] start failed", error);
    return { error: "Could not start the session. Try again in a moment." };
  }
  redirect(`/teach-jojo/${sessionId}`);
}

/** End Session (or retry a failed review). Returns the review outcome so the client can show the right state. */
export async function endSessionAction(sessionId: string): Promise<EndResult | { error: string }> {
  const userId = await requireUserId();
  try {
    return await endSession({ sessionId, userId });
  } catch (error) {
    if (error instanceof SessionError) return { error: error.message };
    console.error("[teach-jojo] end failed", error);
    return { error: "Could not end the session. Try again." };
  }
}
