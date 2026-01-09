# Tasks: Account Security & Session Management

**Input**: Design documents from `/specs/010-account-security/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan (backend security files, frontend security components)
- [x] T002 Install backend dependencies: `pyotp`, `qrcode`, `ua-parser-python`, `geoip2` in `backend/pyproject.toml`
- [x] T003 [P] Install frontend dependencies: `ua-parser-js`, `qrcode.react` in `frontend/package.json`
- [ ] T004 Verify Dockerfiles are updated with new system dependencies (if any, e.g., libmaxminddb for geoip)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T005 Create database migrations for `users`, `sessions`, and `security_events` tables in `backend/alembic/versions/`
- [x] T006 Extend `User` model in `backend/app/models/user.py` with security fields
- [x] T007 Implement `Session` and `SecurityEvent` models in `backend/app/models/security.py`
- [x] T008 [P] Update `settings` in `backend/app/core/config.py` with security-related configs (secret keys, TOTP issuer)
- [x] T009 Implement `SecurityService` in `backend/app/services/security_service.py` with basic session creation/lookup logic
- [x] T010 Implement `GeoIPService` in `backend/app/services/geoip.py` (stub or mock initially if DB not ready)
- [x] T011 Update `AuthService` in `backend/app/services/auth_service.py` to support session creation upon login

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Session Visibility & Last Login Tracking (Priority: P1) 🎯 MVP

**Goal**: Track and display when and from where the user last logged in.

**Independent Test**: Use Swagger UI or Postman to log in and then check `/api/v1/auth/me` for updated `last_login_at` and `last_login_ip`.

### Implementation for User Story 1

- [x] T012 [US1] Update login endpoint in `backend/app/api/endpoints/auth.py` to record `last_login_at` and `last_login_ip`
- [x] T013 [US1] Update `User` schema in `backend/app/schemas/user.py` to include last login fields
- [x] T014 [US1] Update `get_me` endpoint in `backend/app/api/endpoints/auth.py` to return last login info
- [x] T015 [US1] Implement `SessionCard` component in `frontend/src/components/security/SessionCard.tsx` for visual display
- [x] T016 [US1] Create security settings page in `frontend/src/app/settings/security/page.tsx` and display last login info

**Checkpoint**: Last login tracking is functional and visible in UI.

---

## Phase 4: User Story 2 - Active Device/Session Management (Priority: P2)

**Goal**: View and manage all devices currently logged into the account.

**Independent Test**: Log in from two different browsers, verify both appear in the session list, and revoke one to see it logged out.

### Tests for User Story 2

- [ ] T017 [US2] Contract test for session listing and revocation in `backend/tests/api/test_security.py`

### Implementation for User Story 2

- [x] T018 [US2] Complete `SecurityService` methods for listing and revoking sessions
- [x] T019 [US2] Implement API endpoints for session management in `backend/app/api/endpoints/security.py`
- [x] T020 [US2] Implement User-Agent parsing in `backend/app/services/security_service.py` using `ua-parser`
- [x] T021 [US2] Update frontend API client in `frontend/src/lib/api.ts` with session management methods
- [x] T022 [US2] Create `SessionList` component in `frontend/src/components/security/SessionList.tsx`
- [x] T023 [US2] Integrate `SessionList` into the security settings page

**Checkpoint**: Active session management is functional - users can see and revoke their devices.

---

## Phase 5: User Story 3 - Two-Factor Authentication (2FA) (Priority: P3)

**Goal**: Enable TOTP-based 2FA with backup recovery codes for enhanced account protection.

**Independent Test**: Enable 2FA, log out, and verify that login now requires a valid TOTP code from an authenticator app.

### Tests for User Story 3

- [ ] T024 [US3] Contract test for 2FA setup, enable, and verify flow in `backend/tests/api/test_security.py`

### Implementation for User Story 3

- [x] T025 [US3] Implement TOTP generation and verification in `SecurityService` using `pyotp`
- [x] T026 [US3] Implement QR code generation in `backend/app/api/endpoints/security.py` using `qrcode`
- [ ] T027 [US3] Implement backup code generation and hashing logic
- [x] T028 [US3] Create 2FA management endpoints (setup, enable, disable, recovery codes)
- [x] T029 [US3] Update login flow in `backend/app/api/endpoints/auth.py` to handle 2FA challenge
- [x] T030 [US3] Create `TwoFactorSetup` wizard in `frontend/src/components/security/TwoFactorSetup.tsx`
- [x] T031 [US3] Create `TwoFactorVerify` login component for the 2FA challenge
- [x] T032 [US3] Integrate 2FA management into the security settings page

**Checkpoint**: 2FA is fully functional - users can secure their accounts with TOTP.

---

## Phase 6: User Story 4 - Security Notifications (Priority: P4)

**Goal**: Proactive security alerts via email for critical account events.

**Independent Test**: Log in from a new device and verify an email notification is received.

### Implementation for User Story 4

- [x] T033 [US4] Implement security event logging in `SecurityService`
- [x] T034 [US4] Implement email notification logic for "New Device Login" event
- [x] T035 [US4] Implement email notification logic for 2FA changes (Enable/Disable)
- [ ] T036 [US4] Implement email notification logic for password changes
- [x] T037 [US4] Create email templates for security notifications
- [x] T038 [US4] Add notification toggle in frontend security settings

**Checkpoint**: Security notifications are active - users are proactively informed of potential threats.

---

## Phase 7: Browser Validation (REQUIRED for UI Features)

**Purpose**: Quality engineering - validate all UI features in the browser

- [x] T039 Test 2FA setup flow in Chrome/Safari (with real authenticator app)
- [x] T040 Verify mobile responsiveness of the session list and 2FA wizard
- [x] T041 Verify glassmorphism aesthetics and micro-animations in security cards
- [x] T042 Test session revocation across multiple browser tabs
- [x] T043 Document validation with screenshots of 2FA setup and session management UI

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T044 Update `docs/architecture/auth.md` with new security features - Living Docs
- [x] T045 Security Review: Final check for OWASP compliance (input validation, rate limiting for 2FA)
- [ ] T046 [P] Add unit tests for `SecurityService` methods in `backend/tests/unit/`
- [x] T047 Clean up any debug logging and ensure JSON structure in security event logs
- [x] T048 Verify all tests pass inside Docker container

---

## Dependencies & Execution Order

1. **Foundational (Phase 2)**: MUST be complete before starting any User Story.
2. **User Story 1 (P1)**: Foundation for security visibility.
3. **User Story 2 (P2)**: Extends US1 with control features.
4. **User Story 3 (P3)**: Major security upgrade, depends on foundation but can be built after US2.
5. **User Story 4 (P4)**: Final polish and proactive alerting.

### Parallel Opportunities

- T002 and T003 (Install dependencies) can run in parallel.
- US1 (P1) and US2 (P2) implementation can be worked on concurrently after Foundation is ready.
- Frontend and backend implementation within each story can proceed in parallel.
