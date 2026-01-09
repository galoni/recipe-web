# Feature Specification: Account Security & Session Management

**Feature Branch**: `010-account-security`
**Created**: 2026-01-09
**Status**: Draft
**Input**: User description: "I would like to implement Account Security: Last login, device management, 2FA settings"

## Overview

This feature enhances ChefStream's security infrastructure by providing users with visibility and control over their account security. It includes session tracking (last login information), active device management, and Two-Factor Authentication (2FA) capabilities. These features are critical for building user trust and meeting modern security standards.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Session Visibility & Last Login Tracking (Priority: P1)

As a user, I want to see when and from where I last logged in, so I can detect unauthorized access to my account.

**Why this priority**: This is the foundation of security awareness. Users need basic visibility into their account activity before managing devices or enabling 2FA. It's the quickest win with immediate security value.

**Independent Test (Automated)**:
- Backend contract test: `POST /api/v1/auth/token` updates `last_login_at` and `last_login_ip` fields
- Backend contract test: `GET /api/v1/auth/me` returns last login information
- Unit test: Login endpoint records accurate timezone-aware timestamps

**Manual Validation (Frontend)**:
- User logs in successfully
- User navigates to Profile or Settings page
- User sees "Last Login" information showing timestamp and location/IP
- User logs out and logs in from different browser/device
- User sees updated "Last Login" information

**Acceptance Scenarios**:

1. **Given** I am logged in, **When** I view my profile, **Then** I see my last login date, time, and IP address
2. **Given** I logged in 2 hours ago, **When** I check my profile, **Then** the last login shows "2 hours ago" (relative time)
3. **Given** someone accessed my account from unknown location, **When** I check last login, **Then** I can identify the suspicious IP/location
4. **Given** it's my first login, **When** I view my profile, **Then** I see "First login" or current session information

---

### User Story 2 - Active Device/Session Management (Priority: P2)

As a user, I want to see all devices currently logged into my account and be able to revoke access from any device, so I can maintain control over my account security.

**Why this priority**: After users can see their last login, the natural next step is managing all active sessions. This is crucial for security but requires more backend infrastructure than simple tracking.

**Independent Test (Automated)**:
- Backend contract test: `GET /api/v1/auth/sessions` returns list of active sessions with device info
- Backend contract test: `DELETE /api/v1/auth/sessions/{session_id}` successfully revokes specific session
- Backend contract test: `DELETE /api/v1/auth/sessions/all` revokes all sessions except current
- Integration test: Revoked session cannot access protected endpoints
- Unit test: Session metadata (device type, browser, OS) is correctly parsed from User-Agent

**Manual Validation (Frontend)**:
- User navigates to Settings > Security
- User sees list of active sessions showing: device type, browser, location, last active time
- Current session is clearly marked/highlighted
- User clicks "Revoke" on an old session
- System shows confirmation dialog
- After confirmation, session disappears from list
- User clicks "Sign out all other devices"
- All sessions except current are removed

**Acceptance Scenarios**:

1. **Given** I'm logged in on 3 devices, **When** I view active sessions, **Then** I see 3 entries with device details
2. **Given** I see a suspicious session, **When** I click "Revoke access", **Then** that device is immediately logged out
3. **Given** multiple active sessions exist, **When** I click "Sign out everywhere else", **Then** only my current session remains active
4. **Given** I revoke a session, **When** that device tries to access protected content, **Then** they are redirected to login page
5. **Given** I'm viewing sessions, **When** a session has been inactive for 24 hours, **Then** it's automatically removed from active list

---

### User Story 3 - Two-Factor Authentication (2FA) Setup & Management (Priority: P3)

As a user, I want to enable Two-Factor Authentication using an authenticator app (TOTP), so I can add an extra layer of security to my account.

**Why this priority**: 2FA is important but requires the foundation of session management to be truly effective. Users should first understand their account activity before adding authentication complexity.

