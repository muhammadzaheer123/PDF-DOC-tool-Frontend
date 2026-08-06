"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScanText, ChevronDown, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export function Header() {
  const { user, isLoading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.fullName
    ?.split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <ScanText size={20} className="text-signal" strokeWidth={1.75} />
          <span className="font-display text-lg tracking-tight text-text-primary">
            DocuForge
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-text-secondary sm:flex">
          <Link
            href="/#pdf-tools"
            className="transition-colors hover:text-text-primary"
          >
            PDF Tools
          </Link>
          <Link
            href="/#ai-tools"
            className="transition-colors hover:text-text-primary"
          >
            AI Tools
          </Link>
          <Link
            href="/pricing"
            className="transition-colors hover:text-text-primary"
          >
            Pricing
          </Link>
        </nav>

        {!isLoading && user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border py-1.5 pl-1.5 pr-3 text-sm text-text-primary transition-colors hover:border-signal"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal/15 text-xs font-semibold text-signal">
                {initials}
              </span>
              {user.fullName.split(" ")[0]}
              <ChevronDown
                size={14}
                className={`text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-lg shadow-black/40">
                <div className="border-b border-border px-4 py-3">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {user.fullName}
                  </p>
                  <p className="truncate text-xs text-text-muted">
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setOpen(false);
                    router.push("/account");
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-ink/60 hover:text-text-primary"
                >
                  <User size={15} />
                  Account
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    void logout();
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-signal/10 hover:text-signal"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-[var(--radius-md)] border border-border px-4 py-2 text-sm text-text-primary transition-colors hover:border-signal hover:text-signal"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
