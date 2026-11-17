import { Button, Card, Empty, ErrorText, Loading } from "@club/shared/ui";
import { formatDate, useInvites, useRevokeInvite } from "../lib/queries";

/** Pending invites, each with a button to revoke it. */
export function InviteList() {
  const { data: invites, isLoading, error } = useInvites();
  const revoke = useRevokeInvite();

  return (
    <Card>
      <h2 className="mb-4 font-display text-xl text-brand">Pending invites</h2>
      <ErrorText error={error ?? revoke.error} />
      {isLoading && <Loading />}
      {invites?.length === 0 && <Empty>No pending invites.</Empty>}
      <ul className="divide-y divide-line">
        {invites?.map((invite) => {
          const expired = new Date(invite.expiresAt) < new Date();
          return (
            <li key={invite.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{invite.email}</p>
                <p className={expired ? "text-sm text-danger" : "text-sm text-muted"}>
                  {expired ? "Expired" : "Expires"} {formatDate(invite.expiresAt)}
                </p>
              </div>
              <Button
                variant="secondary"
                disabled={revoke.isPending}
                onClick={() => revoke.mutate(invite.id)}
              >
                Revoke
              </Button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
