// src/app/(main)/me/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/icon";
import { UserAvatar } from "@/components/shared/user-avatar";
import { useMe, useMyPosts, useSavedPosts } from "@/features/profile/queries";
import { GalleryGrid } from "@/features/profile/components/gallery-grid";

type Tab = "gallery" | "saved";

export default function MyProfilePage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("gallery");

  const { data } = useMe();
  const profile = data?.profile;
  const stats = data?.stats;

  const gallery = useMyPosts();
  const saved = useSavedPosts(tab === "saved");

  return (
    <>
      {/* Header MOBILE (khusus /me — navbar global disembunyikan di mobile) */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-900 bg-black px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => router.back()} aria-label="Back">
            <ArrowLeft size={24} className="text-white" />
          </button>
          <span className="text-body-md font-bold text-white">
            {profile?.name ?? "Profile"}
          </span>
        </div>
        <UserAvatar
          src={profile?.avatarUrl ?? null}
          name={profile?.name ?? "U"}
          className="h-10 w-10"
        />
      </header>

      <div className="mx-auto flex w-full max-w-[812px] flex-col gap-4 px-4 pt-4 lg:px-0 lg:pt-10">
        {/* ===== Info profil ===== */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <div className="flex items-center gap-3 lg:items-end lg:gap-5">
              <UserAvatar
                src={profile?.avatarUrl ?? null}
                name={profile?.name ?? "U"}
                className="h-16 w-16"
              />
              <div className="flex flex-col">
                <span className="text-body-sm font-bold text-white lg:text-body-md">
                  {profile?.name}
                </span>
                <span className="text-body-sm text-neutral-400 lg:text-body-md">
                  {profile?.username}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/me/edit"
                className="flex h-10 flex-1 items-center justify-center rounded-full border border-neutral-900 px-4 text-body-sm font-bold text-white lg:h-12 lg:w-32.5 lg:flex-none lg:text-body-md"
              >
                Edit Profile
              </Link>
              <button
                type="button"
                aria-label="Share"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-900 lg:h-12 lg:w-12"
              >
                <Icon src="/icons/share.svg" className="h-5 w-5 lg:h-6 lg:w-6" />
              </button>
            </div>
          </div>

          {profile?.bio && (
            <p className="text-body-sm text-white lg:text-body-md">
              {profile.bio}
            </p>
          )}

          <div className="flex items-center gap-6">
            <Stat value={stats?.posts} label="Post" />
            <StatDivider />
            <Stat value={stats?.followers} label="Followers" />
            <StatDivider />
            <Stat value={stats?.following} label="Following" />
            <StatDivider />
            <Stat value={stats?.likes} label="Likes" />
          </div>
        </section>

        {/* ===== Tabs + grid ===== */}
        <section className="flex flex-col gap-6">
          <div className="flex">
            <TabButton
              active={tab === "gallery"}
              onClick={() => setTab("gallery")}
              icon="/icons/tab-gallery.svg"
              iconActive="/icons/tab-gallery-active.svg"
              label="Gallery"
            />
            <TabButton
              active={tab === "saved"}
              onClick={() => setTab("saved")}
              icon="/icons/tab-saved.svg"
              iconActive="/icons/tab-saved-active.svg"
              label="Saved"
            />
          </div>

          {tab === "gallery" ? (
            <GalleryGrid
              posts={gallery.data?.pages.flatMap((p) => p.items) ?? []}
              isLoading={gallery.isLoading}
              isError={gallery.isError}
              hasNextPage={!!gallery.hasNextPage}
              isFetchingNextPage={gallery.isFetchingNextPage}
              fetchNextPage={gallery.fetchNextPage}
              empty={<EmptyGallery />}
            />
          ) : (
            <GalleryGrid
              posts={saved.data?.pages.flatMap((p) => p.items) ?? []}
              isLoading={saved.isLoading}
              isError={saved.isError}
              hasNextPage={!!saved.hasNextPage}
              isFetchingNextPage={saved.isFetchingNextPage}
              fetchNextPage={saved.fetchNextPage}
              empty={
                <p className="py-16 text-center text-body-sm text-neutral-400">
                  No saved posts yet
                </p>
              }
            />
          )}
        </section>
      </div>
    </>
  );
}

/* ---------- sub-komponen kecil ---------- */

function EmptyGallery() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center lg:gap-6 lg:py-24">
      <div className="flex flex-col items-center gap-1">
        <p className="text-body-md font-bold text-white lg:text-body-lg">
          Your story starts here
        </p>
        <p className="max-w-[453px] text-body-sm text-neutral-400 lg:text-body-md">
          Share your first post and let the world see your moments, passions,
          and memories. Make this space truly yours.
        </p>
      </div>
      <Link
        href="/create"
        className="flex h-10 items-center justify-center rounded-full bg-primary px-6 text-body-sm font-bold text-white lg:h-12 lg:text-body-md"
      >
        Upload My First Post
      </Link>
    </div>
  );
}

function Stat({ value, label }: { value?: number; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5">
      <span className="text-body-lg font-bold text-white lg:text-body-xl">
        {value ?? 0}
      </span>
      <span className="text-body-xs text-neutral-400 lg:text-body-md">
        {label}
      </span>
    </div>
  );
}

function StatDivider() {
  return <div className="h-12 w-px shrink-0 bg-neutral-900 lg:h-16" />;
}

function TabButton({
  active,
  onClick,
  icon,
  iconActive,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  iconActive: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-12 flex-1 items-center justify-center gap-2 lg:gap-3",
        active
          ? "border-b-2 border-white text-white"
          : "border-b border-neutral-900 text-neutral-400"
      )}
    >
      <Icon src={active ? iconActive : icon} className="h-5 w-5 lg:h-6 lg:w-6" />
      <span
        className={cn(
          "text-body-sm lg:text-body-md",
          active ? "font-bold" : "font-medium"
        )}
      >
        {label}
      </span>
    </button>
  );
}