// src/features/posts/queries.ts
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useAppSelector } from "@/store";
import {
  getExplore,
  getPostLikers,
  getPost,
  getComments,
  createComment,
  deleteComment,
  createPost,
  getSavedIds,
  type CommentsResponse,
} from "./api";
import type { Comment } from "./types";

function getNextPage(lastPage: {
  pagination: { page: number; totalPages: number };
}) {
  const { page, totalPages } = lastPage.pagination;
  return page < totalPages ? page + 1 : undefined;
}

// Home = FYP: SELALU tampilkan semua post (/api/posts), bukan hanya following.
export function useTimeline() {
  const q = useInfiniteQuery({
    queryKey: ["explore"],
    queryFn: ({ pageParam }) => getExplore(pageParam),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
  });

  return {
    posts: q.data?.pages.flatMap((p) => p.items) ?? [],
    isLoading: q.isLoading,
    isError: q.isError,
    fetchNextPage: q.fetchNextPage,
    hasNextPage: q.hasNextPage,
    isFetchingNextPage: q.isFetchingNextPage,
  };
}

// Buat post → refresh timeline (post baru muncul paling atas) + profil.
export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { image: File; caption: string }) => createPost(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["explore"] });
      qc.invalidateQueries({ queryKey: ["me"] }); // stats + gallery /me
    },
  });
}

// Set id post tersimpan (dipakai SaveButton biar state save persist saat refresh).
export function useSavedIds() {
  return useQuery({
    queryKey: ["me", "saved-ids"],
    queryFn: getSavedIds,
    staleTime: 60_000,
  });
}

export function usePostLikers(postId: number, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["post-likers", postId],
    queryFn: ({ pageParam }) => getPostLikers(postId, pageParam),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
    enabled,
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
    enabled: Number.isFinite(id),
  });
}

export function useComments(postId: number) {
  return useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) => getComments(postId, pageParam),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
    enabled: Number.isFinite(postId),
  });
}

// Tambah komentar dengan optimistic (langsung tampil, lalu disinkron ke server).
export function useCreateComment(postId: number) {
  const qc = useQueryClient();
  const user = useAppSelector((s) => s.auth.user);

  return useMutation({
    mutationFn: (text: string) => createComment(postId, text),
    onMutate: async (text) => {
      await qc.cancelQueries({ queryKey: ["comments", postId] });
      const prev = qc.getQueryData<InfiniteData<CommentsResponse>>([
        "comments",
        postId,
      ]);
      if (prev && user) {
        const temp: Comment = {
          id: -Date.now(), // id sementara (negatif) sampai server balas
          text,
          createdAt: new Date().toISOString(),
          author: {
            id: user.id,
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
          },
        };
        qc.setQueryData<InfiniteData<CommentsResponse>>(["comments", postId], {
          ...prev,
          pages: prev.pages.map((p, i) =>
            i === 0 ? { ...p, comments: [temp, ...p.comments] } : p
          ),
        });
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["comments", postId], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["comments", postId] }),
  });
}

export function useDeleteComment(postId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onMutate: async (commentId) => {
      await qc.cancelQueries({ queryKey: ["comments", postId] });
      const prev = qc.getQueryData<InfiniteData<CommentsResponse>>([
        "comments",
        postId,
      ]);
      if (prev) {
        qc.setQueryData<InfiniteData<CommentsResponse>>(["comments", postId], {
          ...prev,
          pages: prev.pages.map((p) => ({
            ...p,
            comments: p.comments.filter((c) => c.id !== commentId),
          })),
        });
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["comments", postId], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["comments", postId] }),
  });
}