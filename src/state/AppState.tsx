import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"
import {
  mockActivity,
  mockDocuments,
  mockMetrics,
  mockRules,
  mockSettings,
  mockUser,
} from "../mocks/data"
import type {
  ActivityEvent,
  DocumentRecord,
  PolicyRule,
  SecuritySettings,
} from "../types"

interface AppStateValue {
  user: typeof mockUser
  metrics: typeof mockMetrics
  activity: ActivityEvent[]
  addActivity: (event: ActivityEvent) => void
  rules: PolicyRule[]
  setRules: (rules: PolicyRule[]) => void
  settings: SecuritySettings
  setSettings: (settings: SecuritySettings) => void
  documents: DocumentRecord[]
  setDocuments: Dispatch<SetStateAction<DocumentRecord[]>>
  demoMode: boolean
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [activity, setActivity] = useState(mockActivity)
  const [rules, setRules] = useState(mockRules)
  const [settings, setSettings] = useState(mockSettings)
  const [documents, setDocuments] = useState(mockDocuments)
  const value = useMemo(
    () => ({
      user: mockUser,
      metrics: mockMetrics,
      activity,
      addActivity: (event: ActivityEvent) =>
        setActivity((current) => [event, ...current]),
      rules,
      setRules,
      settings,
      setSettings,
      documents,
      setDocuments,
      demoMode: !import.meta.env.VITE_API_BASE_URL,
    }),
    [activity, documents, rules, settings],
  )
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context)
    throw new Error("useAppState must be used within AppStateProvider")
  return context
}
