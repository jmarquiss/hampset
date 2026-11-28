import { OpenAPIHono } from '@hono/zod-openapi';
import { csrf } from 'hono/csrf';
import { HTTPException } from 'hono/http-exception';
import { secureHeaders } from 'hono/secure-headers';

import type { AdminEnv } from './env';

import { requireAccess } from './middlewares/access.middleware';
import { auditRoutes } from './routes/audit';
import { memberRoutes } from './routes/members';

export const app = new OpenAPIHono<AdminEnv>().basePath('/api');

app.use(secureHeaders(), requireAccess, csrf());

app.route('/', memberRoutes);
app.route('/', auditRoutes);

app.openAPIRegistry.registerComponent('securitySchemes', 'CloudflareAccess', {
  in: 'header',
  name: 'Cf-Access-Jwt-Assertion',
  type: 'apiKey',
});

app.doc('/openapi.json', {
  info: {
    title: 'Hampset Admin API',
    version: '1.0.0',
  },
  openapi: '3.1.0',
  security: [{ CloudflareAccess: [] }],
});

app.notFound((c) => c.json({ error: 'Not found' }, 404));
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message || 'Request refused' }, err.status);
  }
  console.error(err);
  return c.json({ error: 'Something went wrong' }, 500);
});

export default app;
