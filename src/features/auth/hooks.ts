// src/features/auth/hooks.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { setToken } from "@/lib/api-client";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/authSlice";
import { loginRequest, registerRequest, type AuthResponse } from "./api";
import type { LoginInput, RegisterInput } from "./schema";

// Dipakai setelah login/register sukses: simpan sesi lalu pindah ke /feed.
function useAuthSuccess() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (data: AuthResponse) => {
    setToken(data.token); // simpan token ke localStorage
    dispatch(setUser(data.user)); // taruh user di Redux
    router.push("/feed"); // arahkan ke halaman utama
  };
}

export function useLogin() {
  const onAuthSuccess = useAuthSuccess();
  return useMutation({
    mutationFn: (values: LoginInput) => loginRequest(values),
    onSuccess: onAuthSuccess,
  });
}

export function useRegister() {
  const onAuthSuccess = useAuthSuccess();
  return useMutation({
    mutationFn: (values: RegisterInput) => registerRequest(values),
    onSuccess: onAuthSuccess, // register langsung login (sesuai acceptance dosen)
  });
}