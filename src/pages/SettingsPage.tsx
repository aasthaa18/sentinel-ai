import {
  Bell,
  Building2,
  Database,
  Filter,
  Link2,
  Lock,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { useState, type ReactNode } from "react"
import {
  Button,
  Card,
  SectionTitle,
  Select,
  TextInput,
  Toast,
  Toggle,
} from "../components/common/UI"
import { PageHeader } from "../components/layout/AppShell"
import { settingsService } from "../services/settingsService"
import { useAppState } from "../state/AppState"
import type { SecuritySettings } from "../types"

const tabs = [
  "General",
  "Security",
  "Data handling",
  "Detection",
  "Notifications",
  "Integrations",
]

export default function SettingsPage() {
  const { settings, setSettings, demoMode } = useAppState()
  const [draft, setDraft] = useState(settings)
  const [tab, setTab] = useState("General")
  const [toast, setToast] = useState<{
    message: string
    tone: "success" | "error"
  } | null>(null)
  const changed = JSON.stringify(draft) !== JSON.stringify(settings)
  const update = <K extends keyof SecuritySettings,>(
    key: K,
    value: SecuritySettings[K],
  ) => setDraft((current) => ({ ...current, [key]: value }))
  async function save() {
    if (demoMode) {
      setSettings(draft)
      setToast({
        message: "Settings saved locally in development mode.",
        tone: "success",
      })
      return
    }
    try {
      const saved = await settingsService.update(draft)
      setSettings(saved)
      setDraft(saved)
      setToast({ message: "Settings updated by the backend.", tone: "success" })
    } catch {
      setToast({ message: "Settings could not be saved.", tone: "error" })
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Organization controls"
        title="Settings"
        description="Configure gateway behavior, privacy preferences, and account details."
        action={
          <div className="header-actions">
            <Button
              variant="ghost"
              disabled={!changed}
              onClick={() => setDraft(settings)}
            >
              Cancel
            </Button>
            <Button disabled={!changed} onClick={() => void save()}>
              <Save size={17} /> Save changes
            </Button>
          </div>
        }
      />
      <div className="policy-tabs settings-tabs" role="tablist">
        {tabs.map((item) => (
          <button
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? "active" : ""}
            onClick={() => setTab(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="settings-grid">
        <div className="settings-main">
          {(tab === "General" || tab === "Security") && (
            <>
              <Card>
                <SectionTitle
                  icon={<Building2 size={19} />}
                  title="Organization"
                  description="Basic identity used across your workspace."
                />
                <div className="form-grid">
                  <label>
                    <span>Organization name</span>
                    <TextInput
                      value={draft.organizationName}
                      onChange={(event) =>
                        update("organizationName", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span>Session timeout</span>
                    <Select
                      value={draft.sessionTimeout}
                      onChange={(event) =>
                        update("sessionTimeout", Number(event.target.value))
                      }
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>60 minutes</option>
                    </Select>
                  </label>
                </div>
              </Card>
              <Card>
                <SectionTitle
                  icon={<UserRound size={19} />}
                  title="Account profile"
                  description="Editable display details; authentication remains backend-owned."
                />
                <div className="form-grid">
                  <label>
                    <span>Display name</span>
                    <TextInput
                      value={draft.displayName}
                      onChange={(event) =>
                        update("displayName", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span>Email address</span>
                    <TextInput
                      type="email"
                      value={draft.email}
                      onChange={(event) => update("email", event.target.value)}
                    />
                  </label>
                </div>
              </Card>
            </>
          )}
          {(tab === "Data handling" || tab === "General") && (
            <Card>
              <SectionTitle
                icon={<Database size={19} />}
                title="Data handling"
                description="Control local preferences for future backend storage behavior."
              />
              <SettingRow
                title="Store conversation history"
                copy="Allow the backend to retain approved conversation records."
              >
                <Toggle
                  label="Store conversation history"
                  checked={draft.storeConversations}
                  onChange={(value) => update("storeConversations", value)}
                />
              </SettingRow>
              <SettingRow
                title="Retention period"
                copy="Requested retention window for stored records."
              >
                <Select
                  value={draft.retentionDays}
                  onChange={(event) =>
                    update("retentionDays", Number(event.target.value))
                  }
                >
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                </Select>
              </SettingRow>
            </Card>
          )}
          {(tab === "Detection" || tab === "Security" || tab === "General") && (
            <Card>
              <SectionTitle
                icon={<Filter size={19} />}
                title="Detection and filtering"
                description="These controls become effective only when enforced by your backend."
              />
              <SettingRow
                title="Sensitive-data detection"
                copy="Request PII and credential inspection."
              >
                <Toggle
                  label="Sensitive-data detection"
                  checked={draft.piiDetection}
                  onChange={(value) => update("piiDetection", value)}
                />
              </SettingRow>
              <SettingRow
                title="Prompt-injection detection"
                copy="Request direct injection analysis for prompts."
              >
                <Toggle
                  label="Prompt-injection detection"
                  checked={draft.injectionDetection}
                  onChange={(value) => update("injectionDetection", value)}
                />
              </SettingRow>
              <SettingRow
                title="Model-response scanning"
                copy="Request inspection before a response is returned."
              >
                <Toggle
                  label="Model-response scanning"
                  checked={draft.responseScanning}
                  onChange={(value) => update("responseScanning", value)}
                />
              </SettingRow>
            </Card>
          )}
          {(tab === "Notifications" || tab === "General") && (
            <Card>
              <SectionTitle
                icon={<Bell size={19} />}
                title="Notifications"
                description="Choose which backend events should generate alerts."
              />
              <SettingRow
                title="Policy violation alerts"
                copy="Notify workspace administrators of block events."
              >
                <Toggle
                  label="Policy alerts"
                  checked={draft.policyAlerts}
                  onChange={(value) => update("policyAlerts", value)}
                />
              </SettingRow>
              <SettingRow
                title="High-risk alerts"
                copy="Notify administrators of high-risk gateway outcomes."
              >
                <Toggle
                  label="Risk alerts"
                  checked={draft.riskAlerts}
                  onChange={(value) => update("riskAlerts", value)}
                />
              </SettingRow>
              <SettingRow
                title="Email notifications"
                copy="Requires a configured backend email provider."
              >
                <Toggle
                  label="Email notifications"
                  checked={draft.emailNotifications}
                  onChange={(value) => update("emailNotifications", value)}
                />
              </SettingRow>
            </Card>
          )}
          {tab === "Integrations" && (
            <Card>
              <SectionTitle
                icon={<Link2 size={19} />}
                title="Integrations"
                description="No third-party connection is claimed active until configured server-side."
              />
              <div className="integration-row">
                <span className="integration-logo">WH</span>
                <div>
                  <strong>Webhook destination</strong>
                  <p>Forward selected backend audit events.</p>
                </div>
                <Button variant="secondary">Configure</Button>
              </div>
              <div className="integration-row">
                <span className="integration-logo">SI</span>
                <div>
                  <strong>SIEM connector</strong>
                  <p>Planned endpoint for security operations tooling.</p>
                </div>
                <Button variant="secondary">Configure</Button>
              </div>
            </Card>
          )}
        </div>
        <aside className="settings-side">
          <Card className="profile-card">
            <span className="profile-avatar">
              {draft.displayName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </span>
            <h2>{draft.displayName}</h2>
            <p>{draft.email}</p>
            <span className="profile-role">
              <ShieldCheck size={15} /> Administrator
            </span>
          </Card>
          <Card>
            <SectionTitle icon={<Lock size={19} />} title="Security note" />
            <p className="card-copy">
              MFA, IP restrictions, encryption, and role enforcement must be
              implemented and verified by the backend before they are
              represented as active controls.
            </p>
          </Card>
          <Card>
            <SectionTitle title="Appearance" />
            <div className="appearance-options">
              <button
                className={draft.appearance === "light" ? "active" : ""}
                onClick={() => update("appearance", "light")}
              >
                Warm light
              </button>
              <button
                className={draft.appearance === "system" ? "active" : ""}
                onClick={() => update("appearance", "system")}
              >
                System
              </button>
            </div>
          </Card>
        </aside>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}

function SettingRow({
  title,
  copy,
  children,
}: {
  title: string
  copy: string
  children: ReactNode
}) {
  return (
    <div className="setting-row">
      <div>
        <strong>{title}</strong>
        <p>{copy}</p>
      </div>
      {children}
    </div>
  )
}
