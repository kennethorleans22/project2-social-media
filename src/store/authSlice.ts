// src/store/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/features/auth/types";

interface AuthState {
  user: User | null;
  // Sudah selesai cek sesi awal (dari token tersimpan) belum?
  // Berguna supaya UI tidak "kedip" ke halaman login sebelum sempat cek token.
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set/ganti user yang sedang login (dipakai saat login & saat load /api/me).
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    // Tandai bahwa pengecekan sesi awal sudah selesai.
    setInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload;
    },
    // Kosongkan user saat logout.
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, setInitialized, logout } = authSlice.actions;
export default authSlice.reducer;