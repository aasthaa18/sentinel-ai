import {
  Bell,
  BookOpen,
  Bot,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react"
import { useState, type ReactNode } from "react"
import { NavLink, Outlet, useLocation } from "react-router"
import { useAppState } from "../../state/AppState"
import { Badge, IconButton, TextInput } from "../common/UI"

const links = [
  { to: "/workspace", label: "Workspace", icon: LayoutDashboard },
  { to: "/chat", label: "Secure Chat", icon: Bot },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/policies", label: "Policies", icon: ShieldCheck },
  { to: "/settings", label: "Settings", icon: Settings },
]

function Brand() {
  return (
    <NavLink to="/" className="brand" aria-label="SentinelAI home">
      <span className="brand-mark">
        <ShieldCheck size={22} />
      </span>
      <span>
        Sentinel<span className="brand-accent">AI</span>
      </span>
    </NavLink>
  )
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, demoMode } = useAppState()
  const location = useLocation()
  const pageName =
    links.find((link) => location.pathname.startsWith(link.to))?.label ??
    "SentinelAI"
  return (
    <div className="app-layout">
      <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="sidebar-top">
          <Brand />
          <IconButton
            label="Close navigation"
            className="mobile-only"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </IconButton>
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `side-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-note">
          <BookOpen size={18} />
          <div>
            <strong>Gateway ready</strong>
            <span>API integration prepared</span>
          </div>
        </div>
        <div className="sidebar-profile">
          <span className="avatar">{user.initials}</span>
          <div>
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
          <ChevronDown size={16} />
        </div>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <IconButton
            label="Open navigation"
            className="mobile-only"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </IconButton>
          <div className="topbar-search">
            <Search size={17} />
            <TextInput
              aria-label={`Search ${pageName}`}
              placeholder={`Search ${pageName.toLowerCase()}…`}
            />
          </div>
          <div className="topbar-actions">
            {demoMode && <Badge tone="warning">Development mode</Badge>}
            <IconButton label="Notifications">
              <Bell size={19} />
            </IconButton>
            <span className="top-avatar">{user.initials}</span>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </header>
  )
}
