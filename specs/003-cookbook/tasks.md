---
description: "Task list for My Cookbook implementation"
---

# Tasks: My Cookbook Integration

**Input**: Design documents from `/specs/003-cookbook/`
**Prerequisites**: plan.md (required), spec.md (required)

## Phase 1: Foundational (Backend & API)

- [x] T001 Implement `DELETE /api/v1/recipes/{id}` in `backend/app/api/endpoints/recipes.py`
- [x] T002 Update `frontend/src/lib/api.ts` with `getRecipes` and `deleteRecipe`
- [x] T003 Create contract test for recipe management in `backend/tests/contract/test_cookbook.py`

## Phase 2: UI Components

- [x] T004 Create `frontend/src/components/shared/recipe-card.tsx`
- [x] T005 Implement hover effects and Lucide icon integration in `RecipeCard`
- [x] T006 Create deletion confirmation modal component

## Phase 3: Cookbook Page Integration

- [x] T007 Implement `useQuery` for fetching recipes in `frontend/src/app/cookbook/page.tsx`
- [x] T008 Implement `useMutation` for deleting recipes
- [x] T009 Polish grid layout with Framer Motion (staggered entrance)
- [x] T010 Handle empty state transition between "Loading" and "No Recipes"

## Phase 4: Verification

- [x] T011 Verify end-to-end flow: Extract -> Save -> View -> Delete
- [x] T012 Run full test suite and verify >80% coverage on `recipes.py`