**Independent Test (Automated)**:
- Backend contract test: `POST /api/v1/auth/2fa/setup` generates TOTP secret and returns QR code data
- Backend contract test: `POST /api/v1/auth/2fa/enable` verifies TOTP code and enables 2FA
- Backend contract test: `POST /api/v1/auth/2fa/disable` disables 2FA after password + code verification
- Backend contract test: `POST /api/v1/auth/token` requires TOTP code when 2FA is enabled
- Backend contract test: `POST /api/v1/auth/2fa/recovery-codes` generates backup codes
- Integration test: Login fails with correct password but wrong TOTP code
- Integration test: Backup recovery code can be used for login
- Unit test: TOTP secret generation uses cryptographically secure randomness
- Unit test: TOTP code validation accepts codes within time window (±30 seconds)

**Manual Validation (Frontend)**:
- User navigates to Settings > Security > Two-Factor Authentication
- User clicks "Enable 2FA"
- System displays QR code and manual entry key
- User scans QR code with authenticator app (Google Authenticator, Authy, etc.)
- User enters 6-digit code from app
- System verifies code and enables 2FA
- System displays 10 one-time backup recovery codes
- User saves recovery codes
- User logs out and logs back in
- After password entry, system prompts for 2FA code
- User enters code from authenticator app
- User successfully logs in
- User can disable 2FA by providing password + current 2FA code

**Acceptance Scenarios**:

1. **Given** 2FA is disabled, **When** I enable it with valid TOTP code, **Then** 2FA is activated and backup codes are generated
2. **Given** 2FA is enabled, **When** I log in with password, **Then** I'm prompted for TOTP code before accessing account
3. **Given** I lost my authenticator device, **When** I use a backup recovery code, **Then** I can log in successfully
4. **Given** I enter wrong TOTP code 3 times, **When** I try again, **Then** I'm rate-limited for 5 minutes
5. **Given** 2FA is enabled, **When** I disable it, **Then** I must provide password + current TOTP code for security
6. **Given** I'm setting up 2FA, **When** the setup fails/is interrupted, **Then** 2FA remains disabled and I can retry
7. **Given** I use a backup code, **When** I log in, **Then** that code is invalidated and cannot be reused

---

### User Story 4 - Security Notifications (Priority: P4)

As a user, I want to receive email notifications for critical security events (new device login, 2FA changes, password changes), so I can respond quickly to potential security threats.

**Why this priority**: This is an enhancement that adds proactive security monitoring. It's valuable but not critical for the MVP since users can manually check their sessions.

**Independent Test (Automated)**:
- Backend contract test: Login from new device triggers email notification
- Backend contract test: 2FA enable/disable triggers email notification
- Backend contract test: Password change triggers email notification
- Integration test: Email contains correct device info, timestamp, and location
- Unit test: Email is sent asynchronously and doesn't block login flow

**Manual Validation (Frontend)**:
- User logs in from new device
- User receives email within 1 minute
- Email contains: device type, browser, IP/location, timestamp, "Was this you?" link
- User can click "Secure my account" link if login wasn't them
- User enables 2FA
- User receives confirmation email
- User changes password
- User receives security alert email

**Acceptance Scenarios**:

1. **Given** I log in from new device, **When** login succeeds, **Then** I receive email notification within 1 minute
2. **Given** I receive security email, **When** I click "This wasn't me", **Then** I'm guided to secure my account (change password, revoke sessions)
3. **Given** I enable 2FA, **When** enabled successfully, **Then** I receive confirmation email
4. **Given** I prefer no emails, **When** I disable security notifications in settings, **Then** I don't receive these emails

---

### Edge Cases

