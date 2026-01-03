# Example Flow: Building a Recipe Rating Feature

This document walks through a complete example of using the Gemini workflows to build a new feature from start to finish.

## 🎯 Feature Goal

Add a recipe rating system where users can:
- Rate recipes with 1-5 stars
- Write text reviews
- Edit or delete their own reviews
- See average ratings on recipe cards

## 📋 Step-by-Step Walkthrough

### Step 0: Preparation

**Read the Constitution**
```bash
cat .gemini/constitution.md
```

**Key principles to remember:**
- >80% test coverage required
- Use Gemini for AI operations
- Keep functions ≤50 lines
- Structured JSON logging
- Premium UX required

### Step 1: Create Feature Specification

**Command:**
```bash
.gemini/scripts/bash/create-new-feature.sh "Recipe rating and review system"
```

**What happens:**
- Creates branch: `006-recipe-rating-system`
- Creates directory: `specs/006-recipe-rating-system/`
- Copies template: `specs/006-recipe-rating-system/spec.md`

**Now use the workflow:**
```
/speckit-specify
```

**Prompt:**
```
Users should be able to rate recipes they've tried with a 1-5 star rating and optionally write a text review. Each user can only rate a recipe once, but they can edit or delete their rating later. Recipe cards should display the average rating and total number of ratings. Users can view all reviews for a recipe, sorted by most recent first. Reviews should show the reviewer's username, rating, review text, and date posted.
```

**What the AI does:**
1. Analyzes your requirements
2. Creates user stories
3. Defines acceptance criteria
4. Identifies edge cases
5. Generates `spec.md` with structured requirements

**Output: `specs/006-recipe-rating-system/spec.md`**
```markdown
# Recipe Rating and Review System

## User Stories

### US-1: Rate a Recipe
As a user who has tried a recipe,
I want to rate it with 1-5 stars,
So that I can share my experience with others.

**Acceptance Criteria:**
- User can select 1-5 stars for a recipe
- Rating is saved immediately
- User can only rate each recipe once
- Rating updates the recipe's average rating

### US-2: Write a Review
As a user,
I want to write a text review along with my rating,
So that I can provide detailed feedback.

**Acceptance Criteria:**
- Review text is optional
- Review can be up to 1000 characters
- Review is displayed with username and date
- Review can be edited or deleted by the author

### US-3: View Ratings
As any user,
I want to see the average rating and review count on recipe cards,
So that I can quickly assess recipe quality.

**Acceptance Criteria:**
- Average rating displayed as stars (e.g., 4.5/5)
- Number of ratings shown (e.g., "42 ratings")
- Ratings update in real-time
- Unrated recipes show "No ratings yet"
```

### Step 2: Create Implementation Plan

**Command:**
```
/speckit-plan
```

**Prompt:**
```
Use FastAPI for the backend with PostgreSQL for data storage. Create a ratings table with columns: id, user_id, recipe_id, stars (1-5), review_text, created_at, updated_at. Add foreign keys to users and recipes tables. Create REST API endpoints for CRUD operations on ratings. Frontend uses Next.js with a star rating component (react-rating-stars-component). Display average ratings using a database view or computed field. Implement optimistic UI updates for better UX.
```

**What the AI does:**
1. Reads the spec.md
2. Reads constitution.md for compliance
3. Creates technical architecture
4. Defines database schema
5. Specifies API contracts
6. Plans frontend components
7. Identifies technology choices

**Outputs:**

**`specs/006-recipe-rating-system/plan.md`**
```markdown
# Implementation Plan: Recipe Rating System

## Architecture Overview

### Backend (FastAPI)
- New `ratings` table in PostgreSQL
- CRUD endpoints for ratings
- Computed average rating per recipe
- Authorization checks (users can only edit their own ratings)

### Frontend (Next.js)
- StarRating component (interactive)
- ReviewList component (paginated)
- ReviewForm component (create/edit)
- Optimistic UI updates

## Database Schema
See: data-model.md

## API Contracts
See: contracts/ratings-api.json

## Technology Stack
- Backend: FastAPI, SQLAlchemy, PostgreSQL
- Frontend: Next.js, React Query, react-rating-stars-component
- Testing: pytest, React Testing Library
```

**`specs/006-recipe-rating-system/data-model.md`**
```markdown
# Data Model

## Ratings Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FOREIGN KEY → users.id, NOT NULL |
| recipe_id | UUID | FOREIGN KEY → recipes.id, NOT NULL |
| stars | INTEGER | CHECK (stars >= 1 AND stars <= 5), NOT NULL |
| review_text | TEXT | NULLABLE, MAX 1000 chars |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

**Indexes:**
- UNIQUE(user_id, recipe_id) - One rating per user per recipe
- INDEX(recipe_id) - Fast lookup of recipe ratings
- INDEX(created_at) - Sort by date

## Recipe Ratings View

```sql
CREATE VIEW recipe_ratings AS
SELECT 
    recipe_id,
    AVG(stars) as average_rating,
    COUNT(*) as rating_count
