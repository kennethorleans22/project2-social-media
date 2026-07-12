// src/features/posts/components/comment-composer.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateComment } from "../queries";

const EMOJIS = [
  "😀","😅","🥰","😇","🙂","😋",
  "🤪","🤐","😏","🤗","😪","🙄",
  "🤫","😴","🥵","😫","😭","😱",
];

export function CommentComposer({ postId }: { postId: number }) {
  const [text, setText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const create = useCreateComment(postId);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setEmojiOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submit() {
    const t = text.trim();
    if (!t || create.isPending) return;
    create.mutate(t);
    setText("");
    setEmojiOpen(false);
  }

  return (
    <div ref={wrapRef} className="relative flex items-center gap-2">
      {/* Tombol emoji */}
      <button
        type="button"
        onClick={() => setEmojiOpen((o) => !o)}
        aria-label="Emoji"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-900 text-white"
      >
        <Smile size={24} />
      </button>

      {/* Input + Post */}
      <div className="flex h-12 flex-1 items-center gap-2 rounded-xl border border-neutral-900 bg-neutral-950 px-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Add Comment"
          className="w-full bg-transparent text-body-sm text-white placeholder:text-neutral-600 focus:outline-none"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!text.trim() || create.isPending}
          className={cn(
            "shrink-0 text-body-sm font-bold",
            text.trim() ? "text-primary-200" : "text-neutral-600"
          )}
        >
          Post
        </button>
      </div>

      {/* Popover emoji */}
      {emojiOpen && (
        <div className="absolute bottom-full left-0 mb-2 grid w-52 grid-cols-6 gap-1 rounded-xl border border-neutral-900 bg-neutral-950 p-3 text-2xl">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setText((t) => t + e)}
              className="leading-none"
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}