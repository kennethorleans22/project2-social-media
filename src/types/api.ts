// src/types/api.ts

// Amplop yang membungkus SEMUA respons API Sociality.
// Contoh: { success: true, message: "OK", data: {...} }
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

// Info halaman untuk endpoint yang paginated (feed, comments, dll).
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}