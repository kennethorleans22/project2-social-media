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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(75% 95% at 50% 108%, #AC88FF 0%, #7B44D6 30%, #4A1F9E 52%, rgba(0,0,0,0) 78%)",
            }}
          />
        </div>

        <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
          {children}
        </div>
      </div>
    </GuestGuard>
  );
}