- **What happens when user is logged in on 50+ devices?** Session list is paginated, oldest inactive sessions are auto-revoked after 30 days
- **How does system handle concurrent logins during session revocation?** Last-write-wins; revoked session ID is blacklisted immediately
- **What if user loses both authenticator device AND backup codes?** Account recovery flow via email (send recovery link to verified email)
- **How does system handle timezone differences in "last login" display?** All timestamps stored in UTC, displayed in user's local timezone detected from browser
- **What if user's IP changes frequently (mobile user)?** Track by session token, not IP; IP is metadata only
- **What happens if email notification service is down?** Security events are logged in database; notifications are queued and retried; users can view security log in settings
- **How to prevent brute-force attacks on 2FA codes?** Rate limiting: max 5 attempts per 5 minutes per account
- **What if user tries to enable 2FA while another session is active?** All other sessions must re-authenticate with 2FA code after it's enabled
- **Session token compromise scenario?** If token is stolen, attacker can use it until revoked or expired (24h); 2FA prevents initial token generation
- **What about trusted devices (remember this device)?** Not in MVP; all sessions require 2FA code on each login when enabled

## Requirements *(mandatory)*

### Functional Requirements

#### Session Tracking (User Story 1)
- **FR-001**: System MUST record timestamp (UTC) and IP address of every successful login
- **FR-002**: System MUST update user's `last_login_at` and `last_login_ip` fields on authentication
- **FR-003**: System MUST display last login information to authenticated users via API endpoint
- **FR-004**: Frontend MUST display last login as relative time (e.g., "2 hours ago") with absolute tooltip
- **FR-005**: System MUST extract approximate location from IP address (city/country level) for display purposes

#### Session Management (User Story 2)
- **FR-006**: System MUST create a Session record for each successful authentication containing:
  - Unique session identifier (UUID)
  - User ID (foreign key)
  - Device type (mobile/tablet/desktop)
  - Browser name and version
  - Operating system
  - IP address
  - Approximate location (city, country)
  - Created at timestamp
  - Last active timestamp
  - Is current session (boolean)
- **FR-007**: System MUST parse User-Agent header to extract device, browser, and OS information
- **FR-008**: System MUST provide endpoint to list all active sessions for authenticated user
- **FR-009**: System MUST provide endpoint to revoke a specific session by ID
- **FR-010**: System MUST provide endpoint to revoke all sessions except the current one
- **FR-011**: System MUST update `last_active_at` timestamp on each authenticated request
- **FR-012**: System MUST automatically expire sessions after 24 hours of inactivity (configurable)
- **FR-013**: Revoked or expired sessions MUST be rejected when used for authentication
- **FR-014**: Frontend MUST display session list with clear indication of current session
- **FR-015**: Frontend MUST require confirmation before revoking sessions

#### Two-Factor Authentication (User Story 3)
- **FR-016**: System MUST support TOTP (Time-based One-Time Password) as 2FA method, compatible with Google Authenticator, Authy, Microsoft Authenticator
- **FR-017**: System MUST generate cryptographically secure random TOTP secret (base32 encoded, min 128 bits entropy)
- **FR-018**: System MUST provide endpoint to initiate 2FA setup, returning TOTP secret and QR code data URI
- **FR-019**: System MUST provide endpoint to confirm 2FA setup by verifying TOTP code
- **FR-020**: System MUST generate exactly 10 backup recovery codes (8 characters each, alphanumeric) upon successful 2FA activation
- **FR-021**: System MUST store backup codes as secure hashes (bcrypt), not plaintext
- **FR-022**: System MUST mark user profile with `is_2fa_enabled` boolean flag
- **FR-023**: When 2FA is enabled, login flow MUST require TOTP code after password verification
- **FR-024**: System MUST accept TOTP codes within ±1 time step window (30 seconds before/after current)
- **FR-025**: System MUST accept valid unused backup recovery codes for authentication
- **FR-026**: Used recovery codes MUST be invalidated immediately and cannot be reused
- **FR-027**: System MUST implement rate limiting on 2FA verification: max 5 attempts per 5 minutes per account
- **FR-028**: System MUST allow 2FA disable only after verifying password AND current TOTP code
- **FR-029**: Frontend MUST display QR code for easy scanning by authenticator apps
- **FR-030**: Frontend MUST display manual entry key for users who cannot scan QR codes
- **FR-031**: Frontend MUST display backup recovery codes with prominent "save these" warning
- **FR-032**: Frontend MUST show clear error messages for invalid/expired TOTP codes

