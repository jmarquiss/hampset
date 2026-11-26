import { createExecutionContext, createScheduledController } from 'cloudflare:test';
import { env } from 'cloudflare:workers';
import { expect, it } from 'vitest';

import { crons, scheduled } from './index';

// A job missing from wrangler.jsonc would never run, and a schedule without a job would fail.
it('has a job for exactly the schedules in wrangler.jsonc', () => {
  expect(crons.map((c) => c.schedule).sort()).toEqual([...env.TEST_CRONS].sort());
});

it('rejects a schedule with no job', async () => {
  const controller = createScheduledController({ cron: 'not a schedule' });
  await expect(scheduled(controller, env, createExecutionContext())).rejects.toThrow(
    'No job for cron "not a schedule"',
  );
});
