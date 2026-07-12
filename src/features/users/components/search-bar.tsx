// src/features/users/components/search-bar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchUsers } from "../queries";
import { SearchResults } from "./search-results";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debounced = useDebounce(query);
  const { data, isLoading, isError } = useSearchUsers(debounced);
  const isPending = query !== debounced;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-122.75">
      {/* Input */}
      <div className="flex h-12 items-center gap-1.5 rounded-full border border-neutral-900 bg-neutral-950 px-4">
        <Search size={20} className="shrink-0 text-neutral-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
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

      {/* Dropdown hasil */}
      {showDropdown && (
        <div className="absolute left-0 top-full mt-2 max-h-100 w-full overflow-y-auto rounded-3xl border border-neutral-900 bg-neutral-950 p-5">
          <SearchResults
            query={query}
            results={data}
            isLoading={isLoading || isPending}
            isError={isError}
            onNavigate={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}