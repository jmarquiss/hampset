export interface Env {
  DB: D1Database;
  APP_URL: string;
  BETTER_AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

/** The signed-in member, as returned by GET /api/me. */
export interface Me {
  id: string;
  name: string;
  email: string;
}

export interface AppEnv {
  Bindings: Env;
  Variables: { user: Me };
}
