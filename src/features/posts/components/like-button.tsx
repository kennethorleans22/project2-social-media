// src/features/posts/components/like-button.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Icon } from "@/components/shared/icon";
import { likePost, unlikePost } from "../api";
import { LikedByModal } from "./liked-by-modal";

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
}: {
  postId: number;
  initialLiked: boolean;
  initialCount: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [modalOpen, setModalOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (nextLiked: boolean) =>
      nextLiked ? likePost(postId) : unlikePost(postId),
  });

  function toggle() {
    if (mutation.isPending) return;
    const prevLiked = liked;
    const prevCount = count;
    const next = !prevLiked;

    setLiked(next);
    setCount(prevCount + (next ? 1 : -1));

    mutation.mutate(next, {
      onSuccess: (data) => {
        setLiked(data.liked);
        setCount(data.likeCount);
      },
      onError: () => {
        setLiked(prevLiked);
        setCount(prevCount);
      },
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* Hati → toggle like */}
      <button
        type="button"
        onClick={toggle}
        aria-label={liked ? "Unlike" : "Like"}
        aria-pressed={liked}
      >
        <Icon
          src={liked ? "/icons/heart-fill.svg" : "/icons/heart-outline.svg"}
          className="h-6 w-6"
        />
      </button>

      {/* Angka → buka modal "siapa yang like" */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="text-body-sm font-semibold tracking-tight text-white lg:text-body-md"
      >
        {count}
      </button>

      <LikedByModal
        postId={postId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}