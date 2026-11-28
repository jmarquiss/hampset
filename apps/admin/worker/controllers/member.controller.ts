import type { Context } from 'hono';

import { type schema } from '@club/db';

import type { AdminEnv } from '../env';

import { applyMemberAction, listMembers } from '../services/member.service';

export async function getMembersController(c: Context<AdminEnv>) {
  return c.json(await listMembers(c.env.DB), 200);
}

export async function memberActionController(
  c: Context<AdminEnv>,
  id: string,
  action: schema.AuditAction,
) {
  const result = await applyMemberAction(c.env.DB, {
    action,
    actorEmail: c.var.adminEmail,
    id,
  });

  if (result.kind === 'updated') return c.body(null, 204);
  if (result.kind === 'not-found') return c.json({ error: 'Member not found' }, 404);
  return c.json({ error: `That member is ${result.currentStatus}; refresh and try again.` }, 409);
}
