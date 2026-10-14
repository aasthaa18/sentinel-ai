import {
  ArrowRight,
  BarChart3,
  Bot,
  Download,
  FileSearch,
  History,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react"
import { Link } from "react-router"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import {
  Card,
  Badge,
  Button,
  EmptyState,
  SectionTitle,
} from "../components/common/UI"
import { PageHeader } from "../components/layout/AppShell"
import { usageSeries } from "../mocks/data"
import { useAppState } from "../state/AppState"

const actions = [
  {
    title: "Upload & Analyze",
    copy: "Send documents to the gateway for parsing and policy-aware inspection.",
    icon: Upload,
    to: "/documents",
    tone: "sage",
  },
  {
    title: "Secure Chat",
    copy: "Route a prompt through the configured backend security gateway.",
    icon: Bot,
    to: "/chat",
    tone: "olive",
  },
  {
    title: "Chat History",
    copy: "Review approved conversations and their gateway outcomes.",
    icon: History,
    to: "/chat",
    tone: "sand",
  },
  {
    title: "Privacy Controls",
    copy: "Manage retention, detection, and response-scanning preferences.",
    icon: LockKeyhole,
    to: "/settings",
    tone: "sage",
  },
]

export default function WorkspacePage() {
  const { user, metrics, activity } = useAppState()
  return (
    <div>
      <PageHeader
        eyebrow="Your workspace"
        title={`Good morning, ${user.name.split(" ")[0]}.`}
        description="A clear view of your organization's AI gateway activity and controls."
        action={
          <Button variant="secondary">
            <Download size={16} /> Export report
          </Button>
        }
      />
      <div className="metric-grid">
        {metrics.map((metric, index) => {
          const Icon =
            index === 0 ? FileSearch : index === 1 ? ShieldCheck : ShieldAlert
          return (
            <Card className="metric-card" key={metric.id}>
              <div className="metric-top">
                <span className={`metric-icon metric-${index}`}>
                  <Icon size={20} />
                </span>
                <Badge tone="success">
                  {metric.change && metric.change > 0 ? "+" : ""}
                  {metric.change}%
                </Badge>
              </div>
              <strong>{metric.value?.toLocaleString() ?? "—"}</strong>
              <span>{metric.label}</span>
            </Card>
          )
        })}
      </div>
      <div className="workspace-grid">
        <div className="workspace-primary">
          <div className="action-grid">
            {actions.map(({ title, copy, icon: Icon, to, tone }) => (
              <Link
                to={to}
                className={`action-card action-${tone}`}
                key={title}
              >
                <span className="action-icon">
                  <Icon size={22} />
                </span>
                <div>
                  <h2>{title}</h2>
                  <p>{copy}</p>
                </div>
                <span className="action-arrow">
                  <ArrowRight size={18} />
                </span>
                <div className="mini-illustration">
                  <span />
                  <span />
                  <span />
                </div>
              </Link>
            ))}
          </div>
          <Card className="chart-card">
            <SectionTitle
              icon={<BarChart3 size={19} />}
              title="Usage insights"
              description="Development dataset · last 7 days"
              action={
                <select className="mini-select" defaultValue="7">
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                </select>
              }
            />
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageSeries}>
                  <defs>
                    <linearGradient id="usageFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--olive)"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--olive)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      boxShadow: "var(--shadow)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="prompts"
                    stroke="var(--olive)"
                    strokeWidth={3}
                    fill="url(#usageFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        <div className="workspace-side">
          <Card>
            <SectionTitle
              icon={<Sparkles size={18} />}
              title="Recent security activity"
              description="Mock data is clearly isolated for development."
            />
            <div className="activity-list">
              {activity.length ? activity.slice(0, 4).map((item) => (
                  <div className="activity-item" key={item.id}>
                    <span className={`activity-dot ${item.action}`} />
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.detail}</p>
                    </div>
                    <time>{item.timestamp}</time>
                  </div>
                )) : <EmptyState
                  icon={<History />}
                  title="No activity yet"
                  description="Gateway events will appear here after your first request."
                />}
            </div>
          </Card>
          <Card className="integration-card">
            <span className="integration-icon">
              <ShieldCheck size={28} />
            </span>
            <div>
              <Badge tone="warning">Development mode</Badge>
              <h2>Connect your gateway</h2>
              <p>
                Set the API base URL to replace isolated mock dashboard data
                with live responses.
              </p>
              <Button
                variant="secondary"
                onClick={() => window.location.assign("/settings")}
              >
                Review integration <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
