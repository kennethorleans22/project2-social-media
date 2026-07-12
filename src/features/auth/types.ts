// src/features/auth/types.ts

// Bentuk user — diverifikasi langsung dari respons register/login & /api/me.
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
}