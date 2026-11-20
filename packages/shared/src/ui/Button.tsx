import type { ButtonHTMLAttributes, ElementType } from 'react';

import { cx, type AsProps } from './cx';

// Colours come from theme.css; edit the tokens there rather than the classes here.

/** Button colour schemes. The `light` ones are for dark-blue backgrounds. */
export type ButtonVariant = 'danger' | 'light' | 'outline-light' | 'primary' | 'secondary';
export type ButtonSize = 'lg' | 'md' | 'sm';

const variants: Record<ButtonVariant, string> = {
  danger: 'border border-danger text-danger hover:bg-danger hover:text-white',
  light: 'bg-accent text-brand hover:bg-white',
  'outline-light': 'border border-accent/60 text-white hover:bg-brand-light',
  primary: 'bg-brand text-white hover:bg-brand-light',
  secondary: 'border border-brand text-brand hover:bg-accent-light',
};

const sizes: Record<ButtonSize, string> = {
  lg: 'px-6 py-3',
  md: 'px-5 py-2 text-sm',
  sm: 'px-3 py-2 text-sm',
};

/** The class names for a button, for elements that can't use `Button` or `ButtonLink`. */
export const buttonClass = (
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) =>
  cx(
    'inline-flex items-center justify-center rounded-full text-center font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  );

interface StyleProps {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

/** A themed button; defaults to the primary dark-blue style. */
export function Button({
  className,
  size,
  type = 'button',
  variant,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & StyleProps) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

/** A link styled as a button. Renders an `<a>`, or pass `as={Link}` for a router link. */
export function ButtonLink<C extends ElementType = 'a'>({
  as,
  className,
  size,
  variant,
  ...props
}: AsProps<C, StyleProps>) {
  const Component: ElementType = as ?? 'a';
  return <Component className={buttonClass(variant, size, className)} {...props} />;
}
