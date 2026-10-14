import { apiRequest } from "./api"
import type { ActivityEvent, DashboardMetric } from "../types"

export const dashboardService = {
  getDashboard: () =>
    apiRequest<{ metrics: DashboardMetric[] activity: ActivityEvent[] }>(
      "/dashboard",
    ),
  getActivity: () => apiRequest<ActivityEvent[]>("/activity"),
}
