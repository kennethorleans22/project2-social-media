// src/lib/format.ts
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Aktifkan plugin "fromNow" sekali di sini.
dayjs.extend(relativeTime);

// Ubah tanggal ISO dari API jadi teks relatif, mis. "2 minutes ago".
export function formatRelativeTime(dateISO: string): string {
  return dayjs(dateISO).fromNow();
}