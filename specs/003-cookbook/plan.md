# Implementation Plan: My Cookbook Integration

**Spec**: `specs/003-cookbook/spec.md`

## Architecture Overview

The cookbook integration will leverage the existing FastAPI backend endpoints and the React Query (TanStack Query) library for efficient data fetching and caching on the frontend.

## Proposed Changes

### Backend (Minor Fixes/Additions)
#### [MODIFY] [recipes.py](file:///Users/galaloni/dev/recipe-web/backend/app/api/endpoints/recipes.py)
- Ensure the `DELETE` endpoint is implemented (currently only `POST` and `GET` were visible in research).
- [Wait, I should check if DELETE exists first].

### Frontend (Core Work)
#### [MODIFY] [api.ts](file:///Users/galaloni/dev/recipe-web/frontend/src/lib/api.ts)
- Add `getRecipes` and `deleteRecipe` functions.

#### [NEW] [RecipeCard.tsx](file:///Users/galaloni/dev/recipe-web/frontend/src/components/shared/recipe-card.tsx)
- Create a reusable component following the "ChefStream" aesthetic (glassmorphism, soft shadows, Lucide icons).

#### [MODIFY] [cookbook/page.tsx](file:///Users/galaloni/dev/recipe-web/frontend/src/app/cookbook/page.tsx)
- Use `useQuery` from TanStack Query to fetch recipes.
- Map the data to `RecipeCard` components.
- Implement deletion logic with `useMutation`.

## Verification Plan

### Automated Tests
- **Contract Test**: Add `backend/tests/contract/test_cookbook.py` to verify GET and DELETE.

### Manual Verification
1. Login with a test user.
2. Extract a recipe from a YouTube URL and save it.
3. Navigate to `/cookbook`.
4. Verify the recipe card appears correctly.
5. Click "Delete" and verify it is removed.
