// src/app/(main)/layout.tsx
"use client";

import { RequireAuth } from "@/features/auth/guards";
import Navbar from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { PostModalProvider } from "@/features/posts/post-modal-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <PostModalProvider>
        <div className="min-h-screen bg-black text-white">
          <Navbar />
          {/* pb besar biar konten terakhir tidak ketutup floating nav */}
          <main className="pb-28 lg:pb-32">{children}</main>
          <BottomNav />
        </div>
      </PostModalProvider>
    </RequireAuth>
  );
}