#### Security Notifications (User Story 4)
- **FR-033**: System MUST send email notification when user logs in from new device (device not seen in last 30 days)
- **FR-034**: System MUST send email notification when 2FA is enabled or disabled
- **FR-035**: System MUST send email notification when password is changed
- **FR-036**: Email notifications MUST include: event type, timestamp, device info, IP/location
- **FR-037**: Email notifications MUST be sent asynchronously (background job) without blocking user actions
- **FR-038**: Users MUST be able to disable security notifications in settings (opt-out)
- **FR-039**: Security notification emails MUST include "This wasn't you?" support link

### Non-Functional Requirements

- **NFR-001**: Session lookups MUST complete in <100ms for typical user (1-10 active sessions)
- **NFR-002**: TOTP secret generation MUST use cryptographically secure random number generator
- **NFR-003**: Session data MUST be stored in database, not in-memory cache (for multi-server support)
- **NFR-004**: All timestamps MUST be stored in UTC with timezone information
- **NFR-005**: Session revocation MUST take effect globally within 1 second
- **NFR-006**: 2FA QR code generation MUST happen on backend, not frontend (security best practice)
- **NFR-007**: Backup recovery codes MUST be downloadable as .txt file
- **NFR-008**: User-Agent parsing MUST be defensive (handle malformed/missing headers gracefully)
- **NFR-009**: All security events (login, 2FA changes, session revocations) MUST be logged with structured metadata
- **NFR-010**: Email notification queue MUST retry failed sends up to 3 times with exponential backoff

### Key Entities *(include if feature involves data)*

- **Session**: Represents an active authentication session for a user
  - `id` (UUID primary key)
  - `user_id` (foreign key to User)
  - `token_id` (links to JWT jti claim for revocation)
  - `device_type` (mobile/tablet/desktop/unknown)
  - `browser_name` (Chrome, Firefox, Safari, etc.)
  - `browser_version` (string)
  - `os_name` (Windows, macOS, Linux, iOS, Android, etc.)
  - `os_version` (string)
  - `ip_address` (IPv4 or IPv6)
  - `location_city` (nullable)
  - `location_country` (nullable)
  - `created_at` (timestamp)
  - `last_active_at` (timestamp)
  - `revoked_at` (nullable timestamp)
  - `is_current` (derived, not stored - based on request context)

- **User (Extended)**: Existing User model extended with security fields
  - `last_login_at` (nullable timestamp)
  - `last_login_ip` (nullable string)
  - `is_2fa_enabled` (boolean, default False)
  - `totp_secret` (nullable encrypted string)
  - `backup_codes_hashed` (JSON array of hashed codes)

- **SecurityEvent**: Audit log for security-related actions
  - `id` (UUID primary key)
  - `user_id` (foreign key to User)
  - `event_type` (enum: login, logout, session_revoked, 2fa_enabled, 2fa_disabled, password_changed)
  - `event_metadata` (JSON: IP, device info, etc.)
  - `created_at` (timestamp)
  - `notification_sent` (boolean)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view their last login information within 2 seconds of page load
- **SC-002**: Users can successfully revoke a session and verify it's logged out within 5 seconds
- **SC-003**: Users can enable 2FA from setup start to completion in under 3 minutes
- **SC-004**: 2FA login flow adds no more than 10 seconds to authentication time
- **SC-005**: Session management API endpoints respond in <200ms for p95 of requests
- **SC-006**: TOTP code verification success rate is >95% for valid codes (accounting for time drift)
- **SC-007**: Email notifications for security events are delivered within 60 seconds
- **SC-008**: Zero plaintext storage of TOTP secrets or backup codes in database
- **SC-009**: Session revocation takes effect globally for all API servers within 2 seconds
- **SC-010**: Users with 2FA enabled experience <0.5% failed login rate due to time sync issues

