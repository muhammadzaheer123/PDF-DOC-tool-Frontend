"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/lib/types/auth.types";
import {
  loginRequest,
  registerRequest,
  logoutRequest,
  meRequest,
  refreshRequest,
} from "@/lib/api/auth";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "@/lib/auth/token-store";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error: string | null }>;
  register: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeExpiryMs(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSilentRefresh = useCallback((accessToken: string) => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);

    const expiryMs = decodeExpiryMs(accessToken);
    if (!expiryMs) return;

    // Refresh 60 seconds before it actually expires
    const delay = Math.max(expiryMs - Date.now() - 60_000, 5_000);

    refreshTimer.current = setTimeout(async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return;

      const response = await refreshRequest(refreshToken);
      if (response.success && response.data) {
        setTokens(response.data.accessToken, response.data.refreshToken);
        scheduleSilentRefresh(response.data.accessToken);
      }
    }, delay);
  }, []);

  const restoreSession = useCallback(async () => {
    const accessToken = getAccessToken();
    const hasRefreshToken = !!getRefreshToken();

    if (!accessToken && !hasRefreshToken) {
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
      const freshToken = getAccessToken();
      if (freshToken) scheduleSilentRefresh(freshToken);
    } else {
      clearTokens();
      setUser(null);
    }

    setIsLoading(false);
  }, [scheduleSilentRefresh]);

  useEffect(() => {
    void restoreSession();
    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, [restoreSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await loginRequest(email, password);

      if (!response.success || !response.data) {
        return { success: false, error: response.error ?? "Login failed." };
      }

      setTokens(response.data.accessToken, response.data.refreshToken);
      setUser(response.data.user);
      scheduleSilentRefresh(response.data.accessToken);
      return { success: true, error: null };
    },
    [scheduleSilentRefresh],
  );

  const register = useCallback(
    async (fullName: string, email: string, password: string) => {
      const response = await registerRequest(fullName, email, password);

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error ?? "Registration failed.",
        };
      }

      setTokens(response.data.accessToken, response.data.refreshToken);
      setUser(response.data.user);
      scheduleSilentRefresh(response.data.accessToken);
      return { success: true, error: null };
    },
    [scheduleSilentRefresh],
  );

  const logout = useCallback(async () => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    // Clear client state first — logout should feel instant regardless of network speed
    clearTokens();
    setUser(null);
    router.push("/login");
    // Best-effort: tell the backend too, but don't block the UI on it
    void logoutRequest();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
