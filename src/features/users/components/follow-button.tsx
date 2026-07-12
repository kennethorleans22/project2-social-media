// src/features/users/components/follow-button.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Icon } from "@/components/shared/icon";
import { followUser, unfollowUser } from "../api";

export function FollowButton({
  username,
  initialFollowing,
}: {
  username: string;
  initialFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);

  const mutation = useMutation({
    mutationFn: (next: boolean) =>
      next ? followUser(username) : unfollowUser(username),
  });

  function toggle() {
    if (mutation.isPending) return;
    const prev = following;
    const next = !prev;

    setFollowing(next); // optimistic
    mutation.mutate(next, {
      onSuccess: (data) => setFollowing(data.following), // reconcile
      onError: () => setFollowing(prev), // rollback
    });
  }

  if (following) {
    return (
      <button
        type="button"
        onClick={toggle}
        className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-neutral-900 px-4 text-body-sm font-bold tracking-tight text-white"
      >
        <Icon src="/icons/check-circle.svg" className="h-5 w-5" />
        Following
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="h-10 shrink-0 rounded-full bg-primary px-6 text-body-sm font-bold tracking-tight text-white"
    >
      Follow
    </button>
  );
}