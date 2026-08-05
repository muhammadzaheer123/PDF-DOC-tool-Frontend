import { apiClient, handleApiCall } from "@/lib/api/client";
import { AuthResultPayload, ProfilePayload } from "@/lib/types/auth.types";

export async function registerRequest(fullName: string, email: string, password: string) {
  return handleApiCall<AuthResultPayload>(apiClient.post("/auth/register", { fullName, email, password }));
}

export async function loginRequest(email: string, password: string) {
  return handleApiCall<AuthResultPayload>(apiClient.post("/auth/login", { email, password }));
}

export async function refreshRequest(refreshToken: string) {
  return handleApiCall<AuthResultPayload>(apiClient.post("/auth/refresh", { refreshToken }));
}

export async function logoutRequest() {
  return handleApiCall<{ loggedOut: boolean }>(apiClient.post("/auth/logout"));
}

export async function meRequest() {
  return handleApiCall<ProfilePayload>(apiClient.get("/auth/me"));
}
