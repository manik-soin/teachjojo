import { nanoid } from "nanoid";

export const USER_COOKIE = "rd_uid";

/**
 * Anonymous ids are HMAC-signed so a client cannot mint identities (and fresh
 * quotas) by editing the cookie, and cannot forge another visitor's id without
 * the secret. Format: `u_<nanoid>.<base64url(hmac-sha256)>`.
 *
 * Web Crypto only, so this runs in the proxy and in route handlers alike.
 */
function secret(): string {
  const s = process.env.RD_UID_SECRET ?? process.env.DATABASE_URL;
  if (!s) throw new Error("RD_UID_SECRET (or DATABASE_URL) must be set to sign user cookies.");
  return s;
}

async function hmac(value: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
  return btoa(String.fromCharCode(...sig)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function newSignedUserId(): Promise<string> {
  const id = `u_${nanoid(21)}`;
  return `${id}.${await hmac(id)}`;
}

/** The bare user id if the cookie value carries a valid signature, else null. */
export async function verifyUserCookie(value: string | undefined): Promise<string | null> {
  if (!value) return null;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return null;
  const id = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!/^u_[A-Za-z0-9_-]{21}$/.test(id)) return null;
  const expected = await hmac(id);
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0 ? id : null;
}
