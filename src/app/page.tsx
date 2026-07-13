// src/app/page.tsx
import { redirect } from "next/navigation";

// Root "/" langsung diarahkan ke feed.
// Kalau belum login, RequireAuth di (main) akan melempar ke /login.
export default function Home() {
  redirect("/feed");
}