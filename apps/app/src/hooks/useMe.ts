import { api, ApiError } from '@club/shared/api';
import { useQuery } from '@tanstack/react-query';

/** The signed-in user. Mirrors `Me` in worker/env.ts. */
export interface Me {
  email: string;
  id: string;
  name: string;
  status: 'active' | 'disabled' | 'pending';
}

/** The signed-in user, or null when signed out. */
export function useMe() {
  return useQuery({
    queryFn: async () => {
      try {
        return await api<Me>('/me');
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) return null;
        throw err;
      }
    },
    queryKey: ['me'],
    staleTime: 5 * 60 * 1000,
  });
}
