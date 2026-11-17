import { api, ApiError } from "@club/shared/api";
import { useQuery } from "@tanstack/react-query";

/** The signed-in member. Mirrors `Me` in worker/env.ts. */
export interface Me {
  id: string;
  name: string;
  email: string;
}

/** The signed-in member, or null when signed out. */
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await api<Me>("/me");
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) return null;
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}
