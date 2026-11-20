export interface Env {
  /** The Access application's audience (AUD) tag. */
  ACCESS_AUD: string;
  /** E.g. https://your-team.cloudflareaccess.com */
  ACCESS_TEAM_DOMAIN: string;
  DB: D1Database;
}

export interface AdminEnv {
  Bindings: Env;
  /** The signed-in admin's email from their Access login token. */
  Variables: { adminEmail: string };
}
