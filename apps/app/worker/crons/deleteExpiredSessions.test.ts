import { getDb, schema } from '@club/db';
import { createExecutionContext, createScheduledController } from 'cloudflare:test';
import { env } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import { expect, it } from 'vitest';

import { deleteExpiredSessions } from './deleteExpiredSessions';
import { scheduled } from './index';

const db = getDb(env.DB);
const day = 24 * 60 * 60 * 1000;

it('deletes expired sessions and keeps live ones', async () => {
  const userId = crypto.randomUUID();
  await db.insert(schema.user).values({ email: `${userId}@example.com`, id: userId, name: 'Test' });
  const sessions = [
    { expiresAt: new Date(Date.now() - day), id: 'expired' },
    { expiresAt: new Date(Date.now() + day), id: 'live' },
  ];
  await db
    .insert(schema.session)
    .values(sessions.map((s) => ({ ...s, token: crypto.randomUUID(), userId })));

  const controller = createScheduledController({
    cron: deleteExpiredSessions.schedule,
    scheduledTime: Date.now(),
  });
  await scheduled(controller, env, createExecutionContext());

  const remaining = await db
    .select({ id: schema.session.id })
    .from(schema.session)
    .where(eq(schema.session.userId, userId));
  expect(remaining).toEqual([{ id: 'live' }]);
});
