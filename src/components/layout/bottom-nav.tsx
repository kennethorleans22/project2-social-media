// src/components/layout/bottom-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/icon";

export function BottomNav() {
  const pathname = usePathname();

  // Add Post & Edit Profile tampil tanpa bottom nav.
  if (pathname.startsWith("/create") || pathname.startsWith("/me/edit")) {
    return null;
  }

  const isProfile = pathname.startsWith("/me");
  const isHome = !isProfile;

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 flex h-16 w-86.25 -translate-x-1/2 items-center justify-center gap-11.25 rounded-full border border-neutral-900 bg-neutral-950 backdrop-blur-md lg:bottom-8 lg:h-20 lg:w-90">
      <Link
        href="/feed"
        className="flex w-23.5 flex-col items-center gap-0.5 lg:gap-1"
      >
        <Icon
          src={isHome ? "/icons/nav-home-active.svg" : "/icons/nav-home.svg"}
          className="h-5 w-5 lg:h-6 lg:w-6"
        />
        <span
          className={cn(
            "text-body-xs tracking-tight lg:text-body-md",
            isHome ? "font-bold text-primary-200" : "text-white"
          )}
        >
          Home
        </span>
      </Link>

      <Link
        href="/create"
        aria-label="Create post"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary lg:h-12 lg:w-12"
      >
        <Icon src="/icons/nav-add.svg" className="h-5.5 w-5.5 lg:h-6 lg:w-6" />
      </Link>

      <Link
        href="/me"
        className="flex w-23.5 flex-col items-center gap-0.5 lg:gap-1"
      >
        <Icon
          src={isProfile ? "/icons/nav-profile-active.svg" : "/icons/nav-profile.svg"}
          className="h-5 w-5 lg:h-6 lg:w-6"
        />
        <span
          className={cn(
            "text-body-xs tracking-tight lg:text-body-md",
            isProfile ? "font-bold text-primary-200" : "text-white"
          )}
        >
          Profile
        </span>
      </Link>
    </nav>
  );
}