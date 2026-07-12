// src/features/users/components/user-result-item.tsx
import Link from "next/link";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { SearchedUser } from "../types";

export function UserResultItem({
  user,
  onNavigate,
}: {
  user: SearchedUser;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={`/profile/${user.username}`}
      onClick={onNavigate}
      className="flex items-center gap-2"
    >
      <UserAvatar src={user.avatarUrl} name={user.name} className="h-12 w-12" />
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-body-sm font-bold text-white">
          {user.name}
        </span>
        <span className="truncate text-body-sm text-neutral-400">
          {user.username}
        </span>
      </div>
    </Link>
  );
}