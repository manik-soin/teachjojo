import { NextResponse } from "next/server";
import { SessionError } from "@/lib/sessions/service";

const STATUS: Record<SessionError["code"], number> = { not_found: 404, finished: 409, conflict: 409, limit: 429, invalid: 400 };

/**
 * Student-facing copy stays plain; the operator detail goes to the log. A provider
 * rate limit (the AI Gateway free tier throttles per model) is reported as "busy"
 * with a 503 so the client can suggest a short wait instead of a retype.
 */
export function errorResponse(error: unknown) {
  if (error instanceof SessionError) {
    return NextResponse.json({ error: error.code, message: error.message }, { status: STATUS[error.code] });
  }
  let text = "";
  try {
    text = JSON.stringify(error, Object.getOwnPropertyNames(error as object));
  } catch {
    text = String(error);
  }
  const kind = text.includes("customer_verification_required")
    ? "gateway_billing"
    : /Free tier users do not have access|RestrictedModelsError/i.test(text)
      ? "gateway_model_restricted"
      : /rate.?limit|429|too many requests/i.test(text)
        ? "rate_limited"
        : /abort|timeout|timed out/i.test(text)
          ? "timeout"
          : "model";
  console.error(`[teach-jojo] model call failed (${kind})`, error);
  if (kind === "rate_limited") return NextResponse.json({ error: "rate_limited", message: "Jojo is busy right now. Give it a few seconds and try again." }, { status: 503 });
  if (kind === "timeout") return NextResponse.json({ error: "timeout", message: "Jojo took too long to think. Try that again." }, { status: 502 });
  // Configuration problems (billing, restricted model, missing credentials) are the operator's to fix; the log names them.
  return NextResponse.json({ error: kind === "model" ? "model" : "configuration", message: "Jojo isn't available right now. Try again in a moment." }, { status: 502 });
}
