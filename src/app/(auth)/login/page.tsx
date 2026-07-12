// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "@/features/auth/schema";
import { useLogin } from "@/features/auth/hooks";

const inputBase =
  "h-12 rounded-xl border-neutral-900 bg-neutral-950 px-4 text-body-md tracking-tight text-white placeholder:text-neutral-600";
const labelClass = "text-body-sm font-bold tracking-tight text-white";
const helperClass = "text-body-sm font-medium tracking-tight text-error";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginInput) {
    login.mutate(values);
  }

  return (
    <div className="flex w-full max-w-111.5 flex-col items-center gap-4 rounded-2xl border border-neutral-900 bg-black/20 px-4 py-8 backdrop-blur-xl lg:gap-6 lg:px-6 lg:py-10">
      {/* Brand */}
      <div className="flex items-center gap-2.75">
        <Image src="/icons/logo.svg" alt="Sociality" width={30} height={30} priority />
        <span className="text-display-xs font-bold text-neutral-25">Sociality</span>
      </div>

      {/* Heading */}
      <h1 className="text-body-xl font-bold tracking-tight text-white lg:text-display-xs">
        Welcome Back!
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-5"
        noValidate
      >
        {/* Email */}
        <div className="flex flex-col gap-0.5">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className={cn(inputBase, errors.email && "border-error")}
            {...register("email")}
          />
          {errors.email && <p className={helperClass}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-0.5">
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={cn(inputBase, "pr-12", errors.password && "border-error")}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className={helperClass}>{errors.password.message}</p>
          )}
        </div>

        {/* Button + Register */}
        <div className="flex flex-col items-center gap-4">
          {/* Pesan error dari server (mis. email/password salah) */}
          {login.isError && (
            <p className={cn(helperClass, "text-center")}>
              {(login.error as Error).message}
            </p>
          )}

          <Button
            type="submit"
            disabled={login.isPending}
            className="h-11 w-full rounded-full text-body-md font-bold text-neutral-25 lg:h-12"
          >
            {login.isPending ? "Logging in..." : "Login"}
          </Button>

          <p className="text-body-sm font-semibold tracking-tight text-neutral-25 lg:text-body-md">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-primary-200">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}