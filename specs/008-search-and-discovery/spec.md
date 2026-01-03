# Feature Specification: Search and Discovery

**Feature Branch**: `008-search-and-discovery`  
**Created**: 2026-01-03  
**Status**: Draft  
**Input**: Add search option, public recipes, private cookbooks, handle duplicate extractions.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Search and Discovery (Priority: P1)

As a user, I want to search for recipes by title, ingredients, or tags across all public recipes so that I can find new things to cook without having to provide a video URL myself.

**Why this priority**: Core requirement for the "Search" option and "Public recipes" goal.

**Independent Test (Automated)**: 
- Backend: `GET /api/endpoints/recipes/discovery?q=chicken` returns 200 and a list of matching recipes.
- Backend: `GET /api/endpoints/recipes/discovery` returns all public recipes.

**Manual Validation (Frontend)**: 
- User enters "Pasta" in a search bar on the landing page or a new Explore page and sees matching recipe cards.
- User clicks a recipe card from the search results and is taken to the recipe view page.

**Acceptance Scenarios**:
1. **Given** there are public recipes for "Chicken Pasta" and "Steak", **When** I search for "Pasta", **Then** I should only see the "Chicken Pasta" recipe.
2. **Given** I am on the landing page, **When** I scroll to the "Discovery" section, **Then** I should see a selection of the latest public recipes.

---

### User Story 2 - Duplicate Handling (Priority: P1)

As a user, I want the system to recognize if a video has already been analyzed by anyone else, so that I get results instantly and don't waste AI resources.

**Why this priority**: Explicitly requested to handle duplicates and skip re-analyzing.

**Independent Test (Automated)**: 
- Backend: `POST /api/endpoints/extract` with a URL that exists in the database/cache returns the existing data without calling GeminiService.

**Manual Validation (Frontend)**: 
- User pastes a YouTube URL that was previously extracted. The UI shows "Recipe Found!" and redirects to the recipe view almost immediately without the "Extracting..." wait time.

**Acceptance Scenarios**:
1. **Given** a video has been extracted once, **When** another user pastes the same URL, **Then** the existing recipe is displayed immediately.

---

### User Story 3 - Public vs Private (Priority: P2)

As a user, I want my personal collection (Cookbook) to remain private to me, even though the recipes themselves are searchable by others.

**Why this priority**: Essential for privacy as requested ("cookbooks will be private").

**Independent Test (Automated)**: 
- Backend: `GET /api/endpoints/recipes/` only returns recipes owned by the current user.
- Backend: `GET /api/endpoints/recipes/discovery` returns public recipes but does not expose user profile details unless intended.

**Manual Validation (Frontend)**: 
- User A checks their "Vault" (Cookbook) and sees only their recipes. 
- User B cannot see User A's "Vault" even if they search for User A's specific recipes in Discovery.

---

### Edge Cases

- **Search with no results**: Show a friendly "No recipes found" message and suggest extracting a new one.
- **Malformed Search Query**: Handle special characters and empty strings gracefully.
- **Re-analyzing expired cache**: If the cache for a duplicate exists but is expired, should we re-analyze? (Probably yes, for quality).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **Public Flag**: Every recipe created MUST have an `is_public` flag, defaulting to `true`.
- **FR-002**: **Discovery API**: System MUST provide an endpoint to search and filter public recipes.
- **FR-003**: **Duplicate Detection**: System MUST check the database (and cache) by `source_url` before initiating a new AI extraction.
- **FR-004**: **Privacy Boundary**: Access to a user's `My Cookbook` list MUST be restricted to the authenticated owner.
- **FR-005**: **Landing Page Integration**: The landing page MUST include a search bar and a "Top Discoveries" section.

### Key Entities

- **Recipe**: Updated to include `is_public: bool`.
- **SearchQuery**: A new schema for search parameters (query, tags, etc.).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Search results return in under 500ms for a database of 1000 recipes.
- **SC-002**: 100% of duplicate extraction requests return the existing recipe instead of triggering a new AI analysis.
- **SC-003**: Users can successfully toggle a recipe to "Private" if they wish (Optional, but good for "cookbooks are private" nuance).
- **SC-004**: The landing page search bar works without requiring login (Discovery should be public).
