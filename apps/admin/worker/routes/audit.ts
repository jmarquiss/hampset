import { createRoute } from '@hono/zod-openapi';

import { getAuditEntriesController } from '../controllers/audit.controller';
import { auditEntriesSchema } from '../schemas/audit.schema';
import { createApiRouter } from './shared';

const listAuditRoute = createRoute({
  method: 'get',
  path: '/audit',
  responses: {
    200: {
      content: { 'application/json': { schema: auditEntriesSchema } },
      description: 'Most recent admin actions.',
    },
  },
  tags: ['Audit'],
});

export const auditRoutes = createApiRouter().openapi(listAuditRoute, getAuditEntriesController);
