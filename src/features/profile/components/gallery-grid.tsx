// src/features/profile/components/gallery-grid.tsx
"use client";

import { useOpenPost } from "@/features/posts/post-modal-context";
import type { Post } from "@/features/posts/types";

export function GalleryGrid({
  posts,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  empty,
}: {
  posts: Post[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  empty: React.ReactNode;
}) {
  const openPost = useOpenPost();

  if (isLoading) {
    return (
      <p className="py-10 text-center text-body-sm text-neutral-400">Loading…</p>
    );
  }
  if (isError) {
    return (
      <p className="py-10 text-center text-body-sm text-error">
        Failed to load.
      </p>
    );
  }
  if (posts.length === 0) {
    return <>{empty}</>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-0.5 lg:gap-1">
        {posts.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => openPost(p.id)}
            className="aspect-square w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.imageUrl}
              alt={p.caption}
              className="h-full w-full rounded-sm object-cover lg:rounded-md"
            />
          </button>
        ))}
      </div>

      {hasNextPage && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mx-auto py-1 text-body-sm font-semibold text-primary-200"
        >
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}