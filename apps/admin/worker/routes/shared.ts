import { OpenAPIHono } from '@hono/zod-openapi';

import type { AdminEnv } from '../env';

import { errorSchema } from '../schemas/common.schema';

export const createApiRouter = () =>
  new OpenAPIHono<AdminEnv>({
    defaultHook: (result, c) => {
      if (!result.success) return c.json({ error: 'Invalid request' }, 400);
    },
  });

export const errorResponse = (description: string) => ({
  content: { 'application/json': { schema: errorSchema } },
  description,
});
