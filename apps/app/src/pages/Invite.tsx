import { club } from "@club/shared/club";
import { Navigate, useParams } from "react-router";
import { AuthCard } from "../components/AuthCard";
import { useMe } from "../hooks/useMe";

/** Landing page for the link in an invite email. */
export function Invite() {
  const { token } = useParams();
  const { data: me } = useMe();

  if (me) return <Navigate to="/" replace />;

  return (
    <AuthCard title={`Join ${club.shortName}`} inviteToken={token}>
      <p>You've been invited to the {club.name} members area.</p>
      <p>
        Continue with Google to accept. The Google account you choose becomes your login, and the
        invite can only be used once.
      </p>
    </AuthCard>
  );
}
