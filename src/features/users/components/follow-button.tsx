// src/features/users/components/follow-button.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/icon";
import { followUser, unfollowUser } from "../api";

export function FollowButton({
  username,
  initialFollowing,
  profile = false,
}: {
  username: string;
  initialFollowing: boolean;
  profile?: boolean;
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
        className={cn(
          "flex items-center justify-center gap-2 rounded-full border border-neutral-900 font-bold tracking-tight text-white",
          profile
            ? "h-10 flex-1 px-4 text-body-sm lg:h-12 lg:flex-none lg:px-6 lg:text-body-md"
            : "h-10 shrink-0 px-4 text-body-sm"
        )}
      >
        <Icon
          src="/icons/check-circle.svg"
          className={cn("h-5 w-5", profile && "lg:h-6 lg:w-6")}
        />
        Following
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "rounded-full bg-primary font-bold tracking-tight text-white",
        profile
          ? "h-10 flex-1 px-6 text-body-sm lg:h-12 lg:flex-none lg:text-body-md"
          : "h-10 shrink-0 px-6 text-body-sm"
      )}
    >
      Follow
    </button>
  );
}