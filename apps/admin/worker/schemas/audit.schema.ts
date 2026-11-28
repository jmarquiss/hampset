import { auditActions } from '@club/db/schema';
import { z } from '@hono/zod-openapi';

export const auditActionSchema = z.enum(auditActions);

export const auditEntrySchema = z.object({
  action: auditActionSchema,
  actorEmail: z.string(),
  createdAt: z.iso.datetime(),
  id: z.number().int(),
  targetEmail: z.string(),
  targetUserId: z.string(),
});

export const auditEntriesSchema = z.array(auditEntrySchema);

export type AuditAction = z.infer<typeof auditActionSchema>;
export type AuditEntry = z.infer<typeof auditEntrySchema>;
