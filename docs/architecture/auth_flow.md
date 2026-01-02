# Authentication Architecture

## Overview
The ChefStream authentication system uses a stateless JWT (JSON Web Token) approach, stored in secure HTTP-only cookies, to manage user sessions.

## Components
1. **Frontend (`frontend/src/lib/auth.ts`)**: Handles API requests. Does not store tokens in localStorage. Relies on browser cookie handling (`credentials: 'include'`).
2. **Backend API (`backend/api/endpoints/auth.py`)**: Exposes login, register, logout, and OAuth endpoints.
3. **Service Layer (`AuthService`)**: Orchestrates user creation and authentication logic.
4. **Security Layer (`core/security.py`)**: Handles Argon2 password hashing and JWT encoding/decoding.

## Flows

# Authentication Flow

This document describes the login and session management architecture.

## Email/Password Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Next.js)
    participant B as Backend (FastAPI)
    participant D as Database (Postgres)

    U->>F: Enter Email/Password
    F->>B: POST /api/v1/auth/token (form-data)
    B->>D: Fetch user by email
    D-->>B: User Record (Hashed Password)
    B->>B: Verify Password (Argon2)
    B->>B: Create JWT Access Token
    B-->>F: HTTP 200 OK
    Note over B,F: Set-Cookie: access_token=Bearer <JWT>; HttpOnly; Secure; SameSite=Lax
    F->>F: Redirect to Dashboard
```

## Google OAuth Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Next.js)
    participant B as Backend (FastAPI)
    participant G as Google OAuth
    participant D as Database (Postgres)

    U->>F: Click "Login with Google"
    F->>B: GET /api/v1/auth/google/login
    B-->>F: { url: "https://accounts.google.com/..." }
    F->>G: Redirect to Google Login
    G-->>U: Prompt for Consent
    U->>G: Grant Permission
    G->>B: Redirect to /api/v1/auth/google/callback?code=...
    B->>G: Exchange Code for Access Token
    G-->>B: Access Token + User Info
    B->>D: Find or Create User by Email
    D-->>B: User Record
    B->>B: Create JWT Access Token
    B-->>F: HTTP 302 Redirect /dashboard
    Note over B,F: Set-Cookie: access_token=Bearer <JWT>; HttpOnly; Secure; SameSite=Lax
```

### 1. Email/Password Login
1. User submits credentials to validation endpoint.
2. Backend verifies hash.
3. If valid, Backend sets `access_token` HttpOnly cookie.
4. Frontend receives success (200 OK).

### 2. Google OAuth Login
1. User clicks "Continue with Google".
2. Frontend requests Google Login URL from Backend (`/auth/google/login`).
3. Backend generates URL with state and returns it.
4. Frontend redirects user to Google.
5. Google redirects back to Backend Callback (`/auth/google/callback`).
6. Backend exchanges code for token, fetches user info.
7. Backend finds or creates User in DB.
8. Backend sets `access_token` HttpOnly cookie and redirects to Frontend Dashboard.

### 3. Logout
1. Frontend calls `/auth/logout`.
2. Backend deletes `access_token` cookie.
3. Frontend redirects to Login page.

## Security Measures
- **HttpOnly Cookies**: Prevents XSS attacks from reading tokens.
- **CSRF Protection**: OAuth state parameter (partially implemented for MVP).
- **Argon2**: Industry-standard password hashing.
- **Strict Interfaces**: Pydantic schemas validation.
- **Structured Logging**: All auth events are logged with context.
