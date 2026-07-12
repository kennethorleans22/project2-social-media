// src/features/profile/queries.ts
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getMe, getMyPosts, getSavedPosts } from "./api";

export function useMe() {
  return useQuery({ queryKey: ["me"], queryFn: getMe });
}

function getNextPage(lastPage: {
  pagination: { page: number; totalPages: number };
}) {
  const { page, totalPages } = lastPage.pagination;
  return page < totalPages ? page + 1 : undefined;
}

export function useMyPosts() {
  return useInfiniteQuery({
    queryKey: ["me", "posts"],
    queryFn: ({ pageParam }) => getMyPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
  });
}

// Saved hanya di-fetch saat tab Saved dibuka (enabled).
export function useSavedPosts(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["me", "saved"],
    queryFn: ({ pageParam }) => getSavedPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
    enabled,
  });
}