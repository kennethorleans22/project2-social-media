// src/features/posts/api.ts
import { api } from "@/lib/api-client";
import type { Post, LikeUser, Comment } from "./types";
import type { Pagination } from "@/types/api";

export interface FeedResponse {
  items: Post[];
  pagination: Pagination;
}

export function getFeed(page: number, limit = 10): Promise<FeedResponse> {
  return api.get<FeedResponse>(`/api/feed?page=${page}&limit=${limit}`);
}

export async function getExplore(page: number, limit = 10): Promise<FeedResponse> {
  const data = await api.get<{ posts: Post[]; pagination: Pagination }>(
    `/api/posts?page=${page}&limit=${limit}`
  );
  return { items: data.posts, pagination: data.pagination };
}

// Detail 1 post
export function getPost(id: number): Promise<Post> {
  return api.get<Post>(`/api/posts/${id}`);
}

// Buat post baru (FormData: field `image` + `caption` — verified 12 Juli 2026)
export function createPost(input: {
  image: File;
  caption: string;
}): Promise<Post> {
  const fd = new FormData();
  fd.append("image", input.image);
  fd.append("caption", input.caption);
  return api.post<Post>("/api/posts", fd);
}

// --- Like ---
export interface LikeResult {
  liked: boolean;
  likeCount: number;
}
export function likePost(id: number): Promise<LikeResult> {
  return api.post<LikeResult>(`/api/posts/${id}/like`);
}
export function unlikePost(id: number): Promise<LikeResult> {
  return api.delete<LikeResult>(`/api/posts/${id}/like`);
}

// --- Likers ---
export interface LikersResponse {
  users: LikeUser[];
  pagination: Pagination;
}
export function getPostLikers(
  postId: number,
  page: number,
  limit = 20
): Promise<LikersResponse> {
  return api.get<LikersResponse>(
    `/api/posts/${postId}/likes?page=${page}&limit=${limit}`
  );
}

// --- Save ---
export interface SaveResult {
  saved: boolean;
}
export function savePost(id: number): Promise<SaveResult> {
  return api.post<SaveResult>(`/api/posts/${id}/save`);
}
export function unsavePost(id: number): Promise<SaveResult> {
  return api.delete<SaveResult>(`/api/posts/${id}/save`);
}

// Ambil SEMUA id post yang tersimpan (API post tak punya savedByMe →
// sumber kebenaran hanya /api/me/saved). Loop semua halaman.
export async function getSavedIds(): Promise<number[]> {
  const ids: number[] = [];
  let page = 1;
  for (;;) {
    const data = await api.get<{ posts: Post[]; pagination: Pagination }>(
      `/api/me/saved?page=${page}&limit=50`
    );
    ids.push(...data.posts.map((p) => p.id));
    if (data.posts.length === 0 || page >= data.pagination.totalPages) break;
    page += 1;
  }
  return ids;
}

// --- Comments ---
export interface CommentsResponse {
  comments: Comment[];
  pagination: Pagination;
}
export function getComments(
  postId: number,
  page: number,
  limit = 20
): Promise<CommentsResponse> {
  return api.get<CommentsResponse>(
    `/api/posts/${postId}/comments?page=${page}&limit=${limit}`
  );
}
export function createComment(postId: number, text: string): Promise<Comment> {
  return api.post<Comment>(`/api/posts/${postId}/comments`, { text });
}
export function deleteComment(commentId: number): Promise<{ deleted: boolean }> {
  return api.delete<{ deleted: boolean }>(`/api/comments/${commentId}`);
}