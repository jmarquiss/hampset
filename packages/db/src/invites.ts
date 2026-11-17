import { and, eq, gt } from "drizzle-orm";
import type { DB } from "./index";
import { invite } from "./schema";

export const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const toHex = (bytes: ArrayBuffer | Uint8Array) =>
  Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");

/** Returns the hex SHA-256 of an invite token, which is what the database stores. */
export async function hashToken(token: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)));
}

/**
 * Creates an invite for `email`, replacing any pending invite for the same address, and returns
 * the token to put in the invite link.
 */
export async function createInvite(db: DB, email: string): Promise<string> {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)));
  const values = {
    tokenHash: await hashToken(token),
    expiresAt: new Date(Date.now() + INVITE_TTL_MS),
    createdAt: new Date(),
  };
  await db
    .insert(invite)
    .values({ email, ...values })
    .onConflictDoUpdate({ target: invite.email, set: values });
  return token;
}

/** Deletes the unexpired invite matching `token`, returning true if there was one. */
export async function claimInvite(db: DB, token: string): Promise<boolean> {
  const claimed = await db
    .delete(invite)
    .where(and(eq(invite.tokenHash, await hashToken(token)), gt(invite.expiresAt, new Date())))
    .returning({ id: invite.id });
  return claimed.length > 0;
}
