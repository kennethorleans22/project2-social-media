// src/features/posts/components/save-button.tsx
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@/components/shared/icon";
import { savePost, unsavePost } from "../api";
import { useSavedIds } from "../queries";

export function SaveButton({ postId }: { postId: number }) {
  const qc = useQueryClient();
  const { data: savedIds } = useSavedIds();

  // Kebenaran dari server (daftar saved). Override lokal utk optimistic.
  const serverSaved = savedIds?.includes(postId) ?? false;
  const [override, setOverride] = useState<boolean | null>(null);
  const saved = override ?? serverSaved;

  const mutation = useMutation({
    mutationFn: (next: boolean) =>
      next ? savePost(postId) : unsavePost(postId),
    onSuccess: (data) => {
      setOverride(data.saved);
      // Sinkron: daftar saved-ids + tab Saved di /me ikut ter-update.
      qc.invalidateQueries({ queryKey: ["me", "saved-ids"] });
      qc.invalidateQueries({ queryKey: ["me", "saved"] });
    },
    onError: () => setOverride(null), // rollback ke state server
  });

  function toggle() {
    if (mutation.isPending) return;
    const next = !saved;
    setOverride(next); // optimistic
    mutation.mutate(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={saved ? "Unsave" : "Save"}
      aria-pressed={saved}
    >
      <Icon
        src={saved ? "/icons/save-fill.svg" : "/icons/save-outline.svg"}
        className="h-6 w-6"
      />
    </button>
  );
}