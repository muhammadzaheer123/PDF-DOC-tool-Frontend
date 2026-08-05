"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";

function AccountContent() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl text-text-primary">Your account</h1>
      <div className="mt-6 space-y-3 rounded-[var(--radius-lg)] border border-border bg-surface p-6 text-sm">
        <div>
          <span className="text-text-muted">Name</span>
          <p className="text-text-primary">{user?.fullName}</p>
        </div>
        <div>
          <span className="text-text-muted">Email</span>
          <p className="text-text-primary">{user?.email}</p>
        </div>
        <div>
          <span className="text-text-muted">Role</span>
          <p className="text-text-primary capitalize">{user?.role}</p>
        </div>
      </div>
      <Button variant="secondary" className="mt-6 w-full" onClick={() => void logout()}>
        Sign out
      </Button>
    </div>
  );
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}
