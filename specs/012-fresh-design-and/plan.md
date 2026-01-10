# Implementation Plan: Fresh Design and Theme Toggle

**Branch**: `012-fresh-design-and` | **Date**: 2026-01-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/012-fresh-design-and/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature addresses user feedback about the site "lacking liveness and colors" by implementing a comprehensive theme system with Light/Dark mode toggle and enhancing the visual design with vibrant colors, smooth animations, and premium aesthetics. The technical approach leverages `next-themes` for robust theme management, HSL-based CSS variables for flexible color palettes, and Framer Motion for smooth micro-animations. The implementation will ensure zero flash of unstyled content (FOUC), maintain WCAG accessibility compliance, and create a "wow factor" through glassmorphism, gradients, and interactive hover states across all components.

## Operational & Security Context

*   **Security**: No direct security implications. Theme preference is stored in localStorage (client-side only). No sensitive data involved. No new API endpoints or authentication changes.
*   **Observability**: No backend changes required. Frontend monitoring can track theme toggle events via existing analytics (if implemented). No new health checks needed.
*   **Environment**: No Dockerfile updates required. This is a frontend-only feature using existing Next.js infrastructure.
*   **Docs Impact**: Update `docs/architecture/frontend.md` to document the theme system architecture, CSS variable conventions, and component design patterns.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15.x (App Router)
**Primary Dependencies**:
- `next-themes` (^0.4.0) - Theme management with SSR support
- `framer-motion` (^11.x) - Smooth animations and transitions
- Tailwind CSS 4.x - Utility-first styling with CSS variable integration
**Storage**: localStorage for theme preference persistence (client-side)
**Testing**:
- Vitest for component unit tests
- Playwright for E2E theme toggle validation
- Manual browser testing for visual verification
**Target Platform**: Web (all modern browsers: Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (Next.js frontend + FastAPI backend, frontend-only changes)
**Performance Goals**:
- Theme toggle response < 50ms
- Zero FOUC on page load
- Lighthouse Performance score > 90
- Lighthouse Accessibility score > 95
**Constraints**:
- Must support SSR without hydration mismatches
- Must maintain existing dark theme as default
- Must not break existing component styles
- All animations must respect `prefers-reduced-motion`
**Scale/Scope**:
- ~15 page components to update
- ~25 shared components to enhance
- 2 new theme palettes (Light + enhanced Dark)
- 1 new ThemeToggle component

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Infrastructure as Truth**: No Dockerfile updates needed (frontend-only, existing dependencies)
- [x] **Backend Quality**: N/A - No backend changes
- [x] **Frontend Quality**: Manual browser validation required for theme toggle, animations, and visual consistency across all pages. E2E tests for theme persistence.
- [x] **Security First**: No auth/validation changes. Theme preference is non-sensitive client data.
- [x] **Operational Excellence**: No logging/health check changes needed (frontend-only)
- [x] **Living Documentation**: Will update `docs/architecture/frontend.md` with theme system details
- [x] **Modularity**: ThemeToggle component < 100 lines, CSS utilities modular, no file > 300 lines
- [x] **UX Wow Factor**: Core focus! Micro-animations, glassmorphism, vibrant gradients, smooth transitions

## Project Structure

### Documentation (this feature)

```text
specs/012-fresh-design-and/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (already exists)
├── research.md          # Phase 0: next-themes API, Framer Motion patterns, accessibility
├── data-model.md        # Phase 1: Theme type definitions, CSS variable schema
├── quickstart.md        # Phase 1: How to use theme system, add new themed components
├── contracts/           # Phase 1: ThemeToggle component API, theme context types
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # [MODIFY] Add ThemeProvider wrapper
│   │   ├── globals.css                   # [MODIFY] Add light theme variables, enhance dark theme
│   │   ├── page.tsx                      # [MODIFY] Enhance landing page animations
│   │   ├── dashboard/page.tsx            # [MODIFY] Apply theme-aware colors
│   │   ├── cookbook/page.tsx             # [MODIFY] Apply theme-aware colors
│   │   ├── login/page.tsx                # [MODIFY] Apply theme-aware colors
│   │   ├── register/page.tsx             # [MODIFY] Apply theme-aware colors
│   │   └── recipe/[id]/page.tsx          # [MODIFY] Apply theme-aware colors
│   ├── components/
│   │   ├── theme/
│   │   │   ├── ThemeProvider.tsx         # [NEW] Wrapper for next-themes provider
│   │   │   └── ThemeToggle.tsx           # [NEW] Animated theme toggle button
│   │   ├── shared/
│   │   │   ├── navbar.tsx                # [MODIFY] Integrate ThemeToggle, enhance styles
│   │   │   ├── recipe-card.tsx           # [MODIFY] Add hover animations, theme colors
│   │   │   ├── Button.tsx                # [MODIFY] Enhance with micro-animations
│   │   │   └── Input.tsx                 # [MODIFY] Theme-aware focus states
│   │   ├── landing/
│   │   │   ├── Hero.tsx                  # [MODIFY] Add animated background blobs
│   │   │   ├── FeatureCard.tsx           # [MODIFY] Enhanced glassmorphism
│   │   │   └── WorkflowStep.tsx          # [MODIFY] Smooth hover effects
│   │   └── dashboard/
│   │       └── StepCard.tsx              # [MODIFY] Theme-aware colors, animations
│   └── lib/
│       └── theme-utils.ts                # [NEW] Theme helper functions
└── tests/
    ├── e2e/
    │   └── theme-toggle.spec.ts          # [NEW] E2E tests for theme persistence
    └── unit/
        └── components/
            └── ThemeToggle.test.tsx      # [NEW] Unit tests for toggle component

docs/
└── architecture/
    └── frontend.md                       # [MODIFY] Document theme system architecture
```

**Structure Decision**: This is a web application following the established Next.js App Router structure. All changes are frontend-only, focusing on the `frontend/src/app` and `frontend/src/components` directories. The theme system will be centralized in `globals.css` using CSS variables, with a new `theme/` component directory for theme-specific UI elements. This maintains the existing modular structure while adding clear separation for theme-related code.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitution requirements are met:
- Frontend-only changes, no infrastructure updates needed
- Manual browser validation planned for all visual changes
- No security/auth implications
- Modularity maintained (new components < 100 lines)
- UX wow factor is the primary goal
- Documentation updates planned
