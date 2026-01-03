# Feature Specification: My Cookbook Integration

**Feature Branch**: `003-cookbook`
**Created**: 2026-01-03
**Status**: Draft
**Input**: User request: "Phase 2: Feature - 'My Cookbook' Integration"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Saved Recipes (Priority: P1)

As a logged-in user, I want to see a grid of all my saved recipes so I can quickly access them for cooking.

**Why this priority**: Core functionality for returning users.

**Independent Test**:
- Backend: `GET /api/v1/recipes/` returns a list of recipes for the authenticated user.
- Frontend: Navigating to `/cookbook` displays a grid of recipe cards.

**Acceptance Scenarios**:
1. **Given** I have saved recipes, **When** I navigate to the cookbook page, **Then** I see a beautiful grid of cards with recipe titles and thumbnails.
2. **Given** I have NO saved recipes, **When** I navigate to the cookbook page, **Then** I see a "Your library is empty" state with a call-to-action to extract a recipe.

---

### User Story 2 - Delete Recipe (Priority: P2)

As a user, I want to remove recipes from my cookbook that I no longer need.

**Why this priority**: Prevents clutter and gives users control over their data.

**Independent Test**:
- Backend: `DELETE /api/v1/recipes/{id}` returns 204 No Content.
- Frontend: Clicking "Delete" on a recipe card removes it from the UI immediately.

**Acceptance Scenarios**:
1. **Given** a recipe card in my cookbook, **When** I click the delete button and confirm, **Then** the recipe is removed from the list.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST fetch recipes from the `GET /api/v1/recipes/` endpoint.
- **FR-002**: System MUST display a "Premium" grid layout using Framer Motion for stagger animations.
- **FR-003**: Recipe cards MUST show Title, Description (truncated), Thumbnail, and "View" button.
- **FR-004**: System MUST handle loading states with skeleton screens or a themed spinner.
- **FR-005**: System MUST implement a "Delete" confirmation dialog.

### Key Entities

- **Recipe**: Reusing existing schema from Spec 001.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Cookbook page loads and renders in under 500ms for a user with 20 recipes.
- **SC-002**: UI remains responsive during deletion (optimistic updates or clear loading states).
