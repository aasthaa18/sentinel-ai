import { createBrowserRouter, Navigate } from "react-router"
import { AppShell } from "../components/layout/AppShell"
import DocumentsPage from "../pages/DocumentsPage"
import LandingPage from "../pages/LandingPage"
import PoliciesPage from "../pages/PoliciesPage"
import SecureChatPage from "../pages/SecureChatPage"
import SettingsPage from "../pages/SettingsPage"
import WorkspacePage from "../pages/WorkspacePage"

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  {
    Component: AppShell,
    children: [
      { path: "workspace", Component: WorkspacePage },
      { path: "chat", Component: SecureChatPage },
      { path: "documents", Component: DocumentsPage },
      { path: "policies", Component: PoliciesPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
])
