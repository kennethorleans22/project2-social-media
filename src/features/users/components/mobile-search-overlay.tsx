// src/features/users/components/mobile-search-overlay.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchUsers } from "../queries";
import { SearchResults } from "./search-results";

export function MobileSearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query);
  const { data, isLoading, isError } = useSearchUsers(debounced);
  const isPending = query !== debounced;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black lg:hidden">
      {/* Header: input + tombol tutup */}
      <div className="flex h-16 shrink-0 items-center gap-4 border-b border-neutral-900 px-4">
        <div className="flex h-10 flex-1 items-center gap-1.5 rounded-full border border-neutral-900 bg-neutral-950 px-3">
          <Search size={20} className="shrink-0 text-neutral-500" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-body-sm tracking-tight text-white placeholder:text-neutral-600 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear"
              className="shrink-0"
            >
              <Image src="/icons/close-circle.svg" alt="Clear" width={16} height={16} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="shrink-0 text-white"
        >
          <X size={24} />
        </button>
      </div>

      {/* Body hasil (mengisi sisa layar; empty state center vertikal) */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <SearchResults
          query={query}
          results={data}
          isLoading={isLoading || isPending}
          isError={isError}
          onNavigate={onClose}
          variant="page"
        />
      </div>
    </div>
  );
}