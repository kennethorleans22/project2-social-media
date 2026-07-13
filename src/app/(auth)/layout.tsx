// src/app/(auth)/layout.tsx
import { GuestGuard } from "@/features/auth/guards";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <div className="relative min-h-screen overflow-hidden bg-black">
        {/* Gradient = GAMBAR export dari Figma (dekoratif, di belakang konten) */}

        {/* HANYA mobile (di bawah md): nempel di bawah, lebar ~414px, center */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gradient-auth-mobile.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 w-[414px] max-w-none -translate-x-1/2 select-none md:hidden"
        />

        {/* Tablet & desktop (md ke atas): glow besar, 150px dari atas, center */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gradient-auth-desktop.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[150px] hidden w-[1920px] max-w-none -translate-x-1/2 select-none md:block"
        />

        {/* Konten (login/register) di atas gradient */}
        <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
          {children}
        </div>
      </div>
    </GuestGuard>
  );
}