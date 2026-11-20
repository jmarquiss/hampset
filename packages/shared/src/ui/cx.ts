import type { ComponentPropsWithoutRef, ElementType } from 'react';

/** Joins class names, skipping falsy ones. */
export const cx = (...c: (false | null | string | undefined)[]) => c.filter(Boolean).join(' ');

/**
 * Props for a component that renders as `as` (a tag name or a component such as react-router's
 * `Link`), accepting that element's props alongside its own.
 */
export type AsProps<C extends ElementType, P = object> = { as?: C } & Omit<
  ComponentPropsWithoutRef<C>,
  'as' | keyof P
> &
  P;
