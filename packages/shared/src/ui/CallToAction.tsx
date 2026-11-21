import type { ReactNode } from 'react';

/** A highlighted box with a title, body text and an action; the action drops below on phones. */
export function CallToAction({
  action,
  children,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  title: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 rounded-lg bg-accent-light p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="font-display text-2xl text-brand">{title}</h2>
        <div className="mt-2 leading-relaxed wrap-anywhere">{children}</div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </section>
  );
}
