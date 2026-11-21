import {
  createContext,
  use,
  useEffect,
  useId,
  useRef,
  useState,
  type ElementType,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { Container } from './Container';
import { cx, type AsProps } from './cx';

const CloseMenuContext = createContext<() => void>(() => undefined);

/**
 * The dark-blue bar at the top of every app: `brand` on the left, then `links` (`NavItem`s) and
 * `actions` on the right. On phones the links move into a menu opened by a button beside the
 * actions; picking a link or pressing Escape closes it.
 */
export function Navbar({
  actions,
  brand,
  links,
  sticky = false,
}: {
  actions?: ReactNode;
  brand: ReactNode;
  links?: ReactNode;
  sticky?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    <header
      className={cx('z-50 bg-brand text-white', sticky ? 'sticky top-0 shadow-md' : 'relative')}
    >
      <Container className="flex items-center gap-2 py-3">
        <div className="mr-auto min-w-0">{brand}</div>
        {links ? (
          <>
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => {
                setOpen(!open);
              }}
              className="order-last rounded-full p-2 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-accent sm:hidden"
            >
              <span className="sr-only">Menu</span>
              <svg aria-hidden viewBox="0 0 24 24" className="size-6 stroke-current" fill="none">
                <path
                  strokeLinecap="round"
                  strokeWidth="2"
                  d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'}
                />
              </svg>
            </button>
            <nav
              ref={navRef}
              id={menuId}
              aria-label="Main"
              className={cx(
                open ? 'flex' : 'hidden',
                'max-sm:absolute max-sm:inset-x-0 max-sm:top-full max-sm:flex-col max-sm:gap-1 max-sm:border-t max-sm:border-brand-light max-sm:bg-brand max-sm:px-4 max-sm:py-3 max-sm:shadow-md sm:flex sm:items-center sm:gap-1',
              )}
            >
              <CloseMenuContext
                value={() => {
                  setOpen(false);
                }}
              >
                {links}
              </CloseMenuContext>
            </nav>
          </>
        ) : null}
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </Container>
    </header>
  );
}

/**
 * A link in a `Navbar`, highlighted when it has `aria-current="page"` (as react-router's
 * `NavLink` sets). Renders an `<a>`, or pass `as={NavLink}`.
 */
export function NavItem<C extends ElementType = 'a'>({
  as,
  className,
  onClick,
  ...props
}: AsProps<C, { className?: string; onClick?: (event: MouseEvent<HTMLAnchorElement>) => void }>) {
  const closeMenu = use(CloseMenuContext);
  const Component: ElementType = as ?? 'a';
  return (
    <Component
      className={cx(
        'rounded-lg px-3 py-2 whitespace-nowrap hover:bg-brand-light aria-[current=page]:bg-brand-light sm:rounded-full sm:text-sm',
        className,
      )}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        closeMenu();
      }}
      {...props}
    />
  );
}

/** The club logo and name for a header. Renders a `<span>`, or pass `as="a"` or `as={Link}`. */
export function Brand<C extends ElementType = 'span'>({
  as,
  children,
  className,
  logo,
  ...props
}: AsProps<C, { children: ReactNode; className?: string; logo: string }>) {
  const Component: ElementType = as ?? 'span';
  return (
    <Component
      className={cx(
        'flex items-center gap-3 font-display text-lg font-bold whitespace-nowrap',
        className,
      )}
      {...props}
    >
      <img src={logo} alt="" className="h-8 w-auto" />
      {children}
    </Component>
  );
}
