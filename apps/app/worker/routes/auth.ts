import { OpenAPIHono } from '@hono/zod-openapi';

import type { AppEnv } from '../env';

import { handleAuthRequest } from '../controllers/auth.controller';

/** Better Auth owns its dynamic routes and request/response schemas. */
export const authRoutes = new OpenAPIHono<AppEnv>();

authRoutes.on(['GET', 'POST'], '/auth/*', handleAuthRequest);
