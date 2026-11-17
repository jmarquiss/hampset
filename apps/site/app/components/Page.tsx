import { club } from "@club/shared/club";
import type { ReactNode } from "react";

/** A page banner with a title and optional intro, followed by the page content. */
export function Page({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <section className="border-b border-line bg-accent-light">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="font-display text-4xl text-brand">{title}</h1>
          {intro && <p className="mt-3 max-w-2xl text-lg text-muted">{intro}</p>}
        </div>
      </section>
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12">{children}</div>
    </>
  );
}

/** A titled block of content within a page. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-2xl text-brand">{title}</h2>
      <div className="space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}

/** Title, description and link-preview tags for a page. Pass no title for the home page. */
export function pageMeta(title: string | null, description: string) {
  const fullTitle = title ? `${title} | ${club.name}` : club.name;
  return [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
  ];
}
