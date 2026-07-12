// src/features/users/api.ts
import { api } from "@/lib/api-client";
import type { SearchedUser } from "./types";

export async function searchUsers(q: string): Promise<SearchedUser[]> {
  const data = await api.get<{ users: SearchedUser[] }>(
    `/api/users/search?q=${encodeURIComponent(q)}`
  );
  return data.users;
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