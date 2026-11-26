import type { Env } from '../env';

import { deleteExpiredSessions } from './deleteExpiredSessions';

/**
 * Every scheduled job. Each schedule must also be listed under triggers.crons in wrangler.jsonc.
 */
export const crons = [deleteExpiredSessions];

/** Runs the job whose schedule fired. Throws for an unknown schedule, so it shows as a failure. */
export const scheduled: ExportedHandlerScheduledHandler<Env> = async (controller, env) => {
  const cron = crons.find((c) => c.schedule === controller.cron);
  if (!cron) throw new Error(`No job for cron "${controller.cron}"`);
  await cron.run(controller, env);
};
