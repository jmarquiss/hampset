import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export type DB = ReturnType<typeof getDb>;

/** Returns a Drizzle client for the shared D1 database. */
export function getDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export { schema };
export { claimInvite, createInvite, hashToken, INVITE_TTL_MS } from "./invites";
