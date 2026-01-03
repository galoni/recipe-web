# Feature Specification: Futuristic UI & Consistent Design System

**Feature Branch**: `006-futuristic-ui`
**Created**: 2026-01-03
**Status**: Draft
**Input**: User request: "the website UX/UI is still bad, I want an advanced futuristic look. the pages are inconsistant"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Advanced Futuristic Visuals (Priority: P0)

As a user, I want the website to have a cutting-edge, futuristic aesthetic so that it feels like a next-generation tool.

**Why this priority**: The user explicitly stated the current UI is "bad" and wants a specific "futuristic" look.

**Independent Test (Automated)**:
- N/A (Visual aesthetic is subjective and manual).

**Manual Validation (Frontend)**:
- Verify the application uses a "Futuristic" theme (likely deep dark backgrounds, neon/vibrant accents, glassmorphism).
- Check that the design is applied globally (Home, Cookbook, Login, etc.).
- Inspect background elements for dynamic or rich visual textures (e.g., gradients, mesh, subtle animation).

**Acceptance Scenarios**:
1. **Given** the landing page, **When** loaded, **Then** it displays a premium, high-tech aesthetic (no default white/gray bootstrappy look).
2. **Given** UI components (cards, panels), **When** viewed, **Then** they utilize modern effects like backdrop-blur (glassmorphism) or glowing borders.

---

### User Story 2 - Visual Consistency Across Pages (Priority: P1)

As a user, I want all pages (Home, Cookbook, Profile, Specs) to look like they belong to the same application so that the experience is seamless and professional.

**Why this priority**: user mentioned "pages are inconsistant".

**Independent Test (Automated)**:
- N/A.

**Manual Validation (Frontend)**:
- Navigate from Home -> Cookbook -> specific Recipe.
- specific check: Font families, font sizes, and color usage must be identical across pages.
- specific check: Navbar and Footer must be identical in style and behavior across pages.
- specific check: Button styles (primary, secondary) must be consistent.

**Acceptance Scenarios**:
1. **Given** the Cookbook page, **When** comparing it to the Home page, **Then** the background, typography, and spacing follow the same rules.
2. **Given** secondary pages (like Login/Register), **When** viewed, **Then** they share the main theme's background and container styles.

---

### User Story 3 - "Alive" Interface with Micro-interactions (Priority: P2)

As a user, I want the interface to react to my actions with smooth animations so that it feels responsive and high-tech.

**Why this priority**: Enhances the "futuristic" feel.

**Independent Test (Automated)**:
- N/A.

**Manual Validation (Frontend)**:
- Hover over all buttons -> expect smooth color transition or scale effect.
- Scroll down pages -> expect elements to fade-in or slide-in (Framer Motion or similar).
- Click interactables -> expect immediate visual feedback (ripple or active state).

**Acceptance Scenarios**:
1. **Given** a button, **When** hovered, **Then** it glows or changes color smoothly.
2. **Given** a page transition, **When** navigating, **Then** content doesn't just "blip" but transitions smoothly (if possible with current router) or at least loads gracefully.

---

### User Story 4 - High-Conversion Landing Page (Priority: P0)

As a visitor, I want to see a compelling introduction to the product that motivates me to register, because I cannot generate recipes without an account.

**Why this priority**: User emphasized "landing page should be a landing page" and "only logged in users can generate".

**Independent Test (Automated)**:
- Verify that the "Generate" form is NOT present or is disabled/hidden on the public landing page.
- Verify "Register" or "Get Started" buttons are prominent.

**Manual Validation (Frontend)**:
- Visit `/` as a guest.
- Expectation: See large Hero section, value proposition, visuals, and CTA. No functional "Paste URL" input (or if present, it redirects to login).
- Click "Get Started" -> Redirects to Register/Login.
- Log in -> Verify the actual "App" interface (Recipe Gen) is now accessible (e.g., at `/app` or `/generate`, or replaces the Hero content).

**Acceptance Scenarios**:
1. **Given** a guest user, **When** visiting the home page, **Then** they see a marketing page with no direct ability to generate recipes.
2. **Given** a logged-out user, **When** they try to access generation features, **Then** they are prompted to log in.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Implement a **Dark/Futuristic Theme** as the default. Suggested colors: Deep Space Blue/Black, Neon Purple/Blue/Green accents.
- **FR-002**: Use **Glassmorphism** for containers (translucent backgrounds with blur).
- **FR-003**: Standardize all **Typography** to a modern, geometric sans-serif (e.g., Inter, Outfit, or Space Grotesk).
- **FR-004**: unify **Component Library**: Create or Refine `Button`, `Card`, `Input`, `Navbar` to share strictly defined base styles.
- **FR-005**: remove all hardcoded, inconsistent styles that deviate from the new design system.
- **FR-006**: **Landing Page**: Create a dedicated marketing landing page (`/`) for guests, separate from the main app functionality.
- **FR-007**: **Auth Gating**: Restrict the Recipe Extraction/Generation feature to authenticated users only.


### Key Entities

- **ThemeConfig**: `tailwind.config.ts` updates for the new palette.
- **GlobalCSS**: `globals.css` for the main background and font settings.
- **LayoutWrapper**: A main layout component that enforces the background and navbar consistency.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User explicit approval of the "Futuristic" look.
- **SC-002**: Visual Persistence: No "flash of unstyled content" or "flash of white theme" on navigation.
- **SC-003**: Consistency: All buttons and inputs across the app use the defined component classes.
