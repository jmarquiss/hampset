import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MemberModal } from './MemberModal';

const mutate = vi.fn();
const state = { error: null as Error | null, isPending: false, mutate };
vi.mock('../lib/queries', () => ({
  formatDate: () => '28 Nov 2026',
  useMemberRoles: () => state,
}));
const member = {
  createdAt: '2026-11-28T12:00:00Z',
  email: 'member@example.com',
  id: 'member-123',
  name: 'Test Member',
  roles: [],
  status: 'active',
} as const;

beforeEach(() => {
  state.error = null;
  state.isPending = false;
  mutate.mockReset();
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    },
  });
});
afterEach(cleanup);

describe('Member role modal', () => {
  it('shows all user details and saves only after Save is clicked', async () => {
    const onClose = vi.fn();
    render(<MemberModal member={{ ...member, roles: [] }} onClose={onClose} />);
    for (const value of [
      'Test Member',
      'member@example.com',
      'member-123',
      'active',
      '28 Nov 2026',
    ]) {
      expect(screen.getByText(value)).toBeTruthy();
    }
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Save' }).disabled).toBe(true);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Coach' }));
    expect(mutate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mutate).toHaveBeenCalledWith(
      { id: member.id, roles: ['coach'] },
      { onSuccess: onClose },
    );
    expect(onClose).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());
  });

  it('discards changes on Cancel and starts with persisted roles when reopened', () => {
    const onClose = vi.fn();
    const view = render(<MemberModal member={{ ...member, roles: ['coach'] }} onClose={onClose} />);
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(mutate).not.toHaveBeenCalled();
    view.unmount();
    render(<MemberModal member={{ ...member, roles: ['coach'] }} onClose={onClose} />);
    expect(screen.getByRole<HTMLInputElement>('checkbox').checked).toBe(true);
  });

  it('shows save errors and blocks dismissal while saving', () => {
    const onClose = vi.fn();
    state.error = new Error('Could not save roles');
    state.isPending = true;
    render(<MemberModal member={{ ...member, roles: [] }} onClose={onClose} />);
    expect(screen.getByRole('alert').textContent).toBe('Could not save roles');
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Close' }).disabled).toBe(true);
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('dismisses on Escape when idle', () => {
    const onClose = vi.fn();
    render(<MemberModal member={{ ...member, roles: [] }} onClose={onClose} />);
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
