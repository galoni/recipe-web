# Implementation Plan: Authentication & User Session

**Branch**: `002-authentication` | **Date**: 2026-01-02 | **Spec**: [specs/002-authentication/spec.md](specs/002-authentication/spec.md)
**Input**: Feature specification from `/specs/002-authentication/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature implements a robust authentication system supporting **Google OAuth2** (Social Login) and **Email/Password** (with Magic Link readiness). It uses **JWTs** stored in securely configured **HttpOnly cookies** for session management, ensuring a seamless and secure "Smart Login" experience.

## Operational & Security Context

*   **Security**:
    *   **Auth**: OAuth2 state validation to prevent CSRF. Passwords hashed via Argon2.
    *   **Data Privacy**: PII (email, name) handling compliant with best practices.
    *   **Transport**: All tokens sent via HttpOnly, Secure, SameSite=Lax cookies.
*   **Observability**:
    *   Structured logs for `auth.login_success`, `auth.login_failure`, `auth.registration`.
    *   Metrics: Latency for third-party Google API calls.
*   **Environment**:
    *   **TRUE**: Dockerfile updates required to add `python-jose`, `passlib[argon2]`, `httpx` (for OAuth).
*   **Docs Impact**:
    *   New `docs/architecture/auth_flow.md` (Mermaid diagram of OAuth).
    *   New `docs/setup/env_vars.md` (Google Client ID/Secret setup).

## Technical Context

**Language/Version**: Python 3.11 (Backend), TypeScript/Next.js (Frontend)
**Primary Dependencies**:
*   Backend: `python-jose` (JWT), `passlib` (Hashing), `httpx` (Async OAuth requests).
*   Frontend: Native `fetch` with credential support.
**Storage**: PostgreSQL (Users table).
**Testing**: `pytest` (Backend), `playwright` (if setup) or Manual Verification (Frontend).
**Target Platform**: Linux (Docker).

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Infrastructure as Truth**: Dockerfile updates planned for new auth libraries.
- [x] **Backend Quality**: >80% coverage planned for `AuthService`. Regression not applicable yet (no AI), but contract tests included.
- [x] **Frontend Quality**: Manual validation steps defined in Spec using "Smart Login" flows.
- [x] **Security First**: strict OAuth2 state checks, password hashing, no sensitive data in logs.
- [x] **Operational Excellence**: JSON logs for all auth events.
- [x] **Living Documentation**: Updating `docs/` is a core task.
- [x] **Modularity**: Separation of `AuthService`, `OAuthProvider`, and `UserRepository`.
- [x] **UX Wow Factor**: "Continue with Google" button with proper branding and smooth redirect flows.

## Project Structure

### Documentation (this feature)

```text
specs/002-authentication/
├── plan.md              # This file
├── spec.md              # User Stories & Requirements
└── tasks.md             # Breakdown of work
```

### Source Code (repository root)

```text
# Web application (Fullstack)
backend/
├── src/
│   ├── models/
│   │   └── user.py           # User DB Model
│   ├── services/
│   │   ├── auth_service.py   # High-level logic (login, register, create_token)
│   │   └── security.py       # Hashing, JWT encoding/decoding
│   └── api/
│       ├── endpoints/
│       │   └── auth.py       # API Routes (login, callback, logout)
│       └── deps.py           # get_current_user dependency
└── tests/
    ├── unit/
    │   └── services/test_auth.py
    └── integration/
        └── api/test_auth_routes.py

frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SocialLoginButton.tsx
│   ├── app/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── lib/
│       └── auth.ts           # Token handling / Fetch wrappers
```

**Structure Decision**: Standard layered architecture (API -> Service -> CRUD -> Model).
*   **Why**: separation of concerns allows us to easily swap or add providers (e.g., adding GitHub Login later) without touching the API layer.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Custom OAuth implementation | To avoid heavy dependencies like `FastAPI-Users` initially and maintain full control/understanding of the flow. | `FastAPI-Users` is great but can be complex to customize for specific "Smart Login" UI flows or specific logging requirements defined in Constitution. |
