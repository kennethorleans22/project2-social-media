// src/components/shared/user-avatar.tsx
import { cn } from "@/lib/utils";

// Avatar bulat reusable: foto kalau ada, kalau tidak inisial nama.
// Atur ukuran lewat `className` (mis. "h-12 w-12").
export function UserAvatar({
  src,
  name,
  className,
}: {
  src: string | null;
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-800",
        className ?? "h-10 w-10"
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="text-body-sm font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );
}