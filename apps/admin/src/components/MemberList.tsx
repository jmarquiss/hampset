import { Button, Card, Empty, ErrorText, Loading } from "@club/shared/ui";
import { formatDate, useMembers, useRemoveMember, type Member } from "../lib/queries";

/** Everyone who has joined the members app, each with a button to remove them. */
export function MemberList() {
  const { data: members, isLoading, error } = useMembers();
  const remove = useRemoveMember();

  const confirmRemove = (member: Member) => {
    const ok = window.confirm(
      `Remove ${member.name} (${member.email})? They'll be signed out and need a new invite to come back.`,
    );
    if (ok) remove.mutate(member.id);
  };

  return (
    <Card>
      <h2 className="mb-4 font-display text-xl text-brand">
        Members{members && ` (${members.length})`}
      </h2>
      <ErrorText error={error ?? remove.error} />
      {isLoading && <Loading />}
      {members?.length === 0 && <Empty>No members yet. Send an invite to get started.</Empty>}
      <ul className="divide-y divide-line">
        {members?.map((member) => (
          <li key={member.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate font-semibold">{member.name}</p>
              <p className="truncate text-sm text-muted">
                {member.email} · joined {formatDate(member.createdAt)}
              </p>
            </div>
            <Button
              variant="danger"
              disabled={remove.isPending}
              onClick={() => confirmRemove(member)}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
