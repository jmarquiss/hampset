import { getDb, schema } from '@club/db';
import { desc } from 'drizzle-orm';

import type { AuditEntry } from '../schemas/audit.schema';

export async function listAuditEntries(database: D1Database): Promise<AuditEntry[]> {
  const entries = await getDb(database).query.auditLog.findMany({
    limit: 50,
    orderBy: desc(schema.auditLog.id),
  });

  return entries.map((entry) => ({ ...entry, createdAt: entry.createdAt.toISOString() }));
}
