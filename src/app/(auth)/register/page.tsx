// src/app/(auth)/register/page.tsx
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
import { registerSchema, type RegisterInput } from "@/features/auth/schema";
import { useRegister } from "@/features/auth/hooks";

const inputBase =
  "h-12 rounded-xl border-neutral-900 bg-neutral-950 px-4 text-body-md tracking-tight text-white placeholder:text-neutral-600";
const labelClass = "text-body-sm font-bold tracking-tight text-white";
const helperClass = "text-body-sm font-medium tracking-tight text-error";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className={labelClass}>{label}</label>
      {children}
      {error && <p className={helperClass}>{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: RegisterInput) {
    registerMutation.mutate(values);
  }

  return (
    <div className="flex w-full max-w-130.75 flex-col items-center gap-4 rounded-2xl border border-neutral-900 bg-black/20 px-4 py-8 backdrop-blur-2xl lg:gap-6 lg:px-6 lg:py-10">
      {/* Brand */}
      <div className="flex items-center gap-2.75">
        <Image src="/icons/logo.svg" alt="Sociality" width={30} height={30} priority />
        <span className="text-display-xs font-bold text-neutral-25">Sociality</span>
      </div>

      {/* Heading */}
      <h1 className="text-display-xs font-bold tracking-tight text-white">Register</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-5"
        noValidate
      >
        <Field label="Email" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="Enter your email"
            className={cn(inputBase, errors.email && "border-error")}
            {...register("email")}
          />
        </Field>

        <Field label="Username" error={errors.username?.message}>
          <Input
            placeholder="Enter your username"
            className={cn(inputBase, errors.username && "border-error")}
            {...register("username")}
          />
        </Field>

        <Field label="Number Phone" error={errors.phone?.message}>
          <Input
            type="tel"
            placeholder="Enter your number phone"
            className={cn(inputBase, errors.phone && "border-error")}
            {...register("phone")}
          />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <Input
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
        </Field>

        <Field label="Confirm Password" error={errors.confirmPassword?.message}>
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              placeholder="Enter your confirm password"
              className={cn(inputBase, "pr-12", errors.confirmPassword && "border-error")}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </Field>

        {/* Button + Login link */}
        <div className="flex flex-col items-center gap-4">
          {registerMutation.isError && (
            <p className={cn(helperClass, "text-center")}>
              {(registerMutation.error as Error).message}
            </p>
          )}

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="h-11 w-full rounded-full text-body-md font-bold text-neutral-25 lg:h-12"
          >
            {registerMutation.isPending ? "Submitting..." : "Submit"}
          </Button>

          <p className="text-body-sm font-semibold tracking-tight text-neutral-25 lg:text-body-md">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary-200">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}