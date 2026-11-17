import { club } from "@club/shared/club";
import scorpion from "@club/shared/logo/scorpion-white.svg";
import { ErrorText, Loading } from "@club/shared/ui";
import { Navigate, Outlet } from "react-router";
import { useMe } from "../hooks/useMe";
import { authClient } from "../lib/auth";

/**
 * App shell for signed-in pages; redirects to /login when there's no session. Child routes get
 * the member through `useOutletContext<Me>()`.
 */
export function Layout() {
  const { data: me, isLoading, error } = useMe();

  if (isLoading || error)
    return <div className="p-8">{error ? <ErrorText error={error} /> : <Loading />}</div>;
  if (!me) return <Navigate to="/login" replace />;

  const signOut = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-brand text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <a
            href={import.meta.env.VITE_SITE_URL}
            className="flex items-center gap-3 font-display text-lg font-bold"
          >
            <img src={scorpion} alt="" className="h-8 w-auto" />
            {club.shortName}
          </a>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-accent sm:inline">{me.email}</span>
            <button
              onClick={signOut}
              className="rounded-full border border-accent/50 px-4 py-1 hover:bg-brand-light"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet context={me} />
      </main>
    </div>
  );
}
