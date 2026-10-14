export type SecurityAction = "allowed" | "masked" | "blocked"
export type RiskLevel = "low" | "medium" | "high"
export type RuleAction = "Allow" | "Mask" | "Block"

export interface UserProfile {
  id: string
  name: string
  email: string
  role: "Admin" | "Member"
  initials: string
}

export interface Organization {
  name: string
  industry: string
  region: string
}

export interface DashboardMetric {
  id: string
  label: string
  value: number | null
  change?: number
}

export interface ActivityEvent {
  id: string
  title: string
  detail: string
  timestamp: string
  action: SecurityAction
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  action?: SecurityAction
  categories?: string[]
  riskLevel?: RiskLevel
}

export interface ChatGatewayResponse {
  request_id: string
  action: SecurityAction
  status: "success" | "error"
  detected_categories: string[]
  masked: boolean
  blocked: boolean
  risk_level: RiskLevel
  response?: string
  explanation?: string
  model?: string
  latency_ms?: number
}

export interface PolicyRule {
  id: string
  category: string
  description: string
  action: RuleAction
  enabled: boolean
}

export interface SecuritySettings {
  organizationName: string
  displayName: string
  email: string
  retentionDays: number
  storeConversations: boolean
  piiDetection: boolean
  injectionDetection: boolean
  responseScanning: boolean
  policyAlerts: boolean
  riskAlerts: boolean
  emailNotifications: boolean
  sessionTimeout: number
  appearance: "light" | "system"
}

export interface DocumentRecord {
  id: string
  name: string
  type: "PDF" | "TXT" | "DOCX"
  size: string
  uploadedAt: string
  status: "pending" | "uploading" | "scanning" | "ready" | "failed"
  permission: "Private" | "Team" | "Organization"
  findings?: string[]
  progress?: number
}
