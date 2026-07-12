// src/features/posts/components/comments-section.tsx
"use client";

import { useComments, useDeleteComment } from "../queries";
import { CommentItem } from "./comment-item";
import { CommentComposer } from "./comment-composer";

export function CommentsSection({ postId }: { postId: number }) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(postId);
  const del = useDeleteComment(postId);

  const comments = data?.pages.flatMap((p) => p.comments) ?? [];

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-body-md font-bold tracking-tight text-white">Comments</h2>

      {isLoading ? (
        <p className="py-6 text-center text-body-sm text-neutral-400">Loading…</p>
      ) : isError ? (
        <p className="py-6 text-center text-body-sm text-error">
          Failed to load comments.
        </p>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center gap-1 py-10 text-center">
          <p className="text-body-md font-bold text-white">No Comments yet</p>
          <p className="text-body-sm text-neutral-400">Start the conversation</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} onDelete={(id) => del.mutate(id)} />
          ))}
          {hasNextPage && (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="py-1 text-body-sm font-semibold text-primary-200"
            >
              {isFetchingNextPage ? "Loading…" : "Load more"}
            </button>
          )}
        </div>
      )}

      {/* Composer */}
      <CommentComposer postId={postId} />
    </div>
  );
}