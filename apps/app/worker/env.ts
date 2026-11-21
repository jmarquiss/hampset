import type { MemberStatus } from '@club/db';

export interface Env {
  APP_URL: string;
  BETTER_AUTH_SECRET: string;
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

/** The signed-in user, as returned by GET /api/me. */
export interface Me {
  email: string;
  id: string;
  name: string;
  status: MemberStatus;
}

export interface AppEnv {
  Bindings: Env;
  Variables: { user: Me };
}
