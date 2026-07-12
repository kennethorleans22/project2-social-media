// src/features/posts/components/comment-item.tsx
"use client";

import { Trash2 } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { formatRelativeTime } from "@/lib/format";
import { useAppSelector } from "@/store";
import type { Comment } from "../types";

export function CommentItem({
  comment,
  onDelete,
}: {
  comment: Comment;
  onDelete: (id: number) => void;
}) {
  const currentUserId = useAppSelector((s) => s.auth.user?.id);
  const isMine = currentUserId === comment.author.id;

  return (
    <div className="flex flex-col gap-2 border-b border-neutral-900 pb-3">
      <div className="flex items-center gap-2">
        <UserAvatar
          src={comment.author.avatarUrl}
          name={comment.author.name}
          className="h-10 w-10"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-body-sm font-semibold text-white">
            {comment.author.name}
          </span>
          <span className="truncate text-body-xs text-neutral-400">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>
        {isMine && (
          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            aria-label="Delete comment"
            className="shrink-0 text-neutral-500"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      <p className="whitespace-pre-line text-body-sm text-white">{comment.text}</p>
    </div>
  );
}