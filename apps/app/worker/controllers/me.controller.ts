import type { Context } from 'hono';

import type { AppEnv } from '../env';

export function getMeController(c: Context<AppEnv>) {
  return c.json(c.var.user, 200);
}
