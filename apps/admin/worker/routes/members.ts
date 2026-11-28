import { createRoute, z } from '@hono/zod-openapi';

import {
  getMembersController,
  memberActionController,
  updateMemberRolesController,
} from '../controllers/member.controller';
import {
  memberActionParamsSchema,
  memberIdParamsSchema,
  memberSchema,
  updateMemberRolesSchema,
} from '../schemas/member.schema';
import { createApiRouter, errorResponse } from './shared';

const listMembersRoute = createRoute({
  method: 'get',
  path: '/members',
  responses: {
    200: {
      content: { 'application/json': { schema: z.array(memberSchema) } },
      description: 'Members ordered by sign-up date.',
    },
  },
  tags: ['Members'],
});

const updateRolesRoute = createRoute({
  method: 'put',
  path: '/members/{id}/roles',
  request: {
    body: { content: { 'application/json': { schema: updateMemberRolesSchema } }, required: true },
    params: memberIdParamsSchema,
  },
  responses: {
    204: { description: 'Member roles updated.' },
    400: errorResponse('Invalid role list.'),
    404: errorResponse('Member not found.'),
  },
  tags: ['Members'],
});

const memberActionRoute = createRoute({
  method: 'post',
  path: '/members/{id}/{action}',
  request: { params: memberActionParamsSchema },
  responses: {
    204: { description: 'Member action applied.' },
    400: errorResponse('Invalid action.'),
    404: errorResponse('Member not found.'),
    409: errorResponse('Action does not apply to the member current status.'),
  },
  tags: ['Members'],
});

const deleteMemberRoute = createRoute({
  method: 'delete',
  path: '/members/{id}',
  request: { params: memberIdParamsSchema },
  responses: {
    204: { description: 'Member deleted.' },
    404: errorResponse('Member not found.'),
    409: errorResponse('Member must be disabled before deletion.'),
  },
  tags: ['Members'],
});

export const memberRoutes = createApiRouter()
  .openapi(listMembersRoute, getMembersController)
  .openapi(updateRolesRoute, (c) =>
    updateMemberRolesController(c, c.req.valid('param').id, c.req.valid('json').roles),
  )
  .openapi(memberActionRoute, (c) =>
    memberActionController(c, c.req.valid('param').id, c.req.valid('param').action),
  )
  .openapi(deleteMemberRoute, (c) => memberActionController(c, c.req.valid('param').id, 'delete'));
