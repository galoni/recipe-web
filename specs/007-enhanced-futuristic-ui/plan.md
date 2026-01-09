# Implementation Plan - Enhanced Futuristic UI (Feature 007)

## Overview
This plan addresses critical feedback regarding the "broken" dark mode, "ugly" auth pages, and "disgusting" dashboard. The goal is to enforce a high-quality, consistent "Glass & Neon" aesthetic across the entire application and fix the navigation bug in the cookbook.

## Proposed Changes

### 1. Global Visual Fixes
- **Files**: `frontend/src/app/globals.css`, `frontend/tailwind.config.ts`
- **Action**:
    - Verify `:root` vs `.dark` specificity. Ensure variables like `--background` resolve to the dark values by default or force the class on `html`.
    - Flatten the CSS hierarchy if needed to ensure `bg-background` is actually black.

### 2. Landing Page "Alive" Factor
- **Files**: `frontend/src/app/page.tsx`
- **Action**:
    - Remove the "Chef Hat" glass card visual (the "weird div").
    - Implement a "Hero Orb" or "Holographic Pot" using CSS gradients and `animate-float` / `animate-pulse`.
    - Ensure text has high contrast and neon glows.

### 3. Unified Layout for Auth & Dashboard
- **New Component**: `frontend/src/components/shared/BackgroundLayout.tsx`
    - Contains the animated blobs/gradients so we don't copy-paste them everywhere.
- **Files**:
    - `frontend/src/app/login/page.tsx`
    - `frontend/src/app/register/page.tsx`
    - `frontend/src/app/dashboard/page.tsx`
- **Action**: Wrap these pages in `BackgroundLayout` and use `GlassCard` + `NeonButton` + `ModernInput` exclusively.

### 4. Cookbook Navigation Fix
- **File**: `frontend/src/components/shared/RecipeCard.tsx` (or wherever the logic lives).
- **Action**: Change "Cook Now" href from `/dashboard?url=...` (or similar) to `/recipe/${recipe.id}`.

## Verification Plan

### Manual Verification
- **Dark Mode**: Open `localhost:3000`. Is it dark? (Yes/No).
- **Landing Page**: Does the hero look cool/animated?
- **Login**: Does it look consistent with the landing page?
- **Cookbook**: Click "Cook Now" -> Verify URL.

## Task List
