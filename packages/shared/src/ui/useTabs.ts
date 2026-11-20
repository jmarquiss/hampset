import { useId, useRef, useState, type KeyboardEvent } from 'react';

const horizontalSteps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };
const allSteps: Record<string, number> = { ...horizontalSteps, ArrowDown: 1, ArrowUp: -1 };

/**
 * State and keyboard handling for a tab list of `length` tabs: only the selected tab is in the
 * tab order, the arrow keys move between tabs (wrapping round; up and down only when
 * `vertical`), and Home and End jump to the first and last tab. Spread `tabProps(i)` on each tab
 * and `panelProps(i)` on each panel.
 */
export function useTabs(length: number, vertical: boolean) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const current = Math.min(selected, length - 1);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const step = (vertical ? allSteps : horizontalSteps)[event.key];
    let next: number;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = length - 1;
    else if (step) next = (current + step + length) % length;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  };

  const tabProps = (i: number) => ({
    'aria-controls': `${id}-panel-${i}`,
    'aria-selected': i === current,
    id: `${id}-tab-${i}`,
    onClick: () => {
      setSelected(i);
    },
    onKeyDown,
    ref: (el: HTMLButtonElement | null) => {
      tabs.current[i] = el;
    },
    role: 'tab',
    tabIndex: i === current ? 0 : -1,
  });

  const panelProps = (i: number) => ({
    'aria-labelledby': `${id}-tab-${i}`,
    hidden: i !== current,
    id: `${id}-panel-${i}`,
    role: 'tabpanel',
  });

  return { current, panelProps, tabProps };
}
