import { z } from '@hono/zod-openapi';

export const memberActionSchema = z.enum(['approve', 'disable', 'enable']);
export const memberStatusSchema = z.enum(['active', 'disabled', 'pending']);

export const memberSchema = z.object({
  createdAt: z.iso.datetime(),
  email: z.string(),
  id: z.string(),
  name: z.string(),
  status: memberStatusSchema,
});

export const memberIdParamsSchema = z.object({ id: z.string() });
export const memberActionParamsSchema = memberIdParamsSchema.extend({
  action: memberActionSchema,
});

export type Member = z.infer<typeof memberSchema>;
export type MemberAction = z.infer<typeof memberActionSchema>;
export type MemberStatusValue = z.infer<typeof memberStatusSchema>;
