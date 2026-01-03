---
description: "Task list for My Cookbook implementation"
---

# Tasks: My Cookbook Integration

**Input**: Design documents from `/specs/003-cookbook/`
**Prerequisites**: plan.md (required), spec.md (required)

## Phase 1: Foundational (Backend & API)

- [ ] T001 Implement `DELETE /api/v1/recipes/{id}` in `backend/app/api/endpoints/recipes.py`
- [ ] T002 Update `frontend/src/lib/api.ts` with `getRecipes` and `deleteRecipe`
- [ ] T003 Create contract test for recipe management in `backend/tests/contract/test_cookbook.py`

## Phase 2: UI Components

- [ ] T004 Create `frontend/src/components/shared/recipe-card.tsx`
- [ ] T005 Implement hover effects and Lucide icon integration in `RecipeCard`
- [ ] T006 Create deletion confirmation modal component

## Phase 3: Cookbook Page Integration

- [ ] T007 Implement `useQuery` for fetching recipes in `frontend/src/app/cookbook/page.tsx`
- [ ] T008 Implement `useMutation` for deleting recipes
- [ ] T009 Polish grid layout with Framer Motion (staggered entrance)
- [ ] T010 Handle empty state transition between "Loading" and "No Recipes"

## Phase 4: Verification

- [ ] T011 Verify end-to-end flow: Extract -> Save -> View -> Delete
- [ ] T012 Run full test suite and verify >80% coverage on `recipes.py`
