---
description: "Task list for Fresh Design and Theme Toggle feature"
---

# Tasks: Fresh Design and Theme Toggle

**Input**: Design documents from `/specs/012-fresh-design-and/`
**Prerequisites**: plan.md, spec.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create foundational theme infrastructure

- [ ] T001 Install `next-themes` package: `npm install next-themes`
- [ ] T002 [P] Create `frontend/src/components/theme/ThemeProvider.tsx` component wrapper
- [ ] T003 [P] Create `frontend/src/lib/theme-utils.ts` helper functions

**Checkpoint**: Theme infrastructure ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core theme system that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Define Light theme CSS variables in `frontend/src/app/globals.css` (HSL format)
- [ ] T005 Enhance Dark theme CSS variables in `frontend/src/app/globals.css` with vibrant colors
- [ ] T006 Add theme transition CSS in `frontend/src/app/globals.css` (~300ms smooth transitions)
- [ ] T007 Wrap app with ThemeProvider in `frontend/src/app/layout.tsx`
- [ ] T008 Add SSR-safe theme script to prevent FOUC in `frontend/src/app/layout.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Dynamic Theme Toggle (Priority: P1) 🎯 MVP

**Goal**: Enable users to switch between Light and Dark modes with a toggle in the navbar

**Independent Test**: Click toggle → theme changes → reload page → theme persists

### Implementation for User Story 1

- [ ] T009 [US1] Create `ThemeToggle` component in `frontend/src/components/theme/ThemeToggle.tsx`
  - **DoD**: Component renders Sun/Moon icon based on theme, uses Framer Motion for smooth icon transitions
- [ ] T010 [US1] Integrate `ThemeToggle` into `frontend/src/components/shared/navbar.tsx`
  - **DoD**: Toggle appears in navbar, positioned appropriately for desktop and mobile
- [ ] T011 [US1] Implement theme persistence logic using localStorage in `ThemeToggle`
  - **DoD**: Theme preference saved to localStorage, restored on page reload
- [ ] T012 [US1] Add support for "System" theme preference (follows OS setting)
  - **DoD**: Users can choose Light/Dark/System, system preference auto-updates theme

### Browser Validation for User Story 1

- [ ] T013 [US1] Manual test: Toggle between themes in Chrome/Firefox/Safari
  - **DoD**: Theme changes instantly, no flash of wrong theme, icons animate smoothly
- [ ] T014 [US1] Manual test: Verify theme persistence across page reloads
  - **DoD**: Selected theme persists after refresh, no FOUC on reload
- [ ] T015 [US1] Manual test: Test System theme with OS dark/light mode changes
  - **DoD**: App theme follows OS preference when "System" is selected

**Checkpoint**: Theme toggle fully functional - users can switch themes and preference persists

---

## Phase 4: User Story 2 - Vibrant & Modern Aesthetics (Priority: P1) 🎯 MVP

**Goal**: Transform the design to feel "alive" and premium with vibrant colors, smooth gradients, and polished typography

**Independent Test**: Scroll through landing page → observe animations → hover over cards → see micro-interactions

### Implementation for User Story 2

#### Landing Page Enhancements

- [ ] T016 [P] [US2] Add animated background blobs to Hero section in `frontend/src/components/landing/Hero.tsx`
  - **DoD**: Subtle floating gradient blobs with CSS animations, respects prefers-reduced-motion
- [ ] T017 [P] [US2] Enhance `FeatureCard` in `frontend/src/components/landing/FeatureCard.tsx` with glassmorphism
  - **DoD**: Cards have glass effect, smooth hover lift/glow, theme-aware colors
- [ ] T018 [P] [US2] Add smooth hover effects to `WorkflowStep` in `frontend/src/components/landing/WorkflowStep.tsx`
  - **DoD**: Steps scale/glow on hover, smooth transitions, theme-aware accent colors

#### Shared Component Enhancements

- [ ] T019 [P] [US2] Enhance `Button` component in `frontend/src/components/shared/Button.tsx`
  - **DoD**: Micro-animations on hover (scale, glow), theme-aware colors, smooth transitions
- [ ] T020 [P] [US2] Enhance `Input` component in `frontend/src/components/shared/Input.tsx`
  - **DoD**: Theme-aware focus states, smooth border transitions, proper contrast in both themes
- [ ] T021 [P] [US2] Enhance `RecipeCard` in `frontend/src/components/shared/recipe-card.tsx`
  - **DoD**: Hover animations (lift, shadow), theme-aware colors, glassmorphism effect

#### Page-Level Theme Application

- [ ] T022 [P] [US2] Apply theme-aware colors to `frontend/src/app/page.tsx` (Landing Page)
  - **DoD**: All hardcoded colors replaced with CSS variables, looks premium in both themes
- [ ] T023 [P] [US2] Apply theme-aware colors to `frontend/src/app/dashboard/page.tsx`
  - **DoD**: Dashboard adapts to theme, cards/buttons use theme colors, proper contrast
- [ ] T024 [P] [US2] Apply theme-aware colors to `frontend/src/app/cookbook/page.tsx`
  - **DoD**: Cookbook page adapts to theme, recipe cards themed, filters/search themed
- [ ] T025 [P] [US2] Apply theme-aware colors to `frontend/src/app/login/page.tsx`
  - **DoD**: Login form themed, inputs/buttons use theme colors, background adapts
- [ ] T026 [P] [US2] Apply theme-aware colors to `frontend/src/app/register/page.tsx`
  - **DoD**: Register form themed, consistent with login page, proper contrast
- [ ] T027 [P] [US2] Apply theme-aware colors to `frontend/src/app/recipe/[id]/page.tsx`
  - **DoD**: Recipe view page themed, ingredients/steps readable in both themes

#### Dashboard Component Enhancements

- [ ] T028 [P] [US2] Enhance `StepCard` in `frontend/src/components/dashboard/StepCard.tsx`
  - **DoD**: Theme-aware colors, smooth hover animations, glassmorphism effect

### Browser Validation for User Story 2

- [ ] T029 [US2] Manual test: Scroll through landing page and verify animations
  - **DoD**: Background blobs animate smoothly, cards have hover effects, no jank
- [ ] T030 [US2] Manual test: Hover over all interactive elements (cards, buttons)
  - **DoD**: All elements have smooth micro-animations, proper theme colors, no broken styles
- [ ] T031 [US2] Manual test: Verify typography is crisp and premium
  - **DoD**: Fonts render correctly, proper font weights, good readability in both themes
- [ ] T032 [US2] Manual test: Check all pages in both Light and Dark themes
  - **DoD**: All pages look premium in both themes, no color contrast issues, consistent design
- [ ] T033 [US2] Run Lighthouse Accessibility audit in both themes
  - **DoD**: Accessibility score > 95 in both themes, proper contrast ratios (WCAG AA)

**Checkpoint**: Design feels alive and premium - vibrant colors, smooth animations, consistent theming

---

## Phase 5: User Story 3 - Fluid Transitions (Priority: P2)

**Goal**: Ensure theme changes and page navigation feel fluid rather than jarring

**Independent Test**: Toggle theme → observe smooth color interpolation → navigate pages → verify consistent theme

### Implementation for User Story 3

- [ ] T034 [US3] Add CSS transitions for theme changes in `frontend/src/app/globals.css`
  - **DoD**: Background, text, border colors animate over ~300ms, smooth interpolation
- [ ] T035 [US3] Ensure all components respect `prefers-reduced-motion` media query
  - **DoD**: Animations disabled for users with reduced motion preference, functionality intact
- [ ] T036 [US3] Add page transition animations (if applicable) for route changes
  - **DoD**: Smooth fade/slide transitions between pages, theme persists during navigation

### Browser Validation for User Story 3

- [ ] T037 [US3] Manual test: Toggle theme and observe color transitions
  - **DoD**: Colors animate smoothly over ~300ms, no jarring snaps, feels premium
- [ ] T038 [US3] Manual test: Navigate between pages and verify theme consistency
  - **DoD**: Theme persists across navigation, no flash of wrong theme, smooth transitions
- [ ] T039 [US3] Manual test: Enable reduced motion and verify animations are disabled
  - **DoD**: Animations respect prefers-reduced-motion, no motion for users who prefer it

**Checkpoint**: All transitions are smooth and fluid - theme changes feel premium

---

## Phase 6: Edge Cases & Polish

**Purpose**: Handle edge cases and ensure robustness

- [ ] T040 [P] Test and fix Flash of Unstyled Theme (FOUC) on page reload
  - **DoD**: Zero FOUC in both themes, SSR-safe theme provider, inline script sets theme early
- [ ] T041 [P] Test theme toggle performance (< 50ms response time)
  - **DoD**: Theme toggle triggers in < 50ms (excluding CSS transition time)
- [ ] T042 [P] Verify responsive design in all themes (mobile, tablet, desktop)
  - **DoD**: Theme toggle accessible on mobile, all pages responsive in both themes
- [ ] T043 [P] Test with different browser zoom levels (100%, 125%, 150%)
  - **DoD**: Theme toggle visible and functional at all zoom levels, no layout breaks

---

## Phase 7: Testing & Documentation

**Purpose**: Comprehensive testing and documentation updates

### Automated Tests

- [ ] T044 [P] Write unit tests for `ThemeToggle` component in `frontend/tests/unit/components/ThemeToggle.test.tsx`
  - **DoD**: Tests cover toggle click, icon changes, theme state updates
- [ ] T045 [P] Write E2E test for theme persistence in `frontend/tests/e2e/theme-toggle.spec.ts`
  - **DoD**: E2E test verifies theme toggle, localStorage persistence, page reload

### Documentation

- [ ] T046 [P] Update `docs/architecture/frontend.md` with theme system architecture
  - **DoD**: Document CSS variable conventions, ThemeProvider setup, component theming patterns
- [ ] T047 [P] Create quickstart guide for adding new themed components
  - **DoD**: Guide explains how to use CSS variables, add theme-aware colors, test in both themes

### Final Validation

- [ ] T048 Run all frontend tests and verify they pass
  - **DoD**: All unit tests pass, E2E tests pass, no test failures
- [ ] T049 Run Lighthouse audit and verify scores
  - **DoD**: Performance > 90, Accessibility > 95, Best Practices > 90 in both themes
- [ ] T050 Final browser validation across all pages and user flows
  - **DoD**: All pages tested in Chrome/Firefox/Safari, both themes, all features work

**Checkpoint**: Feature complete, tested, and documented - ready for PR

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (Theme Toggle) can proceed independently
  - User Story 2 (Aesthetics) can proceed in parallel with US1
  - User Story 3 (Transitions) should come after US1 and US2
- **Edge Cases (Phase 6)**: Depends on all user stories being complete
- **Testing & Docs (Phase 7)**: Depends on all implementation being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Can run in parallel with US1
- **User Story 3 (P2)**: Should start after US1 and US2 are mostly complete (needs components to add transitions to)

### Within Each User Story

- Implementation tasks marked [P] can run in parallel (different files)
- Browser validation tasks should run after implementation tasks
- Each user story should be independently testable at its checkpoint

### Parallel Opportunities

- Phase 1: T002 and T003 can run in parallel
- Phase 2: T004 and T005 can run in parallel
- User Story 2: Most implementation tasks (T016-T028) can run in parallel as they touch different files
- Phase 6: All edge case tasks (T040-T043) can run in parallel
- Phase 7: T044-T047 can run in parallel

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Theme Toggle)
4. Complete Phase 4: User Story 2 (Aesthetics)
5. **STOP and VALIDATE**: Test both stories independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Theme toggle works!)
3. Add User Story 2 → Test independently → Deploy/Demo (Premium design!)
4. Add User Story 3 → Test independently → Deploy/Demo (Smooth transitions!)
5. Polish and document → Final validation → Merge to main

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All hardcoded colors must be replaced with CSS variables
- All animations must respect `prefers-reduced-motion`
- Manual browser testing is MANDATORY for all visual changes
