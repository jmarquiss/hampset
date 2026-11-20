import { and, isNotNull, isNull, sql, type SQL } from 'drizzle-orm';

import { user } from './schema';

export type MemberStatus = 'active' | 'disabled' | 'pending';

/** Derives a member's status from their approval and disable timestamps. */
export function memberStatus(row: {
  approvedAt?: Date | null;
  disabledAt?: Date | null;
}): MemberStatus {
  if (row.disabledAt) return 'disabled';
  return row.approvedAt ? 'active' : 'pending';
}

/** SQL condition matching users in `status`; the database-side twin of memberStatus. */
export function statusIs(status: MemberStatus): SQL {
  switch (status) {
    case 'pending':
      return and(isNull(user.approvedAt), isNull(user.disabledAt)) ?? sql`0`;
    case 'active':
      return and(isNotNull(user.approvedAt), isNull(user.disabledAt)) ?? sql`0`;
    case 'disabled':
      return isNotNull(user.disabledAt);
  }
}
