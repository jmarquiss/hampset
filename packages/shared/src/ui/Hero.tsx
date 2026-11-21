import type { ReactNode } from 'react';

import { Container } from './Container';

/**
 * The dark-blue banner at the top of a landing page: an `eyebrow` line, the title, `children` as
 * the intro, `actions` (buttons) below, and an `image` beside it on wide screens.
 */
export function Hero({
  actions,
  children,
  eyebrow,
  image,
  title,
}: {
  actions?: ReactNode;
  children?: ReactNode;
  eyebrow?: ReactNode;
  image?: ReactNode;
  title: ReactNode;
}) {
  return (
    <section className="bg-brand text-white">
      <Container className="flex flex-col gap-8 py-12 sm:py-16 md:flex-row-reverse md:items-center md:justify-between md:py-20">
        {image ? <div className="shrink-0">{image}</div> : null}
        <div className="min-w-0">
          {eyebrow ? (
            <p className="mb-3 text-sm font-semibold tracking-widest text-accent uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-4xl text-balance sm:text-5xl">{title}</h1>
          {children ? <div className="mt-4 max-w-2xl text-lg text-accent">{children}</div> : null}
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </Container>
    </section>
  );
}