FROM ratings
GROUP BY recipe_id;
```
```

**`specs/006-recipe-rating-system/contracts/ratings-api.json`**
```json
{
  "endpoints": [
    {
      "method": "POST",
      "path": "/api/ratings",
      "description": "Create a new rating",
      "request": {
        "recipe_id": "uuid",
        "stars": "integer (1-5)",
        "review_text": "string (optional, max 1000)"
      },
      "response": {
        "id": "uuid",
        "user_id": "uuid",
        "recipe_id": "uuid",
        "stars": "integer",
        "review_text": "string",
        "created_at": "timestamp"
      }
    },
    {
      "method": "GET",
      "path": "/api/recipes/{recipe_id}/ratings",
      "description": "Get all ratings for a recipe",
      "response": {
        "ratings": "array",
        "average": "float",
        "count": "integer"
      }
    }
  ]
}
```

### Step 3: Generate Task Breakdown

**Command:**
```
/speckit-tasks
```

**What the AI does:**
1. Reads plan.md
2. Reads data-model.md
3. Reads contracts/
4. Breaks down into sequential tasks
5. Identifies parallel tasks
6. Creates test-first task ordering

**Output: `specs/006-recipe-rating-system/tasks.md`**
```markdown
# Tasks: Recipe Rating System

## Phase 1: Database Setup

- [ ] **Task 1.1**: Create ratings table migration
  - File: `backend/alembic/versions/006_add_ratings_table.py`
  - Create table with schema from data-model.md
  - Add foreign keys and constraints
  - Create indexes

- [ ] **Task 1.2**: Create recipe_ratings view
  - File: Same migration file
  - Add view for average ratings
  - Test view returns correct aggregations

## Phase 2: Backend Models & Services

- [ ] **Task 2.1**: Create Rating model
  - File: `backend/app/models/rating.py`
  - SQLAlchemy model matching schema
  - Add relationships to User and Recipe

- [ ] **Task 2.2**: Create rating service (TDD)
  - File: `backend/tests/services/test_rating_service.py` (write first)
  - File: `backend/app/services/rating_service.py` (implement after)
  - Methods: create_rating, update_rating, delete_rating, get_recipe_ratings
  - Test coverage: >80%

## Phase 3: API Endpoints

- [ ] **Task 3.1**: Create ratings endpoints (TDD)
  - File: `backend/tests/api/test_ratings.py` (write first)
  - File: `backend/app/api/ratings.py` (implement after)
  - POST /api/ratings - Create rating
  - PUT /api/ratings/{id} - Update rating
  - DELETE /api/ratings/{id} - Delete rating
  - GET /api/recipes/{id}/ratings - Get recipe ratings

- [ ] **Task 3.2**: Add authorization checks
  - Users can only edit/delete their own ratings
  - Test unauthorized access returns 403

## Phase 4: Frontend Components

- [ ] **Task 4.1**: Create StarRating component
  - File: `frontend/components/StarRating.tsx`
  - Interactive star selection
  - Display-only mode for showing ratings
  - Test: renders correctly, handles clicks

- [ ] **Task 4.2**: Create ReviewForm component
  - File: `frontend/components/ReviewForm.tsx`
  - Star rating input
  - Review text textarea (max 1000 chars)
  - Submit/cancel buttons
  - Test: validation, submission

- [ ] **Task 4.3**: Create ReviewList component
  - File: `frontend/components/ReviewList.tsx`
  - Display reviews with pagination
  - Show username, stars, text, date
  - Edit/delete buttons for own reviews
  - Test: renders reviews, pagination works

## Phase 5: Integration

- [ ] **Task 5.1**: Add ratings to recipe cards
  - File: `frontend/components/RecipeCard.tsx`
  - Display average rating
  - Show rating count
  - Link to full reviews

- [ ] **Task 5.2**: Create recipe ratings page
  - File: `frontend/app/recipes/[id]/ratings/page.tsx`
  - Show all reviews
  - Allow authenticated users to add/edit rating
  - Optimistic UI updates

## Phase 6: Testing & Documentation

- [ ] **Task 6.1**: Integration tests
  - File: `backend/tests/integration/test_ratings_flow.py`
  - Test complete rating flow
  - Test edge cases (duplicate ratings, etc.)

- [ ] **Task 6.2**: E2E tests
  - File: `frontend/tests/e2e/ratings.spec.ts`
  - Test user can rate recipe
  - Test user can edit rating
  - Test ratings display correctly

- [ ] **Task 6.3**: Update documentation
  - File: `docs/api/ratings.md`
  - Document rating endpoints
  - Add examples

**Estimated Time**: 2-3 days
**Dependencies**: Authentication system (002-authentication)
```

