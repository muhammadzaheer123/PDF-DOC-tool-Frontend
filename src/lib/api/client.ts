import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/lib/types/api.types";
import { AuthResultPayload } from "@/lib/types/auth.types";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "@/lib/auth/token-store";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

function isAuthEndpoint(url?: string): boolean {
  return AUTH_ENDPOINTS.some((path) => url?.includes(path));
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post<ApiResponse<AuthResultPayload>>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      { refreshToken }
    );

    if (!response.data.success || !response.data.data) {
      clearTokens();
      return null;
    }

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    setTokens(accessToken, newRefreshToken);
    return accessToken;
  } catch {
    clearTokens();
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (typeof error.config & { _retried?: boolean }) | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retried &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retried = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export async function handleApiCall<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<ApiResponse<T>> {
  try {
    const response = await promise;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<T>>;

    if (error.response?.status === 401) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Session expired. Please sign in again.",
        sessionExpired: true,
        data: null,
      };
    }

    const message = error.response?.data?.error ?? "Something went wrong. Please try again.";
    return {
      success: false,
      error: message,
      data: null,
    };
  }
}
