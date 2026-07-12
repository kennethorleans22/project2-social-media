// src/features/auth/api.ts
import { api } from "@/lib/api-client";
import type { User } from "./types";
import type { LoginInput, RegisterInput } from "./schema";

// Bentuk respons login & register (data-nya sama).
export interface AuthResponse {
  token: string;
  user: User;
}

// Bentuk respons GET /api/me.
interface MeResponse {
  profile: User & { createdAt: string };
  stats: { posts: number; followers: number; following: number; likes: number };
}

// Login: kirim email + password. auth=false karena belum punya token.
export function loginRequest(values: LoginInput) {
  return api.post<AuthResponse>("/api/auth/login", values, false);
}

// Register: API butuh `name` (kita pakai username) & TIDAK butuh confirmPassword.
export function registerRequest(values: RegisterInput) {
  return api.post<AuthResponse>(
    "/api/auth/register",
    {
      name: values.username, // display name default = username
      username: values.username,
      email: values.email,
      phone: values.phone,
      password: values.password,
    },
    false
  );
}

// Ambil profil user yang sedang login (dipakai untuk memulihkan sesi saat refresh).
export async function getMe(): Promise<User> {
  const data = await api.get<MeResponse>("/api/me");
  return data.profile;
}