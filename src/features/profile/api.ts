// src/features/profile/api.ts
import { api } from "@/lib/api-client";
import type { Post } from "@/features/posts/types";

export interface MyProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface MyStats {
  posts: number;
  followers: number;
  following: number;
  likes: number;
}

export interface MeResponse {
  profile: MyProfile;
  stats: MyStats;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PostsPage {
  items: Post[];
  pagination: Pagination;
}

export function getMe() {
  return api.get<MeResponse>("/api/me");
}

// Update profil (multipart: field yang berubah + `avatar` opsional).
// ⚠️ `phone` bisa 500 di backend → hanya dikirim kalau memang diubah.
export interface UpdatedProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
}
export function updateMe(fd: FormData): Promise<UpdatedProfile> {
  return api.patch<UpdatedProfile>("/api/me", fd);
}

// Gallery: post milik sendiri → data.items[]
export async function getMyPosts(page: number): Promise<PostsPage> {
  const data = await api.get<{ items: Post[]; pagination: Pagination }>(
    `/api/me/posts?page=${page}&limit=24`
  );
  return { items: data.items, pagination: data.pagination };
}

// Saved: → data.posts[] (kita samakan jadi `items`)
export async function getSavedPosts(page: number): Promise<PostsPage> {
  const data = await api.get<{ posts: Post[]; pagination: Pagination }>(
    `/api/me/saved?page=${page}&limit=24`
  );
  return { items: data.posts, pagination: data.pagination };
}