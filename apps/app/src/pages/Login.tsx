import { Navigate, useSearchParams } from "react-router";
import { AuthCard } from "../components/AuthCard";
import { useMe } from "../hooks/useMe";

const errorMessages: Record<string, string> = {
  invite_required:
    "That Google account isn't a member yet. Ask a club admin for an invite, then open the link in the invite email.",
};

/** Sign-in page. Better Auth redirects back here with `?error=` when sign-in fails. */
export function Login() {
  const { data: me } = useMe();
  const [params] = useSearchParams();
  const code = params.get("error");

  if (me) return <Navigate to="/" replace />;

  return (
    <AuthCard
      title="Members area"
      error={code && (errorMessages[code] ?? "Sign-in didn't work. Please try again.")}
    >
      <p>Sign in with the Google account you used to accept your invite.</p>
      <p>New to the club? Membership is by invite only, so ask a club admin to send you one.</p>
    </AuthCard>
  );
}
