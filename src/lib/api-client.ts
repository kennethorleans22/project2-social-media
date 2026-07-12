// src/lib/api-client.ts
import type { ApiEnvelope } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Kunci penyimpanan token di localStorage.
const TOKEN_KEY = "sociality_token";

// --- Pengelolaan token (dipakai saat login/logout) ---
export function getToken(): string | null {
  // localStorage cuma ada di browser. Di server (Next.js) window = undefined,
  // jadi kita jaga supaya tidak error.
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Error khusus API supaya di UI kita bisa tahu pesan + status code-nya.
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown; // object → dikirim sebagai JSON; FormData → dikirim apa adanya
  auth?: boolean; // pasang Authorization Bearer token? default: true
};

// Fungsi inti: semua request lewat sini.
export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = {};
  const isFormData = body instanceof FormData;

  // Kalau body JSON biasa, kasih tahu server ini JSON.
  // Kalau FormData (upload gambar), JANGAN set Content-Type manual —
  // browser akan mengaturnya sendiri lengkap dengan "boundary".
  if (body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Pasang token otomatis untuk request privat.
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
  });

  // Coba baca JSON. Kalau server balas non-JSON, biarkan null.
  let json: ApiEnvelope<T> | null = null;
  try {
    json = (await res.json()) as ApiEnvelope<T>;
  } catch {
    json = null;
  }

  // Anggap gagal kalau status HTTP error ATAU envelope success=false.
  if (!res.ok || !json?.success) {
    const message = json?.message || `Request gagal (${res.status})`;
    throw new ApiError(message, res.status);
  }

  // Buka amplop: kembalikan langsung isi "data".
  return json.data;
}

// Pintasan biar pemanggilan lebih ringkas di feature nanti.
export const api = {
  get: <T>(path: string, auth = true) => apiFetch<T>(path, { method: "GET", auth }),
  post: <T>(path: string, body?: unknown, auth = true) =>
    apiFetch<T>(path, { method: "POST", body, auth }),
  patch: <T>(path: string, body?: unknown, auth = true) =>
    apiFetch<T>(path, { method: "PATCH", body, auth }),
  delete: <T>(path: string, auth = true) => apiFetch<T>(path, { method: "DELETE", auth }),
};