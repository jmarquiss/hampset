import { OpenAPIHono } from '@hono/zod-openapi';
import { csrf } from 'hono/csrf';
import { HTTPException } from 'hono/http-exception';
import { secureHeaders } from 'hono/secure-headers';

import type { AppEnv, Env } from './env';

import { scheduled } from './crons';
import { requireMember, requireSession } from './middlewares/auth.middleware';
import { authRoutes } from './routes/auth';
import { registerDevRoutes } from './routes/dev';
import { meRoutes } from './routes/me';

export const app = new OpenAPIHono<AppEnv>().basePath('/api');

app.use(secureHeaders(), csrf());
app.route('/', authRoutes);

registerDevRoutes(app);

app.doc('/openapi.json', {
  info: {
    description: 'Authentication endpoints are managed by Better Auth under /api/auth/*.',
    title: 'Hampset API',
    version: '1.0.0',
  },
  openapi: '3.1.0',
});

app.use(requireSession);
app.route('/', meRoutes);

// Everything below requires an active member, so new routes are protected by default.
app.use(requireMember);

app.notFound((c) => c.json({ error: 'Not found' }, 404));
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message || 'Request refused' }, err.status);
  }
  console.error(err);
  return c.json({ error: 'Something went wrong' }, 500);
});

export default { fetch: app.fetch, scheduled } satisfies ExportedHandler<Env>;
