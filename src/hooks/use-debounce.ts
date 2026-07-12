// src/hooks/use-debounce.ts
"use client";

import { useEffect, useState } from "react";

// Menunda perubahan nilai: baru meneruskan value setelah `delay` ms "diam".
// Dipakai di search supaya API tidak dipanggil tiap ketikan.
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // batalkan timer lama tiap value berubah
  }, [value, delay]);

  return debounced;
}