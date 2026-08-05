export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResultPayload extends AuthTokens {
  user: AuthUser;
}

export interface ProfilePayload extends AuthUser {
  lastLoginAt: string | null;
}
