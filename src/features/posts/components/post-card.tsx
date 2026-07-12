// src/features/posts/components/post-card.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/icon";
import { UserAvatar } from "@/components/shared/user-avatar";
import { formatRelativeTime } from "@/lib/format";
import { useOpenPost } from "../post-modal-context";
import { LikeButton } from "./like-button";
import { SaveButton } from "./save-button";
import type { Post } from "../types";

export function PostCard({ post }: { post: Post }) {
  const [expanded, setExpanded] = useState(false);
  const openPost = useOpenPost();

  return (
    <article className="flex flex-col gap-2 lg:gap-3">
      {/* Header */}
      <div className="flex items-center gap-2 lg:gap-3">
        <Link href={`/profile/${post.author.username}`}>
          <UserAvatar
            src={post.author.avatarUrl}
            name={post.author.name}
            className="h-11 w-11 lg:h-16 lg:w-16"
          />
        </Link>
        <div className="flex flex-col">
          <Link
            href={`/profile/${post.author.username}`}
            className="text-body-sm font-bold tracking-tight text-white lg:text-body-md"
          >
            {post.author.username}
          </Link>
          <span className="text-body-xs text-neutral-400 lg:text-body-sm">
            {formatRelativeTime(post.createdAt)}
          </span>
        </div>
      </div>

      {/* Gambar → buka popup komentar */}
      <button
        type="button"
        onClick={() => openPost(post.id)}
        className="w-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="aspect-square w-full rounded-md object-cover"
        />
      </button>

      {/* Aksi */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-4">
          <LikeButton
            postId={post.id}
            initialLiked={post.likedByMe}
            initialCount={post.likeCount}
          />

          {/* Komentar → buka popup */}
          <button
            type="button"
            onClick={() => openPost(post.id)}
            className="flex items-center gap-1.5"
          >
            <Icon src="/icons/comment.svg" className="h-6 w-6" />
            <span className="text-body-sm font-semibold tracking-tight text-white lg:text-body-md">
              {post.commentCount}
            </span>
          </button>

          {/* Share — dummy */}
          <button type="button" aria-label="Share" className="flex items-center">
            <Icon src="/icons/share.svg" className="h-6 w-6" />
          </button>
        </div>

        {/* Save — interaktif */}
        <SaveButton postId={post.id} />
      </div>

      {/* Caption */}
      <div className="flex flex-col">
        <span className="text-body-sm font-bold tracking-tight text-white lg:text-body-md">
          {post.author.username}
        </span>
        <p
          className={cn(
            "whitespace-pre-line text-body-sm tracking-tight text-white lg:text-body-md",
            !expanded && "line-clamp-2"
          )}
        >
          {post.caption}
        </p>
        {post.caption && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="self-start text-body-sm font-bold tracking-tight text-primary-200 lg:text-body-md lg:font-semibold"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {/* Pemisah */}
      <div className="mt-1 h-px w-full bg-neutral-900" />
    </article>
  );
}