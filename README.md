# SentinelAI Frontend

Responsive React + TypeScript interface for a backend-ready AI security gateway. The UI uses a warm ivory, sage, and olive design system and includes six complete routes:

- `/` — marketing landing page
- `/workspace` — dashboard and usage workspace
- `/chat` — backend-routed secure chat
- `/documents` — untrusted document upload and library
- `/policies` — structured security policy management
- `/settings` — organization, security, retention, detection, and notification settings

## Run locally

```bash
pnpm install
pnpm dev
```

Build for production:

```bash
pnpm build
```

## Connect a FastAPI backend

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_BASE_URL` to the public base URL of your backend API.
3. Implement the proposed endpoints below and allow credentialed requests from the frontend origin.
4. Restart Vite after changing environment variables.

The browser service layer lives in `src/services`. Planned contracts:

- `POST /auth/login`, `GET /auth/me`
- `POST /chat`
- `GET /activity`, `GET /dashboard`
- `GET /documents`, `POST /documents`
- `GET /policies`, `PUT /policies`
- `GET /settings`, `PUT /settings`
- `GET /audit-logs`

`VITE_API_BASE_URL=http://localhost:8000/api` makes these resolve to the requested `/api/...` endpoints. Do not place provider keys, database credentials, or other secrets in browser environment variables.

## Functional now

- Responsive routing and navigation
- Editable settings with save/cancel and explicit development-mode behavior
- Searchable, filterable, editable policy data
- Document drag-and-drop, type validation, permissions, and upload/error states
- Chat submission through the dedicated API service, loading/blocked/error response presentation
- Dynamic dashboard cards, activity, filters, charts, toggles, tabs, and notifications

## Requires backend implementation

- Authentication and authorization enforcement
- Actual prompt, response, and document security scanning
- AI model invocation
- Persistent database storage
- Document parsing, embeddings, RAG, and document-level permission enforcement
- MFA, SIEM/webhook integrations, email delivery, and audit export

## Replacing mocks

Mock data is isolated in `src/mocks/data.ts` and exposed through `src/state/AppState.tsx`. Replace each initial state value with the corresponding service request, or hydrate the provider from a query/cache layer. Page components already consume typed state rather than embedding permanent user, policy, document, or metric values. Chat never falls back to a fabricated result: without a backend it reports a connection error and does not show an AI response.
