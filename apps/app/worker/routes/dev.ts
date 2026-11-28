import { createRoute, type OpenAPIHono, z } from '@hono/zod-openapi';

import type { AppEnv } from '../env';

export function registerDevRoutes(app: OpenAPIHono<AppEnv>) {
  // Vite removes this route and its dynamic import from production builds.
  if (import.meta.env.DEV) {
    const devSignInRoute = createRoute({
      method: 'post',
      path: '/dev/sign-in',
      responses: {
        204: { description: 'Signed into the local test account.' },
        404: {
          content: { 'application/json': { schema: z.object({ error: z.string() }) } },
          description: 'The development sign-in route is unavailable.',
        },
      },
      tags: ['Development'],
    });

    app.openapi(devSignInRoute, async (c) =>
      (await import('../controllers/dev.controller')).devSignInController(c),
    );
  }
}
