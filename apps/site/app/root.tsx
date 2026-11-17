import { club } from "@club/shared/club";
import touchIcon from "@club/shared/logo/apple-touch-icon.png";
import icon from "@club/shared/logo/icon.svg";
import scorpion from "@club/shared/logo/scorpion-white.svg";
import type { ReactNode } from "react";
import { Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./app.css";

// The logo links home too, so phones skip the Home link to keep the header on one row.
const nav = [
  { to: "/", label: "Home", className: "hidden sm:block" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

/** The HTML document shared by every page. */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className="scroll-pt-20">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={icon} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={touchIcon} />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/** Header, page content and footer. */
export default function App() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-brand text-white shadow-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-4">
          <NavLink
            to="/"
            className="flex items-center gap-3 font-display text-xl font-bold tracking-wide whitespace-nowrap"
          >
            <img src={scorpion} alt="" className="h-7 w-auto sm:h-9" />
            <span className="sr-only sm:not-sr-only">{club.shortName}</span>
          </NavLink>
          <nav className="flex items-center gap-1 text-sm">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `rounded-full px-2.5 py-2 hover:bg-brand-light sm:px-4 ${item.className ?? ""} ${isActive ? "bg-brand-light" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={import.meta.env.VITE_APP_URL}
              className="ml-1 rounded-full bg-accent px-3 py-2 font-semibold text-brand hover:bg-white sm:ml-2 sm:px-4"
            >
              Members
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-brand text-sm text-accent">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-6">
          <span className="flex items-center gap-3">
            <img src={scorpion} alt="" className="h-7 w-auto" />© {club.name}, founded{" "}
            {club.founded}
          </span>
          <a href={`mailto:${club.email}`} className="hover:text-white">
            {club.email}
          </a>
        </div>
      </footer>
    </>
  );
}
