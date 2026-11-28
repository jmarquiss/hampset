import { useEffect, useId, useRef, type ReactNode } from 'react';

import { Button } from './Button';

/** A native modal dialog with keyboard dismissal, focus trapping and focus restoration. */
export function Modal({
  busy = false,
  children,
  onClose,
  title,
}: {
  busy?: boolean;
  children: ReactNode;
  onClose: () => void;
  title: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-busy={busy}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl border border-line bg-white p-6 text-ink shadow-xl backdrop:bg-brand/50"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          if (!busy) onClose();
        }
      }}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>
        <Button disabled={busy} size="sm" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
      {children}
    </dialog>
  );
}
