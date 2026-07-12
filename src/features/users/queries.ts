// src/features/users/queries.ts
import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "./api";

// Hook pencarian user. `enabled` = hanya jalan kalau query tidak kosong.
export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: () => searchUsers(query),
    enabled: query.trim().length > 0,
  });
}