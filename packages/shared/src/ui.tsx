import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

// Colours come from theme.css; edit the tokens there rather than the classes here.

type Variant = "primary" | "secondary" | "danger";
const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-light",
  secondary: "border border-brand text-brand hover:bg-accent-light",
  danger: "border border-danger text-danger hover:bg-danger hover:text-white",
};

/** A themed button; defaults to the primary dark-blue style. */
export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cx(
        "rounded-full px-5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

/** A white panel with a border. */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-lg border border-line bg-white p-5 shadow-sm", className)}>
      {children}
    </div>
  );
}

/** A themed text input. */
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        "w-full rounded-full border border-line bg-white px-4 py-2 focus:border-brand focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

/** A page heading. */
export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="mb-6 font-display text-3xl text-brand">{children}</h1>;
}

/** Shows an error's message, or nothing when there's no error. */
export function ErrorText({ error }: { error: unknown }) {
  if (!error) return null;
  return (
    <p role="alert" className="rounded bg-danger/10 p-3 text-sm text-danger">
      {error instanceof Error ? error.message : String(error)}
    </p>
  );
}

/** A loading placeholder. */
export function Loading() {
  return <p className="text-muted">Loading…</p>;
}

/** A placeholder for an empty list. */
export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded border border-dashed border-line p-6 text-center text-muted">
      {children}
    </p>
  );
}
