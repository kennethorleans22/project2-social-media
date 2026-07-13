// src/features/users/api.ts
import { api } from "@/lib/api-client";
import type { SearchedUser } from "./types";
import type { Post } from "@/features/posts/types";

export async function searchUsers(q: string): Promise<SearchedUser[]> {
  const data = await api.get<{ users: SearchedUser[] }>(
    `/api/users/search?q=${encodeURIComponent(q)}`
  );
  return data.users;
}

// --- Profil publik (user lain) ---
export interface PublicProfile {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  email: string;
  phone: string | null;
  // ⚠️ QUIRK: di sini `post` singular (beda dgn /api/me stats.posts)
  counts: { post: number; followers: number; following: number; likes: number };
  isFollowing: boolean;
  isMe: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface UserPostsPage {
  items: Post[];
  pagination: Pagination;
}

export function getUserProfile(username: string): Promise<PublicProfile> {
  return api.get<PublicProfile>(`/api/users/${username}`);
}

// Gallery user → data.posts[]
export async function getUserPosts(
  username: string,
  page: number
): Promise<UserPostsPage> {
  const data = await api.get<{ posts: Post[]; pagination: Pagination }>(
    `/api/users/${username}/posts?page=${page}&limit=24`
  );
  return { items: data.posts, pagination: data.pagination };
}

// Post yang di-like user → data.posts[]
export async function getUserLikes(
  username: string,
  page: number
): Promise<UserPostsPage> {
  const data = await api.get<{ posts: Post[]; pagination: Pagination }>(
    `/api/users/${username}/likes?page=${page}&limit=24`
  );
  return { items: data.posts, pagination: data.pagination };
}

// --- Follow (idempotent) ---
export interface FollowResult {
  following: boolean;
}
export function followUser(username: string): Promise<FollowResult> {
  return api.post<FollowResult>(`/api/follow/${username}`);
}
export function unfollowUser(username: string): Promise<FollowResult> {
  return api.delete<FollowResult>(`/api/follow/${username}`);
}