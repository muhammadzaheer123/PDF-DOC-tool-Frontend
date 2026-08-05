"use client";

import Link from "next/link";
import { ScanText, UserCircle } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export function Header() {
  const { user, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <ScanText size={20} className="text-signal" strokeWidth={1.75} />
          <span className="font-display text-lg tracking-tight text-text-primary">DocuForge</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-text-secondary sm:flex">
          <Link href="/#pdf-tools" className="hover:text-text-primary">
            PDF Tools
          </Link>
          <Link href="/#ai-tools" className="hover:text-text-primary">
            AI Tools
          </Link>
          <Link href="/pricing" className="hover:text-text-primary">
            Pricing
          </Link>
        </nav>

        {!isLoading && user ? (
          <Link
            href="/account"
            className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border px-4 py-2 text-sm text-text-primary hover:border-signal"
          >
            <UserCircle size={16} />
            {user.fullName.split(" ")[0]}
          </Link>
        ) : (
          <Link
            href="/login"
            className="rounded-[var(--radius-md)] border border-border px-4 py-2 text-sm text-text-primary hover:border-signal"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
