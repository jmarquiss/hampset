import { roles } from '@club/db';
import { Button, ErrorText, Modal } from '@club/shared/ui';
import { useState } from 'react';

import { formatDate, useMemberRoles, type Member } from '../lib/queries';

/** Edits a local draft; only Save persists changes to the member. */
export function MemberModal({ member, onClose }: { member: Member; onClose: () => void }) {
  const [selectedRoles, setSelectedRoles] = useState(member.roles);
  const change = useMemberRoles();
  const changed = roles.some(
    (role) => member.roles.includes(role) !== selectedRoles.includes(role),
  );
  const details = [
    ['Name', member.name],
    ['Email', member.email],
    ['User ID', member.id],
    ['Status', member.status],
    ['Signed up', formatDate(member.createdAt)],
  ];

  return (
    <Modal busy={change.isPending} title="Member details" onClose={onClose}>
      <dl className="grid gap-3">
        {details.map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="wrap-anywhere">{value}</dd>
          </div>
        ))}
      </dl>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (changed && !change.isPending) {
            change.mutate({ id: member.id, roles: selectedRoles }, { onSuccess: onClose });
          }
        }}
      >
        <fieldset disabled={change.isPending} className="mt-6">
          <legend className="mb-3 font-semibold">Roles</legend>
          <div className="flex flex-wrap gap-4">
            {roles.map((role) => (
              <label key={role} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role)}
                  onChange={(event) => {
                    setSelectedRoles(
                      event.target.checked
                        ? [...selectedRoles, role]
                        : selectedRoles.filter((current) => !new Set([role]).has(current)),
                    );
                  }}
                />
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </label>
            ))}
          </div>
        </fieldset>
        <ErrorText error={change.error} />
        <div className="mt-6 flex justify-end gap-3">
          <Button disabled={change.isPending} variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!changed || change.isPending} type="submit">
            {change.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
