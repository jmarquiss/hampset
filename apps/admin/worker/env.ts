export interface Env {
  DB: D1Database;
  /** Base URL of the members app, used to build invite links. */
  APP_URL: string;
  /** e.g. https://your-team.cloudflareaccess.com */
  ACCESS_TEAM_DOMAIN: string;
  /** The Access application's audience (AUD) tag. */
  ACCESS_AUD: string;
  EMAIL_FROM: string;
  RESEND_API_KEY?: string;
}

export interface AdminEnv {
  Bindings: Env;
}
