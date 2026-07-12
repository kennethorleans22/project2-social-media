// src/features/auth/guards.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";

// Loader kecil selagi kita mengecek sesi (biar tidak "kedip" salah halaman).
function FullScreenLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-body-md text-neutral-500">
      Loading...
    </div>
  );
}

// Bungkus halaman PRIVAT. Kalau belum login → tendang ke /login.
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAppSelector((s) => s.auth);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !user) router.replace("/login");
  }, [isInitialized, user, router]);

  if (!isInitialized) return <FullScreenLoading />; // masih cek token
  if (!user) return null; // sedang diarahkan ke /login
  return <>{children}</>;
}

// Bungkus halaman LOGIN/REGISTER. Kalau SUDAH login → lempar ke /feed.
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAppSelector((s) => s.auth);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && user) router.replace("/feed");
  }, [isInitialized, user, router]);

  if (!isInitialized) return null; // masih cek token
  if (user) return null; // sedang diarahkan ke /feed
  return <>{children}</>;
}