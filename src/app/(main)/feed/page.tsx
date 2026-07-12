// src/app/(main)/feed/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { PostCard } from "@/features/posts/components/post-card";
import { useTimeline } from "@/features/posts/queries";

export default function FeedPage() {
  const {
    posts,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTimeline();

  const sentinelRef = useRef<HTMLDivElement>(null);

  const [showPosted, setShowPosted] = useState(
    () =>
      typeof window !== "undefined" &&
      sessionStorage.getItem("sociality_posted") === "1"
  );

  useEffect(() => {
    if (!showPosted) return;
    sessionStorage.removeItem("sociality_posted");
    const t = setTimeout(() => setShowPosted(false), 4000);
    return () => clearTimeout(t);
  }, [showPosted]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      {showPosted && (
        <div className="fixed left-5 right-5 top-[86px] z-50 flex items-center gap-2 rounded-lg bg-[#079455] px-3 py-2 lg:left-auto lg:right-8 lg:top-28 lg:w-[291px]">
          <span className="flex-1 text-body-sm font-semibold text-white">
            Success Post
          </span>
          <button
            type="button"
            onClick={() => setShowPosted(false)}
            aria-label="Close"
            className="shrink-0"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      )}

      <div className="mx-auto w-full max-w-150 px-4 py-6">
        {isLoading ? (
          <p className="py-10 text-center text-body-md text-neutral-400">Loading…</p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-1 py-10 text-center">
            <p className="text-body-md font-bold text-white">Something went wrong</p>
            <p className="text-body-sm text-neutral-400">Please try again later.</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-10 text-center">
            <p className="text-body-md font-bold text-white">No posts yet</p>
            <p className="text-body-sm text-neutral-400">Be the first to post something!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 lg:gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            <div ref={sentinelRef} className="h-1" />
            {isFetchingNextPage && (
              <p className="py-4 text-center text-body-sm text-neutral-400">
                Loading more…
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}