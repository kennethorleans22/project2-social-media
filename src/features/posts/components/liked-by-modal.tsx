// src/features/posts/components/liked-by-modal.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { FollowButton } from "@/features/users/components/follow-button";
import { usePostLikers } from "../queries";

export function LikedByModal({
  postId,
  open,
  onClose,
}: {
  postId: number;
  open: boolean;
  onClose: () => void;
}) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostLikers(postId, open);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const users = data?.pages.flatMap((p) => p.users) ?? [];

  return (
    // Mobile: nempel bawah (items-end). Desktop: di tengah (lg:items-center).
    <div className="fixed inset-0 z-[70] flex items-end justify-center lg:items-center lg:p-4">
      {/* Overlay gelap — klik untuk menutup */}
      <div className="absolute inset-0 bg-neutral-950/80" onClick={onClose} />

      <div className="relative flex w-full flex-col items-end gap-4 lg:max-w-137">
        {/* X desktop (di atas card) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="hidden text-white lg:block"
        >
          <X size={24} />
        </button>

        {/* Card: mobile sheet (rounded atas, tinggi s/d 85% layar), desktop dialog */}
        <div className="flex max-h-[85dvh] w-full flex-col gap-5 overflow-y-auto rounded-t-2xl border border-neutral-900 bg-neutral-950 p-5 lg:max-h-132.5 lg:rounded-2xl">
          {/* Header: judul + X (mobile) */}
          <div className="flex items-center justify-between">
            <h2 className="text-body-xl font-bold tracking-tight text-white">Likes</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-white lg:hidden"
            >
              <X size={24} />
            </button>
          </div>

          {isLoading ? (
            <p className="py-6 text-center text-body-sm text-neutral-400">Loading…</p>
          ) : isError ? (
            <p className="py-6 text-center text-body-sm text-error">
              Failed to load likes.
            </p>
          ) : users.length === 0 ? (
            <p className="py-6 text-center text-body-sm text-neutral-400">
              No likes yet.
            </p>
          ) : (
            <>
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-4">
                  <Link
                    href={`/profile/${u.username}`}
                    onClick={onClose}
                    className="flex min-w-0 items-center gap-2"
                  >
                    <UserAvatar src={u.avatarUrl} name={u.name} className="h-12 w-12" />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-body-sm font-bold text-white">
                        {u.name}
                      </span>
                      <span className="truncate text-body-sm text-neutral-400">
                        {u.username}
                      </span>
                    </div>
                  </Link>

                  {!u.isMe && (
                    <FollowButton
                      username={u.username}
                      initialFollowing={u.isFollowedByMe}
                    />
                  )}
                </div>
              ))}

              {hasNextPage && (
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="py-2 text-body-sm font-semibold text-primary-200"
                >
                  {isFetchingNextPage ? "Loading…" : "Load more"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}