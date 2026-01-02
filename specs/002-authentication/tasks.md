---
description: "Task list template for feature implementation"
---

# Tasks: Authentication & User Session

**Input**: Design documents from `/specs/002-authentication/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)
**Tests**: OPTIONAL - only included if explicitly requested.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Install backend dependencies (`python-jose`, `passlib[argon2]`, `httpx`, `python-multipart`)
- [x] T002 Update Dockerfile to include new dependencies (Infra as Truth)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create `User` model in `backend/src/models/user.py` (SQLAlchemy)
- [x] T004 [P] Create `security.py` in `backend/src/services/` (Argon2 setup)
- [x] T005 [P] Implement `create_access_token` and JWT handling in `security.py`
- [x] T006 Setup `AuthService` skeleton in `backend/src/services/auth_service.py`
- [x] T007 Configure `GoogleOAuthProvider` class in `backend/src/services/oauth.py`
- [x] T008 Configure structured JSON logging for Auth events (Ops) in `backend/src/core/logger.py`
- [x] T009 [P] frontend: Create `auth.ts` lib for fetch wrapper (handling cookies)

**Checkpoint**: Foundation ready - auth logic core exists

---

## Phase 3: User Story 1 - User Login (Priority: P1) 🎯 MVP

**Goal**: Secure login via Email/Password OR Google OAuth

**Independent Test**:
- Backend: `POST /login` returns 200 + Cookie.
- Frontend: "Continue with Google" redirects to Dashboard.

### Implementation for User Story 1

- [x] T010 [P] [US1] Backend: Implement `login_access_token` endpoint in `backend/src/api/endpoints/auth.py`
- [x] T011 [P] [US1] Backend: Implement `google_login` redirection endpoint
- [x] T012 [US1] Backend: Implement `google_callback` endpoint (validates state + creates session)
- [x] T013 [P] [US1] Frontend: Create `LoginForm.tsx` component (Email/Pass)
- [x] T014 [P] [US1] Frontend: Create `SocialLoginButton.tsx` (Google)
- [x] T015 [US1] Frontend: Create `/login` page using components
- [x] T016 [US1] Integration: Verify Google OAuth flow manually

**Checkpoint**: User can log in and receive a session cookie

---

## Phase 4: User Story 2 - Registration (Priority: P2)

**Goal**: Sign up via Email or Social

**Independent Test**:
- Backend: `POST /register` creates new user in DB.

### Implementation for User Story 2

- [x] T017 [US2] Backend: Implement `register` endpoint (Email/Pass) in `auth_service.py` + API
- [x] T018 [US2] Backend: Ensure `google_callback` handles "New User" case (Auto-Registration)
- [x] T019 [US2] Frontend: Create `/register` page
- [x] T020 [US2] Frontend: Add "Sign up with Google" flow

**Checkpoint**: New users can be created via both methods

---

## Phase 5: User Story 3 - Logout (Priority: P3)

**Goal**: Secure session termination

### Implementation for User Story 3

- [x] T021 [US3] Backend: Implement `logout` endpoint (clear cookies)
- [x] T022 [US3] Frontend: Implement Logout UI (Button in Navbar/Profile)
- [x] T023 [P] [US3] Frontend: Handle 401 updates or redirect (basic implementation)

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T024 [P] Update `docs/architecture/auth_flow.md` with Mermaid diagram (Living Docs)
- [x] T024 Update centralized `docs/` (Living Docs) with Auth Flow & Env Vars
- [x] T025 Security Review (Errors, Cookie Flags) & Manual Verification Error Messages (no user enumeration)
- [x] T027 [P] Security Review: Verify HttpOnly/Secure flags on Cookies in Dev/Prod
- [x] T028 Run independent backend tests/contract tests (Verified with curl and server logs)
