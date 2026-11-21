import type { ReactNode } from 'react';

import { Container } from './Container';
import { Prose } from './Prose';

/** A page heading for app pages. */
export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="mb-6 font-display text-3xl text-brand">{children}</h1>;
}

/** A page with a title banner, followed by the page content in a `Container`. */
export function Page({
  children,
  intro,
  title,
}: {
  children: ReactNode;
  intro?: ReactNode;
  title: ReactNode;
}) {
  return (
    <>
      <section className="border-b border-line bg-accent-light">
        <Container className="py-10 sm:py-12">
          <h1 className="font-display text-3xl text-brand sm:text-4xl">{title}</h1>
          {intro ? <p className="mt-3 max-w-2xl text-lg text-muted">{intro}</p> : null}
        </Container>
      </section>
      <Container className="space-y-10 py-10 sm:py-12">{children}</Container>
    </>
  );
}

/** A titled block of content within a page. */
export function Section({
  children,
  className,
  title,
}: {
  children: ReactNode;
  className?: string;
  title: ReactNode;
}) {
  return (
    <section className={className}>
      <h2 className="mb-3 font-display text-2xl text-brand sm:text-3xl">{title}</h2>
      <Prose>{children}</Prose>
    </section>
  );
}
