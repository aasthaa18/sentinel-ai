import { apiRequest } from "./api"
import type { ActivityEvent } from "../types"

export const auditService = {
  list: () => apiRequest<ActivityEvent[]>("/audit-logs"),
}
