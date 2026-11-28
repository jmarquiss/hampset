import { useState, type ReactNode } from 'react';

import { roles } from '@club/db';
import { Button, Card, DataTable, ErrorText, Loading, Tabs, type Column } from '@club/shared/ui';

import {
  formatDate,
  useMemberAction,
  useMemberRoles,
  useMembers,
  type Member,
  type MemberAction,
} from '../lib/queries';

const statusTabs: { empty: string; label: ReactNode; status: Member['status'] }[] = [
  {
    empty: 'Nobody is waiting. People appear here after they sign in to the members app.',
    label: (
      <>
        Waiting<span className="max-sm:hidden"> for approval</span>
      </>
    ),
    status: 'pending',
  },
  { empty: 'No members yet.', label: 'Members', status: 'active' },
  { empty: 'No disabled members.', label: 'Disabled', status: 'disabled' },
];

/**
 * Every member in one table, with a tab per status (waiting for approval first) showing how many
 * are in each, and the buttons that apply to each member.
 */
export function MemberTable() {
  const { data, error, isLoading } = useMembers();
  const change = useMemberAction();
  const roleChange = useMemberRoles();
  const [editingRoles, setEditingRoles] = useState<string | null>(null);
  const busy = change.isPending || roleChange.isPending;

  const buttons = (member: Member) => {
    const act = (action: MemberAction, confirmMessage?: string) => () => {
      if (
        !confirmMessage ||
        window.confirm(`${confirmMessage} ${member.name} (${member.email})?`)
      ) {
        change.mutate({ action, id: member.id });
      }
    };
    switch (member.status) {
      case 'pending':
        return (
          <>
            <Button size="sm" onClick={act('approve')}>
              Approve
            </Button>
            <Button size="sm" variant="danger" onClick={act('disable', 'Reject')}>
              Reject
            </Button>
          </>
        );
      case 'active':
        return (
          <Button size="sm" variant="danger" onClick={act('disable', 'Remove access for')}>
            Disable
          </Button>
        );
      case 'disabled':
        return (
          <>
            <Button size="sm" variant="secondary" onClick={act('enable')}>
              Enable
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={act('delete', "They'll be able to sign up again. Permanently delete")}
            >
              Delete
            </Button>
          </>
        );
    }
  };

  const columns: Column<Member>[] = [
    {
      // Email first: names come from Google and anyone can choose any name.
      cell: (member) => {
        const editing = editingRoles === member.id;
        return (
          <div>
            <p className="font-semibold wrap-anywhere">{member.email}</p>
            <p className="wrap-anywhere text-muted">{member.name}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {member.roles.length ? (
                <span className="text-sm text-muted">Roles: {member.roles.join(', ')}</span>
              ) : (
                <span className="text-sm text-muted">No roles</span>
              )}
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setEditingRoles(editing ? null : member.id)}
              >
                {editing ? 'Close roles' : 'Edit roles'}
              </Button>
              {editing &&
                roles.map((role) => (
                  <label key={role} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={member.roles.includes(role)}
                      disabled={busy}
                      onChange={(event) => {
                        const next = event.target.checked
                          ? [...member.roles, role]
                          : member.roles.filter((current) => current !== role);
                        roleChange.mutate({ id: member.id, roles: next });
                      }}
                    />
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </label>
                ))}
            </div>
          </div>
        );
      },
      header: 'Member',
      hideStackedLabel: true,
    },
    {
      cell: (m) => formatDate(m.createdAt),
      className: 'md:whitespace-nowrap',
      header: 'Signed up',
    },
    {
      cell: (member) => (
        <fieldset disabled={busy} className="flex flex-wrap gap-2 max-md:pt-1 md:justify-end">
          {buttons(member)}
        </fieldset>
      ),
      className: 'md:text-right',
      header: 'Actions',
      hideStackedLabel: true,
    },
  ];

  return (
    <Card title="Manage access">
      <ErrorText error={error ?? change.error ?? roleChange.error} />
      {isLoading && <Loading />}
      {data && (
        <Tabs
          label="Members by status"
          className="-mx-4 px-1 sm:mx-0 sm:px-0"
          items={statusTabs.map((tab) => {
            const members = data.filter((m) => m.status === tab.status);
            return {
              content: (
                <DataTable
                  columns={columns}
                  rows={members}
                  rowKey={(m) => m.id}
                  empty={tab.empty}
                />
              ),
              count: members.length,
              id: tab.status,
              label: tab.label,
            };
          })}
        />
      )}
    </Card>
  );
}
