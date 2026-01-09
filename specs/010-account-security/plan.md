# Implementation Plan: Account Security & Session Management

**Branch**: `010-account-security` | **Date**: 2026-01-09 | **Spec**: `/specs/010-account-security/spec.md`
**Input**: Feature specification from `/specs/010-account-security/spec.md`

## Summary

The primary requirement is to elevate ChefStream's security by providing users with comprehensive visibility and control over their account access. The technical approach involves:
1.  **Session Tracking**: Implementing a database-backed session model that links JWT `jti` claims to device metadata (OS, browser, IP, location).
2.  **Device Management**: Providing a UI to view and revoke active sessions globally.
3.  **Two-Factor Authentication (2FA)**: Implementing TOTP-based 2FA using `pyotp` and providing a secure setup/recovery flow (backup codes).
4.  **Security Events**: Creating an audit log for sensitive events and notifying users via email.

## Operational & Security Context

*   **Security**: This feature directly addresses OWASP A01:2021-Broken Access Control and A07:2021-Identification and Authentication Failures. Security implications include managing encrypted TOTP secrets at rest and ensuring cryptographically secure session revocation.
*   **Observability**: All security events (login, logout, 2FA toggle, session revocation) will be recorded in a `security_events` table with structured JSON metadata for auditing and anomaly detection.
*   **Environment**: **True**. `backend/Dockerfile` and `pyproject.toml` need updates to include `pyotp`, `qrcode`, `ua-parser-python`, and `geoip2`.
*   **Docs Impact**: Updates required to `docs/architecture/auth.md` to describe the multi-stage 2FA login flow and session revocation architecture.

## Technical Context

**Language/Version**: Python 3.12 (Backend), TypeScript 5.3+ (Frontend)
**Primary Dependencies**: FastAPI, SQLAlchemy (Async), Next.js 14, Framer Motion, pyotp, qrcode, ua-parser-js
**Storage**: PostgreSQL (Alembic for migrations)
**Testing**: pytest (Backend), Playwright/Manual Browser Validation (Frontend)
**Target Platform**: Linux (via Docker Compose)
**Project Type**: Web application (FastAPI + Next.js)
**Performance Goals**: Session revocation propagation <1s, API response <150ms p95
**Constraints**: >80% backend coverage, strict Docker parity
**Scale/Scope**: Supports unlimited devices per user, 10 active sessions max (auto-cleanup)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Infrastructure as Truth**: Dockerfile updates planned for new security libraries.
- [x] **Backend Quality**: >80% coverage mandate for all new auth services.
- [x] **Frontend Quality**: Browser-side validation (Manual/Playwright) for 2FA flow.
- [x] **Security First**: Authz checks on session revocation; secret encryption planned.
- [x] **Operational Excellence**: Structured logging of all security events.
- [x] **Living Documentation**: Updating `docs/architecture/auth.md`.
- [x] **Modularity**: New logic decoupled into `app.services.security` and `app.api.endpoints.security`.
- [x] **UX Wow Factor**: Micro-animations for 2FA success and glassmorphism session cards.

## Project Structure

### Documentation (this feature)

```text
specs/010-account-security/
├── plan.md              # This file
├── spec.md              # Feature specification
└── tasks.md             # To be created by /speckit.tasks
```

### Source Code

```text
backend/
├── app/
│   ├── api/
│   │   └── endpoints/
│   │       ├── auth.py          # Modified: token generation includes jti
│   │       └── security.py      # New: session/2fa endpoints
│   ├── models/
│   │   ├── user.py              # Modified: 2fa/login fields
│   │   └── security.py          # New: Session, SecurityEvent models
│   ├── services/
│   │   ├── auth_service.py      # Modified: login flow with 2fa check
│   │   ├── security_service.py  # New: session/2fa logic
│   │   └── geoip.py             # New: IP to location helper
│   └── schemas/
│       ├── security.py          # New: Session/2fa Pydantic models
│       └── user.py              # Modified: security fields
└── tests/
    └── api/
        └── test_security.py     # New: API contract tests

frontend/
├── src/
│   ├── components/
│   │   └── security/
│   │       ├── SessionCard.tsx  # New: glassmorphism device card
│   │       ├── TwoFactorSetup.tsx # New: 2FA wizard
│   │       └── SecuritySettings.tsx # New: Main container
│   ├── lib/
│   │   ├── api.ts               # Modified: security endpoints
│   │   └── auth.ts              # Modified: 2fa handle during login
│   └── app/
│       └── settings/
│           └── security/
│               └── page.tsx     # New: Security settings page
└── tests/
    └── security.e2e.ts          # New: Critical path validation
```

**Structure Decision**: Web application structure with clear separation between core auth and extended security management.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Additional Libraries | `pyotp`, `ua-parser`, `qrcode` | Manual implementation of TOTP/parsing is error-prone and insecure. |
| Database Persistence | Sessions in DB | Redis only would lose data on restart; permanent audit log required. |
