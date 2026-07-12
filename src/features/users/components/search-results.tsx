// src/features/users/components/search-results.tsx
import type { SearchedUser } from "../types";
import { UserResultItem } from "./user-result-item";

export function SearchResults({
  query,
  results,
  isLoading,
  isError,
  onNavigate,
  variant = "dropdown",
}: {
  query: string;
  results: SearchedUser[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onNavigate?: () => void;
  variant?: "dropdown" | "page";
}) {
  // Belum mengetik → tidak menampilkan apa pun.
  if (query.trim().length === 0) return null;

  // "page" (mobile) → isi negara center vertikal memenuhi tinggi.
  // "dropdown" (desktop) → ringkas dengan sedikit padding.
  const stateWrap =
    variant === "page"
      ? "flex h-full flex-col items-center justify-center gap-1 text-center"
      : "flex flex-col items-center justify-center gap-1 py-8 text-center";

  if (isLoading) {
    return (
      <div className={stateWrap}>
        <p className="text-body-sm text-neutral-400">Searching…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={stateWrap}>
        <p className="text-body-sm text-error">
          Something went wrong. Please try again.
        </p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className={stateWrap}>
        <p className="text-body-md font-bold text-white">No results found</p>
        <p className="text-body-sm text-neutral-400">Change your keyword</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {results.map((user) => (
        <UserResultItem key={user.id} user={user} onNavigate={onNavigate} />
      ))}
    </div>
  );
}