// src/app/(main)/create/page.tsx
"use client";

import { useRef, useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/icon";
import { UserAvatar } from "@/components/shared/user-avatar";
import { useAppSelector } from "@/store";
import { useCreatePost } from "@/features/posts/queries";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED = ["image/png", "image/jpeg"];

export default function CreatePostPage() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const create = useCreatePost();

  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [tried, setTried] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  function pickFile(file: File | undefined | null) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setFileError("Format harus PNG atau JPG.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setFileError("Ukuran maksimal 5MB.");
      return;
    }
    setFileError(null);
    setImage(file);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
  }

  function removeImage() {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    pickFile(e.dataTransfer.files?.[0]);
  }

  const photoError =
    fileError ?? (tried && !image ? "Please upload a photo." : null);
  const captionError =
    tried && !caption.trim() ? "Please add a caption." : null;

  function handleShare() {
    setTried(true);
    if (!image || !caption.trim()) return;
    create.mutate(
      { image, caption: caption.trim() },
      {
        onSuccess: () => {
          sessionStorage.setItem("sociality_posted", "1");
          router.push("/feed");
        },
      }
    );
  }

  return (
    <>
      {/* Header MOBILE (navbar global disembunyikan di mobile) */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-900 bg-black px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => router.back()} aria-label="Back">
            <ArrowLeft size={24} className="text-white" />
          </button>
          <span className="text-body-md font-bold text-white">Add Post</span>
        </div>
        <UserAvatar
          src={user?.avatarUrl ?? null}
          name={user?.name ?? "U"}
          className="h-10 w-10"
        />
      </header>

      <div className="mx-auto flex w-full max-w-[452px] flex-col gap-6 px-4 pb-10 pt-4 lg:px-0 lg:pt-10">
        {/* Judul DESKTOP */}
        <div className="hidden items-center gap-3 lg:flex">
          <button type="button" onClick={() => router.back()} aria-label="Back">
            <ArrowLeft size={32} className="text-white" />
          </button>
          <h1 className="text-display-xs font-bold text-white">Add Post</h1>
        </div>

        {/* Photo */}
        <div className="flex flex-col gap-0.5">
          <span className="text-body-sm font-bold text-white">Photo</span>

          {!preview ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed bg-neutral-950 px-6 py-4",
                photoError ? "border-error" : "border-neutral-900"
              )}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-900">
                <Icon src="/icons/upload-cloud.svg" className="h-5 w-5" />
              </span>
              <div className="flex flex-col items-center gap-1">
                <p className="text-body-sm">
                  <span className="font-bold text-primary-200">
                    Click to upload
                  </span>
                  <span className="text-neutral-600"> or drag and drop</span>
                </p>
                <p className="text-body-sm text-neutral-600">
                  PNG or JPG (max. 5mb)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 rounded-xl border border-neutral-900 bg-neutral-950 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="aspect-square w-full rounded-lg object-cover"
              />
              {/* Tombol Change / Delete — DI TENGAH */}
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-neutral-900 px-3 text-body-sm font-medium text-white"
                >
                  <Icon src="/icons/change-image.svg" className="h-5 w-5" />
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={removeImage}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-neutral-900 px-3 text-body-sm font-medium text-error"
                >
                  <Icon src="/icons/delete-image.svg" className="h-5 w-5" />
                  Delete Image
                </button>
              </div>
            </div>
          )}

          {photoError && (
            <span className="text-body-sm text-error">{photoError}</span>
          )}
        </div>

        {/* Caption */}
        <div className="flex flex-col gap-0.5">
          <label htmlFor="caption" className="text-body-sm font-bold text-white">
            Caption
          </label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Create your caption"
            rows={4}
            className={cn(
              "min-h-25 resize-none rounded-xl border bg-neutral-950 px-4 py-2 text-body-sm text-white placeholder:text-neutral-600 focus:outline-none",
              captionError ? "border-error" : "border-neutral-900"
            )}
          />
          {captionError && (
            <span className="text-body-sm text-error">{captionError}</span>
          )}
        </div>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          disabled={create.isPending}
          className="flex h-10 items-center justify-center rounded-full bg-primary text-body-sm font-bold text-white disabled:opacity-60 lg:h-12 lg:text-body-md"
        >
          {create.isPending ? "Sharing…" : "Share"}
        </button>

        {/* input file tersembunyi */}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
      </div>
    </>
  );
}