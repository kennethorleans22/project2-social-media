// src/components/auth-initializer.tsx
"use client";

import { useEffect } from "react";
import { getToken, clearToken } from "@/lib/api-client";
import { useAppDispatch } from "@/store";
import { setUser, setInitialized } from "@/store/authSlice";
import { getMe } from "@/features/auth/api";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getToken();

    // Tidak ada token → jelas belum login, selesai.
    if (!token) {
      dispatch(setInitialized(true));
      return;
    }

    // Ada token → coba ambil profil. Kalau token valid, user dipulihkan.
    getMe()
      .then((user) => dispatch(setUser(user)))
      .catch(() => clearToken()) // token invalid/kadaluarsa → buang
      .finally(() => dispatch(setInitialized(true)));
  }, [dispatch]);

  return null; // tidak merender apa pun
}