# Implementation Plan: Search and Discovery

**Branch**: `008-search-and-discovery` | **Date**: 2026-01-03 | **Spec**: `/specs/008-search-and-discovery/spec.md`
**Input**: Feature specification for search, discovery, and duplicate handling.

## Summary

This feature transforms ChefStream from a single-user extraction tool into a discoverable recipe platform. 
1.  **Duplicate Analysis Prevention**: The backend will check for existing extractions by `video_id` (regardless of user) to provide instant results and reduce AI costs.
2.  **Privacy Model**: Recipes will have an `is_public` toggle. The "My Cookbook" (Vault) remains private, while public recipes are indexed for search.
3.  **Global Search & Discovery**: A new "Explore" module with a search bar and a "Top Discoveries" section on the landing page.

## Operational & Security Context

*   **Security**: Implement strict Row Level Security (logic-based) in FastAPI. `GET /api/recipes` returns *owned* recipes. `GET /api/recipes/explore` returns *public* recipes.
*   **Observability**: Track `cache_hit_ratio` for extractions to measure the efficiency of the duplicate handling logic.
*   **Environment**: Docker configuration remains unchanged.
*   **Docs Impact**: Update `README.md` with "Exploring Recipes" section. Update API documentation for new endpoints.

## Technical Context

**Language/Version**: Python 3.11, TypeScript 5.x
**Primary Dependencies**: FastAPI, SQLAlchemy, Next.js 14, Framer Motion
**Storage**: PostgreSQL (via SQLAlchemy)
**Testing**: pytest (backend), React Testing Library + Manual Browser Validation (frontend)
**Target Platform**: Web (Responsive)
**Performance Goals**: Search results under 200ms. Duplicate extraction return under 100ms.
**Constraints**: AI extraction should only be triggered if no valid public extraction exists for the source URL.

## Constitution Check

- [x] **Infrastructure as Truth**: No environment changes required.
- [x] **Backend Quality**: Target 80% coverage for search logic and duplicate detection.
- [x] **Frontend Quality**: Manual browser validation of search UI and landing page animations.
- [x] **Security First**: Input sanitization on search queries. Authz checks on recipe visibility.
- [x] **Operational Excellence**: Structured logs for extraction source (AI vs Cache).
- [x] **Living Documentation**: Updating specs and plans in real-time.
- [x] **Modularity**: Search logic isolated in `app/services/discovery.py`.
- [x] **UX Wow Factor**: Premium search bar transition and cascading recipe cards.

## Project Structure

### Documentation

```text
specs/008-search-and-discovery/
├── plan.md              # This file
├── spec.md              # Feature requirements
└── tasks.md             # To be generated
```

### Source Code

```text
backend/
├── app/
│   ├── api/
│   │   └── endpoints/
│   │       ├── recipes.py    # Updated for is_public and explore
│   │       └── extract.py    # Updated for global duplicate check
│   ├── models/
│   │   └── db.py             # Added is_public to Recipe
│   ├── schemas/
│   │   └── recipe.py         # Added is_public to schemas
│   └── services/
│       └── discovery.py      # New search/filter logic
└── tests/
    └── api/
        └── test_discovery.py # New tests

frontend/
├── src/
│   ├── app/
│   │   ├── explore/          # New Explore page
│   │   │   └── page.tsx
│   │   └── page.tsx          # Updated landing page
│   ├── components/
│   │   ├── shared/
│   │   │   └── recipe-card.tsx # Updated with public badge
│   │   └── ui/
│   │       └── search-bar.tsx  # New component
│   └── lib/
│       └── api.ts            # Updated for discovery endpoints
```

**Structure Decision**: Web application structure (Option 2) as it involves both FastAPI and Next.js changes.

## Complexity Tracking

*No violations identified.*
