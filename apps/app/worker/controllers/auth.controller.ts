import type { Context } from 'hono';

import type { AppEnv } from '../env';

import { createAuth } from '../auth';

export function handleAuthRequest(c: Context<AppEnv>) {
  return createAuth(c.env).handler(c.req.raw);
}
