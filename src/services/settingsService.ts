import { apiRequest } from "./api"
import type { SecuritySettings } from "../types"

export const settingsService = {
  get: () => apiRequest<SecuritySettings>("/settings"),
  update: (settings: SecuritySettings) =>
    apiRequest<SecuritySettings>("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),
}
