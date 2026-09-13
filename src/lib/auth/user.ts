import { cookies } from "next/headers";
import { USER_COOKIE, verifyUserCookie } from "./cookie";

/** Resolves the current anonymous user from the signed cookie. The proxy re-issues missing or tampered cookies on page loads. */
export async function getUserId(): Promise<string | null> {
  const store = await cookies();
  return verifyUserCookie(store.get(USER_COOKIE)?.value);
}

export async function requireUserId(): Promise<string> {
  const id = await getUserId();
  if (!id) throw new Error("No valid user cookie. The proxy should have set one.");
  return id;
}
