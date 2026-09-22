"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validation/login";
import { signIn } from "@/lib/actions/auth";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit((data) => {
    setFormError(null);
    startTransition(async () => {
      const result = await signIn(data);
      if (!result.ok) {
        setFormError(result.errors.form?.[0] ?? "Something went wrong. Please try again.");
      }
    });
  });

  return (
    <GlassCard strong className="w-full max-w-md">
      <h1 className="text-2xl">Staff login</h1>
      <p className="mt-1 text-sm text-ink-2">Sign in to manage pets and applications.</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        {formError ? <p className="text-sm text-danger">{formError}</p> : null}
        <Button
          type="submit"
          pill={false}
          disabled={isPending}
          className="mt-2 justify-center"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </GlassCard>
  );
}
