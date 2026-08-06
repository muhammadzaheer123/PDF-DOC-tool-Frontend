"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordTooShort = password.length > 0 && password.length < 8;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    const result = await register(fullName, email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/");
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-17 w-17 items-center justify-center rounded-full border border-border bg-surface">
            <UserPlus size={28} className="text-signal" strokeWidth={1.75} />
          </div>
          <h1 className="font-display text-2xl text-text-primary">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Start using DocuForge&apos;s tools.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-[var(--radius-lg)] border border-border bg-surface/60 p-6"
        >
          <div>
            <label
              className="mb-1.5 block text-xs font-medium text-text-muted"
              htmlFor="fullName"
            >
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Muhammad Zaheer"
              className="w-full rounded-[var(--radius-md)] border border-border bg-ink/40 p-3 text-sm text-text-primary outline-none transition-colors focus:border-signal focus:ring-1 focus:ring-signal/30"
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-xs font-medium text-text-muted"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-[var(--radius-md)] border border-border bg-ink/40 p-3 text-sm text-text-primary outline-none transition-colors focus:border-signal focus:ring-1 focus:ring-signal/30"
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-xs font-medium text-text-muted"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[var(--radius-md)] border border-border bg-ink/40 p-3 pr-11 text-sm text-text-primary outline-none transition-colors focus:border-signal focus:ring-1 focus:ring-signal/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p
              className={`mt-1.5 text-xs ${passwordTooShort ? "text-danger" : "text-text-muted"}`}
            >
              At least 8 characters.
            </p>
          </div>

          {error && (
            <div className="rounded-[var(--radius-md)] border border-danger/30 bg-danger/5 px-3.5 py-2.5 text-sm text-danger">
              {error}
            </div>
          )}

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-signal transition-colors hover:text-signal/80"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
