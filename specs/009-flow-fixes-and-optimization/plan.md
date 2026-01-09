# Implementation Plan - Flow Fixes and UX Optimization

This plan addresses the broken navigation, core functional bugs, and mobile responsiveness issues identified during site exploration.

## User Review Required

> [!IMPORTANT]
> - Should we implement a full Profile and Settings page, or should they redirect somewhere else for now (e.g., Dashboard)?
> - For the "Synchronizing Library" hang: I will investigate if this is a frontend state issue or a backend API failure.

---

## Proposed Changes

### 1. Navigation & Route Fixes (P1)

#### [Frontend] Missing Pages
- Create `frontend/src/app/profile/page.tsx`: Basic user profile view with holographic aesthetic.
- Create `frontend/src/app/settings/page.tsx`: Basic settings view (theme toggle, account info).

#### [Frontend] Route Consistency
- Verify `frontend/src/app/recipe/[id]/page.tsx` matches the URL structure used in `recipe-card.tsx`.
- Fix the data fetching logic in the recipe detail page to ensure it correctly handles the `id` param.

#### [Frontend] Cookbook Sync Fix
- Investigate `frontend/src/app/cookbook/page.tsx`. Check if the `useQuery` for recipes is failing or if the loading state is never cleared.

### 2. Mobile Responsiveness (P2)

#### [Frontend] Navbar Mobile Menu
- Update `frontend/src/components/shared/navbar.tsx`.
- Add `useState` for mobile menu toggle.
- Implement an `AnimatePresence` mobile drawer/overlay that appears when the hamburger is clicked.

#### [Frontend] Auth Forms
- Update `frontend/src/app/login/page.tsx` and `frontend/src/app/register/page.tsx`.
- Ensure the containers use `overflow-y-auto` on mobile.
- Adjust padding and form sizing for smaller viewports.

#### [Frontend] Landing Page Polish
- Adjust font sizes in `frontend/src/app/page.tsx` hero section for `sm` and `md` breakpoints.
- Fix "Neural Source" bubbles overlapping on mobile.

### 3. Functional Search (P3)

#### [Frontend] Search Integration
- Update `SearchBar` to properly pass the query to the `/explore` page.
- Ensure the `/explore` page reads the `q` search param and filters results accordingly.

---

## Verification Plan

### Automated Tests
- Run `npm run build` in `frontend` to ensure no route/type errors.
- (Optional) Add a basic Playwright/Cypress test for navigation flow if infrastructure exists.

### Manual Verification
- **Navigation**: Click every link in the navbar (Gallery, Explore, Studio, Library, Profile) and verify they lead to valid pages.
- **Recipe Detail**: Open a recipe from the Gallery and verify it displays ingredients and instructions.
- **Mobile Check**: Use Chrome DevTools (375x667) to:
  - Open/close the hamburger menu.
  - View the Register form (verify all inputs are visible).
  - Verify Hero text is contained within the viewport.
- **Search**: Enter "chicken" in the search bar and verify the Explore page loads with relevant results.
