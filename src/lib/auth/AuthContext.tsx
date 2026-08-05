"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/lib/types/auth.types";
import { loginRequest, registerRequest, logoutRequest, meRequest } from "@/lib/api/auth";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "@/lib/auth/token-store";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const restoreSession = useCallback(async () => {
    const hasAccessToken = !!getAccessToken();
    const hasRefreshToken = !!getRefreshToken();

    if (!hasAccessToken && !hasRefreshToken) {
      setIsLoading(false);
      return;
    }

    const response = await meRequest();

    if (response.success && response.data) {
      setUser({
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
        role: response.data.role,
      });
    } else {
      clearTokens();
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest(email, password);

    if (!response.success || !response.data) {
      return { success: false, error: response.error ?? "Login failed." };
    }

    setTokens(response.data.accessToken, response.data.refreshToken);
    setUser(response.data.user);
    return { success: true, error: null };
  }, []);

  const register = useCallback(async (fullName: string, email: string, password: string) => {
    const response = await registerRequest(fullName, email, password);

    if (!response.success || !response.data) {
      return { success: false, error: response.error ?? "Registration failed." };
    }

    setTokens(response.data.accessToken, response.data.refreshToken);
    setUser(response.data.user);
    return { success: true, error: null };
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    clearTokens();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
