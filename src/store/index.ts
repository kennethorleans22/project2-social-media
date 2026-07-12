// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // slice lain menyusul di sini nanti
  },
});

// Tipe otomatis dari store — dipakai supaya hooks di bawah ber-tipe benar.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Versi ber-tipe dari useDispatch & useSelector.
// SELALU pakai dua ini di komponen, JANGAN yang polos dari react-redux.
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;