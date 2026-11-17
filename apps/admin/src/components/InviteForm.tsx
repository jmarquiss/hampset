import { Button, Card, ErrorText, Input } from "@club/shared/ui";
import { useState, type FormEvent } from "react";
import { useSendInvite } from "../lib/queries";

/** Emails a one-time invite link to the members app. */
export function InviteForm() {
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const invite = useSendInvite();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSentTo(null);
    invite.mutate(email, {
      onSuccess: () => {
        setSentTo(email);
        setEmail("");
      },
    });
  };

  return (
    <Card>
      <h2 className="font-display text-xl text-brand">Invite a member</h2>
      <p className="mt-1 mb-4 text-sm text-muted">
        They'll get an email with a one-time link to join the members app with Google. Inviting the
        same address again sends a fresh link.
      </p>
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          required
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
        />
        <Button type="submit" disabled={invite.isPending} className="shrink-0">
          {invite.isPending ? "Sending…" : "Send invite"}
        </Button>
      </form>
      <div className="mt-3">
        <ErrorText error={invite.error} />
        {sentTo && <p className="text-sm text-muted">Invite sent to {sentTo}.</p>}
      </div>
    </Card>
  );
}
