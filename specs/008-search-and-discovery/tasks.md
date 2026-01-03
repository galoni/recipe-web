# Tasks: Search and Discovery

**Input**: Design documents from `/specs/008-search-and-discovery/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan (Explore page, SearchBar component)
- [x] T002 [P] Verify backend environment is ready for database schema changes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T003 Update `backend/app/models/db.py` to include `is_public: bool` (default=True) on `Recipe` model
- [x] T004 Update `backend/app/schemas/recipe.py` to include `is_public` in `Recipe` and `RecipeCreate` schemas
- [x] T005 [P] Create `backend/app/services/discovery.py` to house global search and filtering logic
- [x] T006 [P] Create `frontend/src/components/ui/search-bar.tsx` as a reusable premium component
- [x] T007 Configure structured logging in `discovery.py` to track search performance and cache hits

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Search and Discovery (Priority: P1) 🎯 MVP

**Goal**: Enable users to search and discover public recipes.

**Independent Test**: `GET /api/recipes/explore?q=chicken` returns public chicken recipes.

### Implementation for User Story 1
- [x] T008 [US1] Implement `DiscoveryService.search_recipes` in `backend/app/services/discovery.py`
- [x] T009 [US1] Create `GET /api/recipes/explore` endpoint in `backend/app/api/endpoints/recipes.py`
- [x] T010 [US1] Create `frontend/src/app/explore/page.tsx` for the global discovery view
- [x] T011 [US1] Integrate `SearchBar` into the Explore page and landing page hero section
- [x] T012 [US1] Implement "Recent Discoveries" section on landing page (`frontend/src/app/page.tsx`)
- [x] T013 [US1] Add cascading Framer Motion animations to search results

**Checkpoint**: User can now search for public recipes from the landing page or explore page.

---

## Phase 4: User Story 2 - Duplicate Handling (Priority: P1)

**Goal**: Skip AI extraction if a video has already been analyzed by anyone.

**Independent Test**: Extracting the same URL twice only calls Gemini once (verified via logs/cache).

### Implementation for User Story 2
- [x] T014 [US2] Update `backend/app/api/endpoints/extract.py` to check `Recipe` table by `source_url` before analysis
- [x] T015 [US2] Update duplicate check logic to prefer previously generated `is_public` recipes
- [x] T016 [US2] Ensure `ExtractionCache` is updated/refreshed when a duplicate is found
- [x] T017 [US2] [P] Add unit test in `backend/tests/api/test_extract.py` for skip-analysis logic

**Checkpoint**: Duplicate extractions return instantly and do not trigger Gemini.

---

## Phase 5: User Story 3 - Public vs Private (Priority: P2)

**Goal**: Keep user cookbooks private while allowing the recipes themselves to be public.

**Independent Test**: `GET /api/recipes/` only returns recipes owned by the requester.

### Implementation for User Story 3
- [x] T018 [US3] Update `backend/app/api/endpoints/recipes.py` to filter `read_recipes` by `user_id == current_user.id`
- [x] T019 [US3] Ensure `read_recipe` (single ID) enforces ownership if `is_public` is false
- [x] T020 [US3] Add "Privacy Toggle" (Public/Private) to `RecipeCard` component
- [x] T021 [US3] Update `frontend/src/lib/api.ts` to handle new discovery endpoints

**Checkpoint**: User privacy is enforced; Vault is private, Discovery is public.

---

## Phase 6: Browser Validation (REQUIRED)

**Purpose**: Quality engineering - validate all UI features in the browser

### Manual Browser Testing
- [x] T022 Test SearchBar interaction and autocomplete (if applicable)
- [x] T023 Verify Explore page responsiveness and grid layout
- [x] T024 Validate "Instant Results" experience for duplicate URLs
- [x] T025 Confirm "Vault" remains private to the logged-in user
- [x] T026 Document validation with recorded screen walk-through (verified via browser subagent)

---

## Phase 7: Polish & Documentation

**Purpose**: Final touches and living docs update

- [x] T027 [P] Update `README.md` and `docs/` with "Recipe Discovery" and "Smart Duplicate" details
- [x] T028 Update API documentation (OpenAPI) for `/explore` endpoint
- [x] T029 Performance review: ensure search queries use proper indexing (Title/SourceURL)
- [x] T030 Final code cleanup and refactoring (Modularity Check)
