import { getDb, schema } from '@club/db';
import { lt } from 'drizzle-orm';

import type { Env } from '../env';

const { session } = schema;

/**
 * Deletes sessions that have expired. Better Auth only removes an expired session when its cookie
 * is next used, so sessions from abandoned browsers would otherwise stay forever.
 *
 * Each run reads every session row. An index on expires_at would make this cheaper but cost a
 * write on every sign-in and daily session refresh, which is worse on D1's free write allowance.
 * Queries D1 directly rather than through Better Auth, which would be slow to start within the
 * free plan's 10 ms CPU limit.
 */
export const deleteExpiredSessions = {
  async run(controller: ScheduledController, env: Env) {
    const result = await getDb(env.DB)
      .delete(session)
      .where(lt(session.expiresAt, new Date(controller.scheduledTime)))
      .run();
    console.log(`Deleted ${result.meta.changes} expired sessions`);
  },
  schedule: '0 3 * * *',
};
