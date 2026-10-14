import {
  Filter,
  LockKeyhole,
  Plus,
  Save,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserRoundCog,
} from "lucide-react"
import { useMemo, useState } from "react"
import {
  Badge,
  Button,
  Card,
  SectionTitle,
  Select,
  TextInput,
  Toast,
  Toggle,
} from "../components/common/UI"
import { PageHeader } from "../components/layout/AppShell"
import { policyService } from "../services/policyService"
import { useAppState } from "../state/AppState"
import type { PolicyRule, RuleAction } from "../types"

const presets = [
  {
    id: "standard",
    name: "Standard",
    copy: "Balanced masking and blocking for most teams.",
  },
  {
    id: "strict",
    name: "Strict",
    copy: "Block high-risk categories and mask identifiers.",
  },
  {
    id: "custom",
    name: "Custom",
    copy: "Fine-tune each structured policy rule.",
  },
  {
    id: "minimal",
    name: "Minimal",
    copy: "A small baseline for low-risk development.",
  },
]
const tabs = [
  "Detection rules",
  "Access control",
  "Data handling",
  "Prompt guardrails",
  "Response filter",
]

export default function PoliciesPage() {
  const { rules, setRules, demoMode } = useAppState()
  const [preset, setPreset] = useState("standard")
  const [tab, setTab] = useState(tabs[0])
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [dirty, setDirty] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    tone: "success" | "error"
  } | null>(null)
  const filtered = useMemo(
    () =>
      rules.filter(
        (rule) =>
          rule.category.toLowerCase().includes(query.toLowerCase()) &&
          (filter === "all" || rule.action.toLowerCase() === filter),
      ),
    [rules, query, filter],
  )
  const updateRule = (id: string, update: Partial<PolicyRule>) => {
    setRules(
      rules.map((rule) => (rule.id === id ? { ...rule, ...update } : rule)),
    )
    setDirty(true)
  }
  async function save() {
    if (demoMode) {
      setDirty(false)
      setToast({
        message:
          "Policy draft saved locally in development mode. It has not been enforced.",
        tone: "success",
      })
      return
    }
    try {
      setRules(await policyService.update(rules))
      setDirty(false)
      setToast({ message: "Policy updated by the backend.", tone: "success" })
    } catch {
      setToast({
        message: "Policy save failed. No backend enforcement changed.",
        tone: "error",
      })
    }
  }
  const active = rules.filter((rule) => rule.enabled).length

  return (
    <div>
      <PageHeader
        eyebrow="Policy engine"
        title="Security Policies"
        description="Define structured allow, mask, and block behavior for requests routed through your gateway."
        action={
          <Button onClick={() => void save()} disabled={!dirty}>
            <Save size={17} /> Save changes
          </Button>
        }
      />
      <div className="policy-tabs" role="tablist">
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
      <div className="policy-layout">
        <div className="policy-main">
          <Card>
            <SectionTitle
              icon={<SlidersHorizontal size={19} />}
              title="Predefined policy presets"
              description="Selecting a preset prepares a draft; it does not claim backend enforcement."
            />
            <div className="preset-grid">
              {presets.map((item) => (
                <button
                  key={item.id}
                  className={`preset-card ${
                    preset === item.id ? "active" : ""
                  }`}
                  onClick={() => {
                    setPreset(item.id)
                    setDirty(true)
                  }}
                >
                  <span className="preset-radio" />
                  <ShieldCheck size={22} />
                  <strong>{item.name}</strong>
                  <p>{item.copy}</p>
                </button>
              ))}
            </div>
          </Card>
          <Card className="rules-card">
            <SectionTitle
              icon={<Search size={19} />}
              title="Sensitive-data detection rules"
              description="Search, edit, and enable structured policy data."
              action={
                <Button variant="secondary">
                  <Plus size={16} /> Add rule
                </Button>
              }
            />
            <div className="rule-tools">
              <label>
                <Search size={16} />
                <TextInput
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search categories"
                />
              </label>
              <label>
                <Filter size={16} />
                <Select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                >
                  <option value="all">All actions</option>
                  <option value="allow">Allow</option>
                  <option value="mask">Mask</option>
                  <option value="block">Block</option>
                </Select>
              </label>
            </div>
            <div className="rules-table">
              <div className="rule-row rule-head">
                <span>Category</span>
                <span>Description</span>
                <span>Action</span>
                <span>Enabled</span>
              </div>
              {filtered.map((rule) => (
                <div className="rule-row" key={rule.id}>
                  <span>
                    <strong>{rule.category}</strong>
                  </span>
                  <span>{rule.description}</span>
                  <Select
                    value={rule.action}
                    onChange={(event) =>
                      updateRule(rule.id, {
                        action: event.target.value as RuleAction,
                      })
                    }
                  >
                    <option>Allow</option>
                    <option>Mask</option>
                    <option>Block</option>
                  </Select>
                  <Toggle
                    label={`Enable ${rule.category}`}
                    checked={rule.enabled}
                    onChange={(enabled) => updateRule(rule.id, { enabled })}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
        <aside className="policy-side">
          <Card>
            <SectionTitle
              icon={<ShieldCheck size={19} />}
              title="Policy status"
              action={
                <Badge tone={dirty ? "warning" : "neutral"}>
                  {dirty ? "Unsaved draft" : "Local state"}
                </Badge>
              }
            />
            <div className="policy-count">
              <strong>{active}</strong>
              <span>active rules</span>
            </div>
            <div className="policy-breakdown">
              <span>
                <i className="dot dot-sage" /> Masking{" "}
                <strong>
                  {
                    rules.filter(
                      (rule) => rule.enabled && rule.action === "Mask",
                    ).length
                  }
                </strong>
              </span>
              <span>
                <i className="dot dot-red" /> Blocking{" "}
                <strong>
                  {
                    rules.filter(
                      (rule) => rule.enabled && rule.action === "Block",
                    ).length
                  }
                </strong>
              </span>
              <span>
                <i className="dot dot-amber" /> Allowing{" "}
                <strong>
                  {
                    rules.filter(
                      (rule) => rule.enabled && rule.action === "Allow",
                    ).length
                  }
                </strong>
              </span>
            </div>
          </Card>
          <Card>
            <SectionTitle
              icon={<UserRoundCog size={19} />}
              title="Access-control roles"
              description="Visibility here is not backend authorization."
            />
            <div className="role-list">
              <span>
                <i>AD</i>
                <b>Administrator</b>
                <small>Configure policy drafts</small>
              </span>
              <span>
                <i>MB</i>
                <b>Member</b>
                <small>Use assigned resources</small>
              </span>
              <span>
                <i>VW</i>
                <b>Viewer</b>
                <small>Read-only access</small>
              </span>
            </div>
            <Button variant="secondary">
              <LockKeyhole size={16} /> Manage roles
            </Button>
          </Card>
        </aside>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}
