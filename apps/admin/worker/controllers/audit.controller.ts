import type { Context } from 'hono';

import type { AdminEnv } from '../env';

import { listAuditEntries } from '../services/audit.service';

export async function getAuditEntriesController(c: Context<AdminEnv>) {
  return c.json(await listAuditEntries(c.env.DB), 200);
}
