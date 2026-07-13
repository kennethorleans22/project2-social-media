// src/components/layout/navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store";
import { UserAvatar } from "@/components/shared/user-avatar";
import { SearchBar } from "@/features/users/components/search-bar";
import { MobileSearchOverlay } from "@/features/users/components/mobile-search-overlay";

export default function Navbar() {
  const user = useAppSelector((s) => s.auth.user);
  const isAuthed = !!user;
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Halaman dengan header mobile sendiri → sembunyikan navbar ini di mobile.
  const pathname = usePathname();
  const hideOnMobile =
    pathname.startsWith("/me") ||
    pathname.startsWith("/create") ||
    pathname.startsWith("/profile");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-neutral-900 bg-black",
        hideOnMobile && "hidden lg:block"
      )}
    >
      {/* Baris utama */}
      <div className="flex h-16 items-center justify-between px-4 lg:h-20 lg:px-30">
        {/* Brand */}
        <Link href={isAuthed ? "/feed" : "/"} className="flex items-center gap-2.75">
          <Image src="/icons/logo.svg" alt="Sociality" width={30} height={30} priority />
          <span className="text-display-xs font-bold text-neutral-25">Sociality</span>
        </Link>

        {/* Search — desktop (tengah) */}
        <div className="hidden flex-1 justify-center px-8 lg:flex">
          <SearchBar />
        </div>

        {/* Kanan */}
        <div className="flex items-center gap-4">
          {/* Search icon — mobile: buka overlay */}
          <button
            type="button"
            className="lg:hidden"
            aria-label="Search"
            onClick={() => setMobileSearchOpen(true)}
          >
            <Search size={20} className="text-white" />
          </button>

          {isAuthed ? (
            <Link href="/me" className="flex items-center gap-3">
              <UserAvatar
                src={user?.avatarUrl ?? null}
                name={user?.name ?? "U"}
                className="h-10 w-10 lg:h-12 lg:w-12"
              />
              <span className="hidden text-body-md font-bold text-neutral-25 lg:inline">
                {user?.name}
              </span>
            </Link>
          ) : (
            <>
              <div className="hidden items-center gap-3 lg:flex">
                <Link
                  href="/login"
                  className="flex h-11 w-32.5 items-center justify-center rounded-full border border-neutral-900 text-body-md font-bold text-neutral-25"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex h-11 w-32.5 items-center justify-center rounded-full bg-primary text-body-md font-bold text-neutral-25"
                >
                  Register
                </Link>
              </div>

              <button
                type="button"
                className="text-white lg:hidden"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Dropdown mobile (hanya tamu & saat menu dibuka) */}
      {!isAuthed && menuOpen && (
        <div className="flex gap-3 px-4 pb-4 lg:hidden">
          <Link
            href="/login"
            className="flex h-10 flex-1 items-center justify-center rounded-full border border-neutral-900 text-body-sm font-bold text-neutral-25"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="flex h-10 flex-1 items-center justify-center rounded-full bg-primary text-body-sm font-bold text-neutral-25"
          >
            Register
          </Link>
        </div>
      )}

      <MobileSearchOverlay
        open={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
      />
    </header>
  );
}