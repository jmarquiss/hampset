import { api } from '@club/shared/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Member {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  status: 'active' | 'disabled' | 'pending';
}

/** Something an admin can do to a member; also the action recorded in the audit log. */
export type MemberAction = 'approve' | 'delete' | 'disable' | 'enable';

export interface AuditEntry {
  action: MemberAction;
  actorEmail: string;
  createdAt: string;
  id: number;
  targetEmail: string;
}

/** Formats an ISO timestamp as a UK date, e.g. "17 Nov 2026". */
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const useMembers = () =>
  useQuery({ queryFn: () => api<Member[]>('/members'), queryKey: ['members'] });

export const useAudit = () =>
  useQuery({ queryFn: () => api<AuditEntry[]>('/audit'), queryKey: ['audit'] });

/**
 * Applies an action to a member, then refreshes the member list and audit log, whether or not it
 * worked: a failure (say, another admin got there first) usually means the lists are stale.
 */
export function useMemberAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ action, id }: { action: MemberAction; id: string }) =>
      action === 'delete'
        ? api(`/members/${id}`, { method: 'DELETE' })
        : api(`/members/${id}/${action}`, { method: 'POST' }),
    onSettled: () =>
      Promise.all(
        ['members', 'audit'].map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
      ),
  });
}
