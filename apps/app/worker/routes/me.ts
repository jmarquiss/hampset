import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import type { AppEnv } from '../env';

import { getMeController } from '../controllers/me.controller';
import { apiErrorSchema, meSchema } from '../schemas/me.schema';

const route = createRoute({
  method: 'get',
  path: '/me',
  responses: {
    200: {
      content: { 'application/json': { schema: meSchema } },
      description: 'The signed-in member and their current access status.',
    },
    401: {
      content: { 'application/json': { schema: apiErrorSchema } },
      description: 'No valid session.',
    },
  },
  tags: ['Members'],
});

export const meRoutes = new OpenAPIHono<AppEnv>().openapi(route, getMeController);
