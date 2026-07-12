// src/app/(main)/posts/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { Icon } from "@/components/shared/icon";
import { UserAvatar } from "@/components/shared/user-avatar";
import { formatRelativeTime } from "@/lib/format";
import { usePost } from "@/features/posts/queries";
import { LikeButton } from "@/features/posts/components/like-button";
import { SaveButton } from "@/features/posts/components/save-button";
import { CommentsSection } from "@/features/posts/components/comments-section";

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const { data: post, isLoading, isError } = usePost(id);

  if (isLoading) {
    return <p className="p-10 text-center text-body-md text-neutral-400">Loading…</p>;
  }
  if (isError || !post) {
    return (
      <p className="p-10 text-center text-body-md text-neutral-400">
        Post not found.
      </p>
    );
  }

  return (
    <div className="mx-auto flex max-w-300 flex-col gap-4 p-4 lg:flex-row lg:gap-6">
      {/* Gambar (kiri di desktop) */}
      <div className="lg:flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="w-full rounded-lg object-cover lg:rounded-none"
        />
      </div>

      {/* Kolom kanan: info + komentar */}
      <div className="flex w-full flex-col gap-4 lg:max-w-125">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/profile/${post.author.username}`}
            className="flex items-center gap-3"
          >
            <UserAvatar
              src={post.author.avatarUrl}
              name={post.author.name}
              className="h-11 w-11"
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
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Close"
            className="shrink-0 text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Caption */}
        <p className="whitespace-pre-line text-body-sm text-white">{post.caption}</p>

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

        {/* Komentar */}
        <CommentsSection postId={post.id} />
      </div>
    </div>
  );
}