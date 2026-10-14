import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  FileSearch,
  Fingerprint,
  Menu,
  ScanSearch,
  Settings2,
  Shield,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import { Button } from "../components/common/UI"

const features = [
  {
    icon: ScanSearch,
    title: "Detect Sensitive Data",
    copy: "Inspect routed prompts for personal information, credentials, and confidential data.",
  },
  {
    icon: Fingerprint,
    title: "Prevent Prompt Attacks",
    copy: "Apply configurable guardrails to suspicious direct prompt-injection attempts.",
  },
  {
    icon: FileSearch,
    title: "Access-Controlled RAG",
    copy: "Prepare retrieval workflows around document-level user permissions.",
  },
  {
    icon: BarChart3,
    title: "Monitor and Audit",
    copy: "Review privacy-aware gateway events and policy outcomes from one workspace.",
  },
  {
    icon: Settings2,
    title: "Flexible Security Policies",
    copy: "Choose allow, mask, or block actions for the data categories that matter.",
  },
]

function Logo() {
  return (
    <Link to="/" className="brand landing-brand">
      <span className="brand-mark">
        <ShieldCheck size={22} />
      </span>
      <span>
        Sentinel<span className="brand-accent">AI</span>
      </span>
    </Link>
  )
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="landing">
      <nav className="landing-nav" aria-label="Marketing navigation">
        <Logo />
        <div className={`landing-links ${menuOpen ? "is-open" : ""}`}>
          {["Product", "Features", "Use Cases", "Pricing", "Resources"].map(
            (item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}>
                {item}
              </a>
            ),
          )}
          <div className="landing-mobile-actions">
            <Link to="/workspace">Sign in</Link>
            <Link to="/workspace" className="button button-primary">
              Get started
            </Link>
          </div>
        </div>
        <div className="landing-actions">
          <Link to="/workspace" className="button button-ghost">
            Sign in
          </Link>
          <Link to="/workspace" className="button button-primary">
            Get started <ArrowRight size={17} />
          </Link>
        </div>
        <Button
          variant="ghost"
          className="landing-menu"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </Button>
      </nav>

      <main>
        <section className="hero" id="product">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />
          <div className="hero-copy">
            <span className="hero-kicker">
              <Sparkles size={14} /> AI security gateway
            </span>
            <h1>
              Stop Data Leaks
              <br />
              Before They Happen.
            </h1>
            <p>
              Inspect, mask, and block sensitive information in AI requests
              routed through the SentinelAI gateway—before prompts reach your
              model.
            </p>
            <div className="hero-actions">
              <Link
                to="/workspace"
                className="button button-primary button-large"
              >
                Start in development mode <ArrowRight size={18} />
              </Link>
              <a
                href="#features"
                className="button button-secondary button-large"
              >
                Explore capabilities
              </a>
            </div>
            <div className="trust-row">
              <span>
                <Check size={15} /> Policy driven
              </span>
              <span>
                <Check size={15} /> Backend ready
              </span>
              <span>
                <Check size={15} /> Provider agnostic
              </span>
            </div>
          </div>
          <div
            className="gateway-visual"
            aria-label="Security gateway flow illustration"
          >
            <div className="flow-line flow-line-top" />
            <div className="flow-node prompt-node">
              <Bot size={18} />
              <span>
                <small>Incoming</small>User prompt
              </span>
            </div>
            <div className="gateway-core">
              <div className="gateway-ring gateway-ring-one" />
              <div className="gateway-ring gateway-ring-two" />
              <span className="gateway-shield">
                <Shield size={48} />
              </span>
              <small>Policy engine</small>
              <strong>Security Gateway</strong>
              <div className="gateway-actions">
                <span>Detect</span>
                <span>Mask</span>
                <span>Block</span>
              </div>
            </div>
            <div className="flow-node model-node">
              <Sparkles size={18} />
              <span>
                <small>Approved route</small>AI model
              </span>
            </div>
            <div className="flow-node response-node">
              <Check size={18} />
              <span>
                <small>Scanned</small>Safe response
              </span>
            </div>
          </div>
        </section>

        <section className="feature-section" id="features">
          <div className="feature-heading">
            <span className="eyebrow">Defense in depth</span>
            <h2>One gateway. Five layers of control.</h2>
            <p>
              Purpose-built surfaces for teams preparing secure, governed AI
              workflows.
            </p>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, copy }, index) => (
              <article className="feature-card" key={title}>
                <span className="feature-number">0{index + 1}</span>
                <span className="feature-icon">
                  <Icon size={23} />
                </span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <Link to="/workspace" aria-label={`Explore ${title}`}>
                  <ArrowRight size={18} />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="landing-footer">
        <Logo />
        <p>Security controls for AI requests routed through your gateway.</p>
        <span>© 2026 SentinelAI</span>
      </footer>
    </div>
  )
}
