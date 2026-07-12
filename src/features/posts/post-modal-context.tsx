// src/features/posts/post-modal-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { PostModal } from "./components/post-modal";

// Context menyimpan 1 fungsi: openPost(id) untuk membuka popup komentar.
const OpenPostContext = createContext<(id: number) => void>(() => {});

export function useOpenPost() {
  return useContext(OpenPostContext);
}

export function PostModalProvider({ children }: { children: React.ReactNode }) {
  const [postId, setPostId] = useState<number | null>(null);

  const open = useCallback((id: number) => setPostId(id), []);
  const close = useCallback(() => setPostId(null), []);

  // Saat modal terbuka: kunci scroll body + tutup dengan tombol Escape.
  useEffect(() => {
    if (postId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [postId, close]);

  return (
    <OpenPostContext.Provider value={open}>
      {children}
      {postId !== null && <PostModal postId={postId} onClose={close} />}
    </OpenPostContext.Provider>
  );
}