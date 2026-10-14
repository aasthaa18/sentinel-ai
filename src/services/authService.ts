import { apiRequest } from "./api"
import type { UserProfile } from "../types"

export const authService = {
  me: () => apiRequest<UserProfile>("/auth/me"),
  login: (email: string, password: string) =>
    apiRequest<UserProfile>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
}
