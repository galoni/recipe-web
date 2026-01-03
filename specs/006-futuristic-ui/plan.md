# Implementation Plan - Futuristic UI & Landing Page (Feature 006)

## Overview
This plan addresses the complete UI/UX overhaul of the application, moving to a futuristic "Dark/Neon/Glass" aesthetic and restructuring the application entry point. The public homepage will become a marketing-focused landing page, while the core functionality (Recipe Generation) will be gated behind authentication.

## Proposed Changes

### 1. Foundation & Design System (Frontend)
- **Dependencies**: Install `framer-motion` for animations, `lucide-react` (if not present) for icons.
- **Tailwind Config**: Define the "Futuristic" palette (Deep backgrounds, Neon accents).
- **Global CSS**: Set default dark background, text colors, and font smoothing.
- **Typography**: Import a modern font (e.g., 'Inter' or 'Outfit') via `next/font`.

### 2. Core Components (The "Glass" Kit)
Create a set of reusable UI components that enforce the new style:
- **`components/ui/GlassCard.tsx`**: Base container with backdrop-blur, border gradients.
- **`components/ui/NeonButton.tsx`**: High-emphasis buttons with glow effects.
- **`components/ui/ModernInput.tsx`**: Styled inputs with animated focus states.
- **`components/shared/Navbar.tsx`**: Overhaul existing navbar to be floating/glass.

### 3. Landing Page (Public)
Turn `app/page.tsx` into a marketing page.
- **Hero Section**: High-impact text, "Get Started" CTA (redirects to Login/Register).
- **Features Section**: 3-column layout explaining the value.
- **Tech Visuals**: Abstract energetic background elements.
- **Restriction**: Ensure NO recipe generation form exists here.

### 4. Application Layout & Protected Routes
- **`app/layout.tsx`**: Ensure the global provider wraps everything correctly with the weird new theme.
- **`app/dashboard/page.tsx`** (or reuse `app/page.tsx` with conditional logic? -> Better to separate):
    - *Decision*: Create `app/dashboard/page.tsx` for the main "Paste URL" functionality.
    - *Decision*: Update `middleware.ts` (if exists) or use checking in layout to protect `/dashboard`, `/cookbook`.
- **Redirects**: If user is logged in and hits `/`, show "Go to Dashboard" button or auto-redirect.

## Verification Plan

### Automated Tests
- Update existing component tests to render with the new ThemeProvider context (if added).
- Check that `/dashboard` redirects to login if unauthenticated.

### Manual Verification
- **Visual Check**: Does it look "Futuristic"? (Subjective but critical).
- **Responsiveness**: Mobile menu check.
- **Auth Flow**: Register -> Redirect -> Dashboard.

## Task List
