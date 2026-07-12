// src/app/(main)/me/edit/page.tsx
'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/shared/user-avatar';
import { ApiError } from '@/lib/api-client';
import { useMe, useUpdateMe } from '@/features/profile/queries';
import type { MyProfile } from '@/features/profile/api';

export default function EditProfilePage() {
  const router = useRouter();
  const { data, isLoading } = useMe();
  const profile = data?.profile;

  return (
    <>
      {/* Header MOBILE */}
      <header className='sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-900 bg-black px-4 lg:hidden'>
        <div className='flex items-center gap-2'>
          <button type='button' onClick={() => router.back()} aria-label='Back'>
            <ArrowLeft size={24} className='text-white' />
          </button>
          <span className='text-body-md font-bold text-white'>
            Edit Profile
          </span>
        </div>
        <UserAvatar
          src={profile?.avatarUrl ?? null}
          name={profile?.name ?? 'U'}
          className='h-10 w-10'
        />
      </header>

      <div className='mx-auto w-full max-w-[800px] px-4 pb-10 pt-4 lg:px-0 lg:pt-10'>
        <div className='flex flex-col gap-4 lg:gap-8'>
          {/* Title DESKTOP */}
          <div className='hidden items-center gap-3 lg:flex'>
            <button
              type='button'
              onClick={() => router.back()}
              aria-label='Back'
            >
              <ArrowLeft size={32} className='text-white' />
            </button>
            <h1 className='text-display-xs font-bold text-white'>
              Edit Profile
            </h1>
          </div>

          {isLoading || !profile ? (
            <p className='py-10 text-center text-body-sm text-neutral-400'>
              Loading…
            </p>
          ) : (
            /* key={profile.id} → form ter-init dari data (tanpa setState di effect) */
            <EditForm key={profile.id} profile={profile} />
          )}
        </div>
      </div>
    </>
  );
}

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ['image/png', 'image/jpeg'];

function EditForm({ profile }: { profile: MyProfile }) {
  const router = useRouter();
  const update = useUpdateMe();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [tried, setTried] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function pickAvatar(file?: File | null) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setServerError('Foto harus PNG atau JPG.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setServerError('Ukuran foto maksimal 5MB.');
      return;
    }
    setServerError(null);
    setAvatarFile(file);
    setAvatarPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
  }

  const nameErr = tried && !name.trim() ? 'Name is required.' : '';
  const usernameErr = tried && !username.trim() ? 'Username is required.' : '';
  const emailErr =
    tried && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter a valid email.' : '';

  function finish() {
    sessionStorage.setItem('sociality_profile_updated', '1');
    router.push('/me');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (!name.trim() || !username.trim() || !/^\S+@\S+\.\S+$/.test(email))
      return;

    // Kirim HANYA field yang berubah (hindari bug backend spt phone).
    const fd = new FormData();
    if (name !== profile.name) fd.append('name', name);
    if (username !== profile.username) fd.append('username', username);
    if (email !== profile.email) fd.append('email', email);
    if (phone !== (profile.phone ?? '')) fd.append('phone', phone);
    if (bio !== (profile.bio ?? '')) fd.append('bio', bio);
    if (avatarFile) fd.append('avatar', avatarFile);

    if ([...fd.keys()].length === 0) {
      finish();
      return;
    }

    setServerError(null);
    update.mutate(fd, {
      onSuccess: finish,
      onError: (err) =>
        setServerError(
          err instanceof ApiError ? err.message : 'Gagal menyimpan perubahan.'
        ),
    });
  }

  return (
    <div className='flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:gap-12'>
      {/* Avatar + Change Photo */}
      <div className='flex flex-col items-center gap-4 lg:w-40'>
        <UserAvatar
          src={avatarPreview ?? profile.avatarUrl}
          name={profile.name}
          className='h-20 w-20 lg:h-[130px] lg:w-[130px]'
        />
        <button
          type='button'
          onClick={() => fileRef.current?.click()}
          className='flex h-10 w-40 items-center justify-center rounded-full border border-neutral-900 text-body-sm font-bold text-white lg:h-12 lg:text-body-md'
        >
          Change Photo
        </button>
        <input
          ref={fileRef}
          type='file'
          accept='image/png,image/jpeg'
          className='hidden'
          onChange={(e) => pickAvatar(e.target.files?.[0])}
        />
      </div>

      {/* Fields */}
      <form
        onSubmit={handleSubmit}
        className='flex w-full flex-col gap-4 lg:max-w-[592px] lg:gap-6'
      >
        {serverError && (
          <p className='rounded-lg bg-error/10 px-3 py-2 text-body-sm text-error'>
            {serverError}
          </p>
        )}

        <Field label='Name' value={name} onChange={setName} error={nameErr} />
        <Field
          label='Username'
          value={username}
          onChange={setUsername}
          error={usernameErr}
        />
        <Field
          label='Email'
          type='email'
          value={email}
          onChange={setEmail}
          error={emailErr}
        />
        <Field label='Number Phone' value={phone} onChange={setPhone} />
        <Field
          label='Bio'
          textarea
          value={bio}
          onChange={setBio}
          placeholder='Create your bio'
        />

        <button
          type='submit'
          disabled={update.isPending}
          className='flex h-10 items-center justify-center rounded-full bg-primary text-body-sm font-bold text-white disabled:opacity-60 lg:h-12 lg:text-body-md'
        >
          {update.isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = 'text',
  textarea = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
}) {
  const base = cn(
    'w-full rounded-xl border bg-neutral-950 px-4 text-body-md text-white placeholder:text-neutral-600 focus:outline-none',
    error ? 'border-error' : 'border-neutral-900'
  );
  return (
    <div className='flex flex-col gap-0.5'>
      <label className='text-body-sm font-bold text-white'>{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={cn(base, 'min-h-25 resize-none py-2')}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(base, 'h-12')}
        />
      )}
      {error && <span className='text-body-sm text-error'>{error}</span>}
    </div>
  );
}
