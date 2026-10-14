import type {
  ActivityEvent,
  DashboardMetric,
  DocumentRecord,
  Organization,
  PolicyRule,
  SecuritySettings,
  UserProfile,
} from "../types"

export const mockUser: UserProfile = {
  id: "usr_demo",
  name: "Maya Chen",
  email: "maya@northstar.dev",
  role: "Admin",
  initials: "MC",
}

export const mockOrganization: Organization = {
  name: "Northstar Labs",
  industry: "Technology",
  region: "India",
}

export const mockMetrics: DashboardMetric[] = [
  { id: "scanned", label: "Prompts scanned", value: 2847, change: 12 },
  { id: "masked", label: "Items masked", value: 148, change: 8 },
  { id: "blocked", label: "Threats blocked", value: 37, change: -4 },
]

export const mockActivity: ActivityEvent[] = [
  {
    id: "a1",
    title: "Credential pattern blocked",
    detail: "Secure Chat · Strict policy",
    timestamp: "12 min ago",
    action: "blocked",
  },
  {
    id: "a2",
    title: "Email address masked",
    detail: "Document analysis · Standard policy",
    timestamp: "1 hr ago",
    action: "masked",
  },
  {
    id: "a3",
    title: "Request approved",
    detail: "Secure Chat · No sensitive data",
    timestamp: "3 hrs ago",
    action: "allowed",
  },
]

export const mockRules: PolicyRule[] = [
  {
    id: "email",
    category: "Email addresses",
    description: "Detects personal and company email patterns",
    action: "Mask",
    enabled: true,
  },
  {
    id: "phone",
    category: "Phone numbers",
    description: "Detects regional and international numbers",
    action: "Mask",
    enabled: true,
  },
  {
    id: "aadhaar",
    category: "Aadhaar numbers",
    description: "Detects 12-digit Aadhaar identifiers",
    action: "Block",
    enabled: true,
  },
  {
    id: "pan",
    category: "PAN identifiers",
    description: "Detects Indian tax identifiers",
    action: "Mask",
    enabled: true,
  },
  {
    id: "keys",
    category: "API keys and tokens",
    description: "Detects common secret and token patterns",
    action: "Block",
    enabled: true,
  },
  {
    id: "financial",
    category: "Financial information",
    description: "Detects card and account number patterns",
    action: "Mask",
    enabled: true,
  },
  {
    id: "confidential",
    category: "Confidential keywords",
    description: "Matches organization-defined terms",
    action: "Block",
    enabled: false,
  },
  {
    id: "credentials",
    category: "Credentials and secrets",
    description: "Detects passwords and credential strings",
    action: "Block",
    enabled: true,
  },
]

export const mockSettings: SecuritySettings = {
  organizationName: mockOrganization.name,
  displayName: mockUser.name,
  email: mockUser.email,
  retentionDays: 30,
  storeConversations: true,
  piiDetection: true,
  injectionDetection: true,
  responseScanning: true,
  policyAlerts: true,
  riskAlerts: true,
  emailNotifications: false,
  sessionTimeout: 30,
  appearance: "light",
}

export const mockDocuments: DocumentRecord[] = []

export const usageSeries = [
  { day: "Mon", prompts: 320, blocked: 4 },
  { day: "Tue", prompts: 410, blocked: 7 },
  { day: "Wed", prompts: 355, blocked: 3 },
  { day: "Thu", prompts: 520, blocked: 8 },
  { day: "Fri", prompts: 470, blocked: 6 },
  { day: "Sat", prompts: 260, blocked: 2 },
  { day: "Sun", prompts: 512, blocked: 7 },
]
