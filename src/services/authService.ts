import api from "./apiClient";
import { LoginPayload, LoginResponse } from "@/models/auth";
import { RegisterPayload, User } from "@/models/user";

// Note: Backend doesn't have JWT auth yet, so login is not implemented
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  // TODO: Backend needs to implement /auth/login endpoint
  throw new Error("Login endpoint not implemented in backend yet");
}

// Backend returns User directly, not { token, user }
export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

// Note: Backend doesn't have this endpoint yet
export async function getCurrentUser(): Promise<User> {
  // TODO: Backend needs to implement /auth/me endpoint
  throw new Error("Get current user endpoint not implemented in backend yet");
}