### User Satisfaction Metrics

- **SC-011**: 90% of users successfully set up 2FA on first attempt without support
- **SC-012**: <5% of users disable security notifications (indicating high perceived value)
- **SC-013**: Zero critical security vulnerabilities in 2FA implementation (verified by security audit)
- **SC-014**: Session management UI is intuitive enough that <10% of users need help documentation

### Business Metrics

- **SC-015**: Account takeover incidents reduced by 80% after 2FA rollout
- **SC-016**: Support tickets related to "suspicious login" reduced by 60% due to session visibility
- **SC-017**: 30% of active users enable 2FA within 3 months of feature launch (with gentle prompts)

## Technical Considerations

### Security Best Practices

1. **TOTP Implementation**:
   - Use `pyotp` library (Python) or equivalent for TOTP generation/verification
   - Secret length: 32 characters base32 (20 bytes = 160 bits entropy)
   - Time step: 30 seconds (standard)
   - HMAC algorithm: SHA1 (for compatibility with all authenticator apps)
   - QR code should use `otpauth://totp/ChefStream:{email}?secret={secret}&issuer=ChefStream`

2. **Session Security**:
   - Session tokens should be JWTs with `jti` (JWT ID) claim for revocation
   - Store `jti` in Session table for revocation lookups
   - Use Redis blacklist for revoked tokens (optional optimization)
   - Rotate session tokens periodically (every 4 hours recommended)

3. **Data Protection**:
   - Encrypt TOTP secrets at rest using application-level encryption (AES-256)
   - Hash backup codes with bcrypt (work factor 12)
   - Never log TOTP secrets or backup codes
   - Use HTTPS for all API calls (already in place)

4. **User-Agent Parsing**:
   - Use `ua-parser` or similar library
   - Handle malformed User-Agent gracefully (default to "Unknown")
   - Don't trust User-Agent for security decisions (can be spoofed)

5. **IP Geolocation**:
   - Use MaxMind GeoLite2 database or IP-API.com
   - Cache geolocation results (IP rarely changes location)
   - Gracefully handle lookup failures

### Database Migration Strategy

```sql
-- Add columns to users table
ALTER TABLE users
  ADD COLUMN last_login_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN last_login_ip VARCHAR(45),  -- IPv6 max length
  ADD COLUMN is_2fa_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN totp_secret TEXT,  -- Encrypted
  ADD COLUMN backup_codes_hashed JSONB;

-- Create sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_jti VARCHAR(255) UNIQUE NOT NULL,
  device_type VARCHAR(50),
  browser_name VARCHAR(100),
  browser_version VARCHAR(50),
  os_name VARCHAR(100),
  os_version VARCHAR(50),
  ip_address VARCHAR(45),
  location_city VARCHAR(100),
  location_country VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_jti ON sessions(token_jti);
CREATE INDEX idx_sessions_last_active ON sessions(last_active_at);

-- Create security_events table (for audit log)
CREATE TABLE security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_metadata JSONB,
  notification_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_created_at ON security_events(created_at);
```

### API Endpoints Summary

#### Session Management
- `GET /api/v1/auth/sessions` - List active sessions
- `DELETE /api/v1/auth/sessions/{session_id}` - Revoke specific session
- `DELETE /api/v1/auth/sessions/all` - Revoke all except current

#### 2FA Management
- `POST /api/v1/auth/2fa/setup` - Generate TOTP secret and QR code
- `POST /api/v1/auth/2fa/enable` - Verify code and enable 2FA
- `POST /api/v1/auth/2fa/disable` - Disable 2FA (requires password + code)
- `POST /api/v1/auth/2fa/verify` - Verify TOTP code during login
- `GET /api/v1/auth/2fa/recovery-codes` - Get new backup codes (requires password + current code)

