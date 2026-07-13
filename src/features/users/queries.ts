// src/features/users/queries.ts
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  searchUsers,
  getUserProfile,
  getUserPosts,
  getUserLikes,
} from "./api";

// Hook pencarian user. `enabled` = hanya jalan kalau query tidak kosong.
export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: () => searchUsers(query),
    enabled: query.trim().length > 0,
  });
}

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: ["user", username],
    queryFn: () => getUserProfile(username),
    enabled: !!username,
  });
}

function getNextPage(lastPage: {
  pagination: { page: number; totalPages: number };
}) {
  const { page, totalPages } = lastPage.pagination;
  return page < totalPages ? page + 1 : undefined;
}

export function useUserPosts(username: string) {
  return useInfiniteQuery({
    queryKey: ["user", username, "posts"],
    queryFn: ({ pageParam }) => getUserPosts(username, pageParam),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
    enabled: !!username,
  });
}

export function useUserLikes(username: string, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["user", username, "likes"],
    queryFn: ({ pageParam }) => getUserLikes(username, pageParam),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
    enabled: enabled && !!username,
  });
}