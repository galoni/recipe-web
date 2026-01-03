# Feature Specification: Enhanced Futuristic UI & UX Fixes
**Feature Branch**: `007-enhanced-futuristic-ui`
**Created**: 2026-01-03
**Status**: Draft
**Input**: User feedback: "dark mode broken", "landing page not alive", "generate page disgusting", "login ugly", "cookbook link bug".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - True Dark Mode & "Alive" Landing Page (Priority: P0)
As a user, I want a truly immersive, dark, animated landing page so that I am "wowed" instead of confused by static icons.

**Why this priority**: User specifically complained about the lack of dark mode and the "hat" element.

**Independent Test (Automated)**:
- N/A (Visual).

**Manual Validation (Frontend)**:
- **Dark Mode**: Verify `<html>` has `class="dark"` and background is `#020617` (not white/gray).
- **Landing Page**: Check for continuous background movement (e.g., specific particle or gradient flow).
- **Hero Element**: Replace the "Hat Div" with a high-quality abstract graphic or dynamic generated preview that looks professional.

**Acceptance Scenarios**:
1. **Given** the landing page, **When** loaded, **Then** the background is dark and animated.
2. **Given** the hero section, **When** viewed, **Then** there are no "weird divs" but rather a cohesive 3D-style or glass illustration.

---

### User Story 2 - Integrated Design for Auth & App Pages (Priority: P0)
As a user, I want the Login, Register, and Generate (Dashboard) pages to use the same glass/neon aesthetic so the experience is consistent.

**Why this priority**: User called the generate page "disgusting" and login "ugly".

**Independent Test (Automated)**:
- N/A.

**Manual Validation (Frontend)**:
- **Login/Register**: Must use `GlassCard` centered on a dark animated background. Inputs must be `ModernInput`.
- **Dashboard**: The generation form must be centered, large, and use the new components. No default HTML inputs.

**Acceptance Scenarios**:
1. **Given** the login page, **When** viewed, **Then** it looks exactly like the landing page (a modal/card over the moving background).

---

### User Story 3 - Fix Cookbook Navigation Loop (Priority: P1)
As a user, when I click "Cook Now" in my cookbook, I want to go to the Recipe View, not the Generate page.

**Why this priority**: Functional bug reported by user.

**Independent Test (Automated)**:
- Render `RecipeCard` with a sample recipe.
- Click "Cook Now" button.
- Verify router push calls `/recipe/[id]` not `/dashboard`.

**Manual Validation (Frontend)**:
- Go to Cookbook -> Click a Recipe -> Confirm URL is `/recipe/123`.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: **Global Dark Mode**: Force dark mode in `globals.css` properly (ensure CSS variables for `.dark` are actually applying to `:root` or body correctly).
- **FR-002**: **Landing Page Hero**: Remove the static "Chef Hat" card. Replace with a CSS-only "Magical Pot" or simpler, high-quality "Abstract Hologram" effect.
- **FR-003**: **Auth Pages**: Update `/login/page.tsx` and `/register/page.tsx` to use the new Layout/Background wrappers.
- **FR-004**: **Dashboard Styling**: Apply `GlassCard` (Neon variant) to the Dashboard input container. Ensure it takes up appropriate width (max-w-2xl).
- **FR-005**: **Navigation Fix**: Update `RecipeCard.tsx` link target.

### Key Entities
- **CommonLayout**: A wrapper component to ensure the animated background exists on ALL pages (`dashboard`, `login`, `register`).

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: User validation: "This looks alive/better".
- **SC-002**: Login page is no longer "ugly" (matches Landing style).
- **SC-003**: "Cook Now" redirects correctly.