#### Extended Endpoints
- `GET /api/v1/auth/me` - Now includes `last_login_at`, `last_login_ip`, `is_2fa_enabled`
- `POST /api/v1/auth/token` - Extended to handle 2FA flow

### Frontend UX Considerations

1. **Settings Page Structure**:
   ```
   Settings
   ├── Security (new tab)
   │   ├── Session History (shows last login)
   │   ├── Active Devices (manage sessions)
   │   ├── Two-Factor Authentication
   │   └── Security Notifications
   ```

2. **2FA Setup Flow**:
   - Modal/page with step-by-step wizard
   - Step 1: Scan QR code + manual key
   - Step 2: Enter verification code
   - Step 3: Save backup codes (forced download/copy)
   - Step 4: Confirmation + "Test it now" option

3. **Session List Design**:
   - Card-based layout
   - Current session highlighted with badge
   - Each card shows: device icon, browser, location, last active
   - Hover reveals "Revoke" button
   - "Sign out everywhere" prominent at top

4. **2FA Login Flow**:
   - After password: slide-in panel for TOTP code
   - 6-digit code input (auto-submit on sixth digit)
   - "Use backup code instead" link
   - "Lost access? Contact support" link

## Open Questions

1. **Session Retention**: How long should revoked/expired sessions remain in database for audit purposes? (Suggestion: 90 days)
2. **2FA Enforcement**: Should we eventually require 2FA for all users, or keep it optional? (Suggestion: optional initially, consider enforcement for accounts with public recipes)
3. **Trusted Devices**: Future enhancement to "remember this device for 30 days"? (Suggestion: not in MVP, revisit based on user feedback)
4. **Alternative 2FA Methods**: Support SMS or email-based 2FA in addition to TOTP? (Suggestion: TOTP only for MVP, it's more secure)
5. **Account Recovery**: What's the full flow if user loses both authenticator and backup codes? (Suggestion: email-based recovery with identity verification)
6. **Session Limit**: Should we limit max concurrent sessions per user? (Suggestion: Yes, 10 active sessions max, auto-revoke oldest)

## Dependencies

- **Backend**: `pyotp` for TOTP, `qrcode` for QR generation, `ua-parser` for User-Agent parsing, `geoip2` for IP geolocation
- **Frontend**: QR code display library (can use data URI from backend), form libraries for 2FA input
- **Infrastructure**: Email service (already in place for auth), consider Redis for session revocation blacklist (optional optimization)

## Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Users lose authenticator device without saving backup codes | High (account lockout) | Medium | Prominent warning to save codes; email-based recovery flow |
| Time sync issues cause TOTP failures | Medium (frustration) | Medium | Accept ±1 time step window; clear error messages; backup codes |
| Session table grows very large | Medium (performance) | Low | Auto-delete expired sessions >90 days; proper indexing |
| Email notification delays | Low | Medium | Async processing; clear in-app log of security events |
| Brute-force attacks on 2FA codes | High | Low | Rate limiting (5 attempts/5min); account lockout after repeated failures |
| JWT revocation doesn't propagate in distributed system | High | Medium | Centralized session store (database); consider Redis cache |

## Future Enhancements (Out of Scope for MVP)

1. **WebAuthn/Passkeys**: Modern biometric authentication
2. **Trusted Devices**: "Remember this device for 30 days"
3. **SMS 2FA**: Alternative to TOTP (less secure, but more accessible)
4. **Security Dashboard**: Visual timeline of account activity
5. **Anomaly Detection**: AI-powered detection of unusual login patterns
6. **Export Security Log**: Downloadable audit log for compliance
7. **IP Whitelisting**: Only allow logins from specific IP ranges
8. **Device Reputation**: Track and score devices based on behavior