### Step 4: Implement

**Command:**
```
/speckit-implement
```

**What the AI does:**
1. Reads tasks.md
2. Executes tasks in order
3. Writes tests first (TDD)
4. Implements code to pass tests
5. Runs tests after each task
6. Marks tasks complete [x]
7. Commits after each phase

**Example execution:**
```
✓ Task 1.1: Created ratings table migration
✓ Task 1.2: Created recipe_ratings view
✓ Task 2.1: Created Rating model
✓ Task 2.2: Created rating service (12 tests passing)
✓ Task 3.1: Created ratings endpoints (18 tests passing)
✓ Task 3.2: Added authorization checks (6 tests passing)
✓ Task 4.1: Created StarRating component
✓ Task 4.2: Created ReviewForm component
✓ Task 4.3: Created ReviewList component
✓ Task 5.1: Added ratings to recipe cards
✓ Task 5.2: Created recipe ratings page
✓ Task 6.1: Integration tests (8 tests passing)
✓ Task 6.2: E2E tests (5 tests passing)
✓ Task 6.3: Updated documentation

Total: 49 tests passing
Coverage: 87%
```

### Step 5: Test and Push

**Command:**
```
/safe-push
```

**What happens:**
1. Runs all tests
2. Checks coverage (must be >80%)
3. Runs linter
4. Formats code
5. Commits changes
6. Pushes to remote

**Output:**
```
✓ Tests: 49 passing
✓ Coverage: 87% (threshold: 80%)
✓ Linting: No issues
✓ Formatting: Applied
✓ Committed: feat: add recipe rating and review system
✓ Pushed to: origin/006-recipe-rating-system
```

## 📊 Final Result

### Files Created

```
specs/006-recipe-rating-system/
├── spec.md                          # Requirements
├── plan.md                          # Implementation plan
├── tasks.md                         # Task breakdown
├── data-model.md                    # Database schema
└── contracts/
    └── ratings-api.json             # API contracts

backend/
├── alembic/versions/
│   └── 006_add_ratings_table.py     # Migration
├── app/
│   ├── models/rating.py             # Rating model
│   ├── services/rating_service.py   # Business logic
│   └── api/ratings.py               # API endpoints
└── tests/
    ├── services/test_rating_service.py
    ├── api/test_ratings.py
    └── integration/test_ratings_flow.py

frontend/
├── components/
│   ├── StarRating.tsx               # Star rating component
│   ├── ReviewForm.tsx               # Review form
│   └── ReviewList.tsx               # Review list
├── app/recipes/[id]/ratings/
│   └── page.tsx                     # Ratings page
└── tests/e2e/
    └── ratings.spec.ts              # E2E tests

docs/api/
└── ratings.md                       # API documentation
```

### Metrics

- **Time**: 2-3 days (vs 5-7 days traditional)
- **Tests**: 49 tests, 87% coverage
- **Files**: 15 new files
- **Lines of Code**: ~1,200 lines
- **Documentation**: Complete and up-to-date

## 💡 Key Takeaways

### What Worked Well

1. **Clear Specification**: Detailed user stories prevented scope creep
2. **Technical Plan**: Architecture decisions documented upfront
3. **Task Breakdown**: Sequential tasks made progress trackable
4. **Test-First**: TDD caught bugs early
5. **Automation**: Workflows saved hours of manual work

### Best Practices Followed

✅ Read constitution before starting
✅ Separated "what" (spec) from "how" (plan)
✅ Generated tasks before implementing
✅ Wrote tests first (TDD)
✅ Achieved >80% coverage
✅ Used structured logging
✅ Kept functions <50 lines
✅ Updated documentation

### Common Pitfalls Avoided

❌ Jumping straight to code without spec
❌ Mixing requirements with implementation
❌ Skipping test coverage
❌ Over-engineering the solution
❌ Forgetting to update docs

## 🚀 Next Steps

After this feature is complete:

1. **Create PR**: Use GitHub CLI to create pull request
2. **Code Review**: Team reviews spec, plan, and implementation
3. **Merge**: Merge to main after approval
4. **Deploy**: CI/CD deploys to staging
5. **Monitor**: Check metrics and user feedback
6. **Iterate**: Create new feature branch for improvements

---

**This example demonstrates the full power of Specification-Driven Development with Gemini AI workflows.**
