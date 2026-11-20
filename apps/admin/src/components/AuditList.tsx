import { Card, DataTable, ErrorText, Loading, type Column } from '@club/shared/ui';

import { formatDate, useAudit, type AuditEntry } from '../lib/queries';

const verbs = {
  approve: 'Approved',
  delete: 'Deleted',
  disable: 'Disabled',
  enable: 'Re-enabled',
};

const columns: Column<AuditEntry>[] = [
  { cell: (e) => formatDate(e.createdAt), className: 'md:whitespace-nowrap', header: 'When' },
  { cell: (e) => e.actorEmail, className: 'wrap-anywhere', header: 'Admin' },
  { cell: (e) => verbs[e.action], header: 'Action' },
  {
    cell: (e) => e.targetEmail,
    className: 'font-semibold wrap-anywhere',
    header: 'Member',
  },
];

/** The latest admin actions on members, newest first. */
export function AuditList() {
  const { data: entries, error, isLoading } = useAudit();

  return (
    <Card title="Recent activity">
      <ErrorText error={error} />
      {isLoading && <Loading />}
      {entries && (
        <DataTable columns={columns} rows={entries} rowKey={(e) => e.id} empty="No activity yet." />
      )}
    </Card>
  );
}
