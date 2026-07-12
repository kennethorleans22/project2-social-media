// src/features/profile/queries.ts
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/authSlice";
import { getMe, getMyPosts, getSavedPosts, updateMe } from "./api";

export function useMe() {
  return useQuery({ queryKey: ["me"], queryFn: getMe });
}

// Update profil → sinkron ke Redux (navbar) + refetch /me.
export function useUpdateMe() {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (fd: FormData) => updateMe(fd),
    onSuccess: (p) => {
      dispatch(
        setUser({
          id: p.id,
          name: p.name,
          username: p.username,
          email: p.email,
          phone: p.phone,
          avatarUrl: p.avatarUrl,
        })
      );
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
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