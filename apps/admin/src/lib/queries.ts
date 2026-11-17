import { api } from "@club/shared/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Member {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Invite {
  id: string;
  email: string;
  expiresAt: string;
  createdAt: string;
}

/** Formats an ISO timestamp as a UK date, e.g. "17 Nov 2026". */
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export const useMembers = () =>
  useQuery({ queryKey: ["members"], queryFn: () => api<Member[]>("/members") });

export const useInvites = () =>
  useQuery({ queryKey: ["invites"], queryFn: () => api<Invite[]>("/invites") });

/** A mutation that refreshes the given list queries when it succeeds. */
function useApiMutation<T>(fn: (arg: T) => Promise<unknown>, refresh: string[]) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () =>
      Promise.all(refresh.map((key) => queryClient.invalidateQueries({ queryKey: [key] }))),
  });
}

export const useSendInvite = () =>
  useApiMutation((email: string) => api("/invites", { body: { email } }), ["invites"]);

export const useRevokeInvite = () =>
  useApiMutation((id: string) => api(`/invites/${id}`, { method: "DELETE" }), ["invites"]);

export const useRemoveMember = () =>
  useApiMutation((id: string) => api(`/members/${id}`, { method: "DELETE" }), ["members"]);
