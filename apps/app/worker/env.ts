import type { Me } from './schemas/me.schema';

export interface Env {
  APP_URL: string;
  BETTER_AUTH_SECRET: string;
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

export interface AppEnv {
  Bindings: Env;
  Variables: { user: Me };
}
