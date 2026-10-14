import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock3,
  Paperclip,
  Send,
  ShieldCheck,
} from "lucide-react"
import { FormEvent, useState } from "react"
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Loading,
  SectionTitle,
} from "../components/common/UI"
import { PageHeader } from "../components/layout/AppShell"
import { chatService } from "../services/chatService"
import { useAppState } from "../state/AppState"
import type { ChatGatewayResponse, ChatMessage } from "../types"

export default function SecureChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<ChatGatewayResponse | null>(null)
  const { addActivity } = useAppState()

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!input.trim() || loading) return
    const content = input.trim()
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content },
    ])
    setInput("")
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const response = await chatService.send(content)
      setResult(response)
      if (response.response && !response.blocked)
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: response.response!,
            action: response.action,
            categories: response.detected_categories,
            riskLevel: response.risk_level,
          },
        ])
      if (response.blocked)
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "system",
            content:
              response.explanation ??
              "This request was blocked by the active security policy.",
            action: "blocked",
            categories: response.detected_categories,
          },
        ])
      addActivity({
        id: response.request_id,
        title: `Request ${response.action}`,
        detail:
          response.detected_categories.join(", ") || "No categories returned",
        timestamp: "Just now",
        action: response.action,
      })
    } catch {
      setError(
        "The security gateway could not be reached. No model request was sent. Check your backend connection and try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-page">
      <PageHeader
        eyebrow="Gateway conversation"
        title="Secure Chat"
        description="Every submitted prompt is sent to your backend gateway. The browser never calls an AI provider directly."
      />
      <div className="chat-layout">
        <Card className="chat-main">
          <div className="message-list" aria-live="polite">
            {!messages.length && !loading && (
              <EmptyState
                icon={<ShieldCheck size={32} />}
                title="Start a gateway-protected conversation"
                description="Your prompt has not been checked yet. Submit a message to receive the backend's actual allow, mask, or block decision."
              />
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message message-${message.role}`}
              >
                <span className="message-avatar">
                  {message.role === "user" ? (
                    "You"
                  ) : message.role === "assistant" ? (
                    <Bot size={18} />
                  ) : (
                    <ShieldCheck size={18} />
                  )}
                </span>
                <div>
                  <p>{message.content}</p>
                  {message.action && (
                    <Badge
                      tone={
                        message.action === "blocked"
                          ? "danger"
                          : message.action === "masked"
                            ? "warning"
                            : "success"
                      }
                    >
                      {message.action}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message message-system">
                <span className="message-avatar">
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <Loading label="Gateway is inspecting the request…" />
                  <p className="loading-note">
                    Waiting for a policy decision. Safety has not been
                    determined yet.
                  </p>
                </div>
              </div>
            )}
            {error && (
              <div className="chat-error">
                <AlertTriangle size={19} />
                <div>
                  <strong>Gateway unavailable</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}
          </div>
          <form className="composer" onSubmit={submit}>
            <Button type="button" variant="ghost" aria-label="Attach document">
              <Paperclip size={19} />
            </Button>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask anything securely…"
              aria-label="Secure message"
              rows={1}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
            />
            <Button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send through gateway"
            >
              <Send size={18} />
            </Button>
          </form>
        </Card>
        <aside className="chat-side">
          <Card>
            <SectionTitle
              icon={<ShieldCheck size={18} />}
              title="Security status"
              action={
                <Badge
                  tone={
                    result
                      ? result.action === "blocked"
                        ? "danger"
                        : result.action === "masked"
                          ? "warning"
                          : "success"
                      : "neutral"
                  }
                >
                  {result ? result.action : "Not checked yet"}
                </Badge>
              }
            />
            <div className="security-orb">
              <span>{result ? result.risk_level : "—"}</span>
              <small>Risk level</small>
            </div>
            <div className="security-details">
              <span>
                <i className="dot dot-sage" /> Personal information{" "}
                <strong>
                  {result?.detected_categories.includes("personal_information")
                    ? 1
                    : 0}
                </strong>
              </span>
              <span>
                <i className="dot dot-amber" /> Credentials{" "}
                <strong>
                  {result?.detected_categories.includes("credentials") ? 1 : 0}
                </strong>
              </span>
              <span>
                <i className="dot dot-red" /> Prompt injection{" "}
                <strong>
                  {result?.detected_categories.includes("prompt_injection")
                    ? 1
                    : 0}
                </strong>
              </span>
            </div>
          </Card>
          <Card>
            <SectionTitle icon={<Clock3 size={18} />} title="Recent activity" />
            {result ? (
              <div className="result-summary">
                <Badge
                  tone={
                    result.blocked
                      ? "danger"
                      : result.masked
                        ? "warning"
                        : "success"
                  }
                >
                  {result.status}
                </Badge>
                <p>Request {result.request_id}</p>
                {result.latency_ms && <small>{result.latency_ms} ms</small>}
              </div>
            ) : (
              <EmptyState
                icon={<Clock3 />}
                title="No recent activity"
                description="Current-session gateway events will appear here."
              />
            )}
          </Card>
          <Card className="safety-card">
            <CheckCircle2 size={22} />
            <div>
              <h3>Model response safety</h3>
              <p>
                Approved responses are shown only after the backend returns
                them.
              </p>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
