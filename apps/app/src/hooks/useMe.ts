import { api, ApiError } from '@club/shared/api';
import { useQuery } from '@tanstack/react-query';

import type { Me } from '../../worker/schemas/me.schema';

export type { Me };

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
