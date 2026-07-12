// src/features/posts/components/post-modal.tsx
"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { Icon } from "@/components/shared/icon";
import { UserAvatar } from "@/components/shared/user-avatar";
import { formatRelativeTime } from "@/lib/format";
import { usePost } from "../queries";
import { LikeButton } from "./like-button";
import { SaveButton } from "./save-button";
import { CommentsSection } from "./comments-section";

export function PostModal({
  postId,
  onClose,
}: {
  postId: number;
  onClose: () => void;
}) {
  const { data: post } = usePost(postId);

  return (
    // Overlay gelap — klik area gelap = tutup
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-neutral-950/80 lg:items-center lg:p-4"
    >
      {/* Wadah: mobile = kolom (X + sheet), desktop = card 1 baris */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full flex-col lg:h-180 lg:max-h-[85vh] lg:max-w-300 lg:flex-row lg:overflow-hidden lg:bg-neutral-950"
      >
        {/* X untuk MOBILE — di atas sheet, di area gelap (bukan di dalam sheet) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="mb-2 self-end pr-4 text-white lg:hidden"
        >
          <X size={24} />
        </button>

        {/* Gambar — DESKTOP ONLY (di mobile gambar = timeline di belakang) */}
        <div className="hidden shrink-0 lg:block lg:h-full lg:w-180">
          {post && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Panel komentar — mobile = SHEET bawah, desktop = kolom kanan */}
        <div className="flex max-h-[80dvh] w-full flex-col gap-4 overflow-y-auto rounded-t-2xl bg-neutral-950 p-4 lg:max-h-none lg:w-120 lg:shrink-0 lg:rounded-none lg:p-5">
          {/* Header + caption + aksi — DESKTOP ONLY */}
          {post && (
            <div className="hidden flex-col gap-4 lg:flex">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/profile/${post.author.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3"
                >
                  <UserAvatar
                    src={post.author.avatarUrl}
                    name={post.author.name}
                    className="h-10 w-10"
                  />
                  <div className="flex flex-col">
                    <span className="text-body-sm font-bold text-white">
                      {post.author.name}
                    </span>
                    <span className="text-body-xs text-neutral-400">
                      {formatRelativeTime(post.createdAt)}
                    </span>
                  </div>
                </Link>
                {/* X desktop */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="shrink-0 text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Caption */}
              <p className="whitespace-pre-line text-body-sm text-white">
                {post.caption}
              </p>

              {/* Aksi */}
              <div className="flex items-center justify-between border-y border-neutral-900 py-3">
                <div className="flex items-center gap-4">
                  <LikeButton
                    postId={post.id}
                    initialLiked={post.likedByMe}
                    initialCount={post.likeCount}
                  />
                  <div className="flex items-center gap-1.5">
                    <Icon src="/icons/comment.svg" className="h-6 w-6" />
                    <span className="text-body-sm font-semibold text-white">
                      {post.commentCount}
                    </span>
                  </div>
                  <button type="button" aria-label="Share">
                    <Icon src="/icons/share.svg" className="h-6 w-6" />
                  </button>
                </div>
                <SaveButton postId={post.id} />
              </div>
            </div>
          )}

          {/* Komentar — SELALU tampil (mobile & desktop) */}
          <CommentsSection postId={postId} />
        </div>
      </div>
    </div>
  );
}