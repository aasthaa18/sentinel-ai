import { apiRequest } from "./api"
import type { PolicyRule } from "../types"

export const policyService = {
  get: () => apiRequest<PolicyRule[]>("/policies"),
  update: (rules: PolicyRule[]) =>
    apiRequest<PolicyRule[]>("/policies", {
      method: "PUT",
      body: JSON.stringify({ rules }),
    }),
}
