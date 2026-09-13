import { NextResponse, type NextRequest } from "next/server";
import { USER_COOKIE, newSignedUserId, verifyUserCookie } from "@/lib/auth/cookie";

/**
 * Anonymous user sessions. Every visitor gets a stable, signed id in an
 * httpOnly cookie, which is what sessions and reviews are keyed on. A missing,
 * empty or tampered cookie is replaced. Swapping this for a real identity
 * provider (RevisionDojo uses WorkOS AuthKit in middleware) means replacing
 * this file and `getUserId`.
 */
export async function proxy(request: NextRequest) {
  const current = request.cookies.get(USER_COOKIE)?.value;
  if (await verifyUserCookie(current)) return NextResponse.next();

  const value = await newSignedUserId();
  // Make the fresh id visible to this same request's server components.
  const headers = new Headers(request.headers);
  headers.set("cookie", [headers.get("cookie"), `${USER_COOKIE}=${value}`].filter(Boolean).join("; "));
  const response = NextResponse.next({ request: { headers } });
  response.cookies.set({
    name: USER_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|jojo/).*)"],
};
