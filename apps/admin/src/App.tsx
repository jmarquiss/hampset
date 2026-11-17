import { club } from "@club/shared/club";
import scorpion from "@club/shared/logo/scorpion-white.svg";
import { InviteForm } from "./components/InviteForm";
import { InviteList } from "./components/InviteList";
import { MemberList } from "./components/MemberList";

/** The admin dashboard: invite people to the members app and manage existing members. */
export function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-brand text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="flex items-center gap-3 font-display text-lg font-bold">
            <img src={scorpion} alt="" className="h-8 w-auto" />
            <span>
              {club.shortName} <span className="text-accent">Admin</span>
            </span>
          </span>
          <nav className="flex items-center gap-4 text-sm text-accent">
            <a href={import.meta.env.VITE_SITE_URL} className="hover:text-white">
              Website
            </a>
            <a href={import.meta.env.VITE_APP_URL} className="hover:text-white">
              Members app
            </a>
            {/* Ends the Cloudflare Access session. */}
            <a href="/cdn-cgi/access/logout" className="hover:text-white">
              Sign out
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-8">
        <InviteForm />
        <InviteList />
        <MemberList />
      </main>
    </div>
  );
}
