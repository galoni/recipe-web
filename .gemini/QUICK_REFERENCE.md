# Quick Reference: ChefStream Workflows

**Fast reference for daily development with Gemini AI workflows.**

## 🎯 Common Commands

### Create New Feature
```bash
# Auto-generate feature number and branch
.gemini/scripts/bash/create-new-feature.sh "Add user profile management"

# Or with custom name
.gemini/scripts/bash/create-new-feature.sh "Add user profiles" --short-name "user-profiles"

# Or with specific number
.gemini/scripts/bash/create-new-feature.sh "Add user profiles" --number 5
```

### Workflow Commands (in AI assistant)
```
/speckit-constitution  # One-time: Set project principles
/speckit-specify       # Step 1: Define feature (what & why)
/speckit-plan          # Step 2: Create technical plan (how)
/speckit-tasks         # Step 3: Generate task list
/speckit-implement     # Step 4: Execute implementation
/safe-push             # Step 5: Test, format, and push
```

## � Development Cycle

### 1. Specify (What & Why)
```
/speckit-specify Users need to manage their cooking profiles with dietary preferences, skill level, and favorite cuisines. Each profile should track cooking history and suggest personalized recipes.
```

**Output**: `specs/###-feature/spec.md`

### 2. Plan (How)
```
/speckit-plan Use FastAPI with PostgreSQL for user profiles. Store preferences as JSONB. Implement recommendation engine using collaborative filtering. Frontend uses Next.js with profile editing forms.
```

**Outputs**:
- `specs/###-feature/plan.md`
- `specs/###-feature/data-model.md`
- `specs/###-feature/contracts/`
- `specs/###-feature/research.md`

### 3. Tasks (Steps)
```
/speckit-tasks
```

**Output**: `specs/###-feature/tasks.md`

### 4. Implement (Execute)
```
/speckit-implement
```

**Result**: Working feature implementation

### 5. Push (Quality Check)
```
/safe-push
```

**Actions**: Tests → Coverage → Lint → Format → Commit → Push

## � Key Files

| File | Purpose |
|------|---------|
| `.gemini/constitution.md` | Project principles (read first!) |
| `specs/###-feature/spec.md` | Feature requirements |
| `specs/###-feature/plan.md` | Implementation plan |
| `specs/###-feature/tasks.md` | Task breakdown |
| `specs/###-feature/data-model.md` | Database schema |
| `specs/###-feature/contracts/` | API contracts |

## ⚡ Quick Checks

### Before Starting
```bash
# Read constitution
cat .gemini/constitution.md

# Check current branch
git branch --show-current

# List existing features
ls specs/
```

### During Development
```bash
# Run tests
cd backend && poetry run pytest

# Check coverage
poetry run pytest --cov

# Lint code
poetry run ruff check .

# Format code
poetry run ruff format .
```

### Before Committing
```bash
# Use safe-push workflow
/safe-push

# Or manually:
cd backend
poetry run pytest --cov
poetry run ruff check .
poetry run ruff format .
git add .
git commit -m "feat: add user profiles"
git push
```

## 📐 Quality Requirements

From `.gemini/constitution.md`:

| Requirement | Standard |
|-------------|----------|
| **Branching** | Feature branch required (###-name) |
| **CI Checks** | Must pass before merge |
| Test Coverage | >80% |
| AI Model | Google Gemini |
| Function Length | ≤50 lines |
| File Length | ≤300 lines |
| Logging | Structured JSON |
| Security | OWASP compliant |
| UX | Premium, interactive |

## 🎨 Naming Conventions

### Feature Branches
```
###-short-descriptive-name

Examples:
001-gemini-extractor
002-authentication
003-cookbook
004-recipe-search
005-user-profiles
```

### Commit Messages
```
feat: add user profile management
fix: resolve authentication token expiry
docs: update API documentation
test: add integration tests for profiles
chore: update dependencies
```

## 🔧 Troubleshooting

### Template Not Found
```bash
ls .gemini/templates/  # Should show 5 templates
```

### Feature Directory Not Found
```bash
# Set manually
export SPECIFY_FEATURE="004-recipe-search"

# Or check what exists
ls specs/
```

### Branch Number Conflict
```bash
# Use specific number
.gemini/scripts/bash/create-new-feature.sh "Feature" --number 10
```

### Tests Failing
```bash
# Run with verbose output
cd backend
poetry run pytest -v

# Run specific test
poetry run pytest tests/test_specific.py -v

# Check coverage report
poetry run pytest --cov --cov-report=html
open htmlcov/index.html
```

## � Project Structure

```
recipe-web/
├── .gemini/                  # Workflows and templates
│   ├── constitution.md       # Project principles
│   ├── commands/             # Workflow configs
│   ├── templates/            # Feature templates
│   └── scripts/              # Automation scripts
├── .agent/workflows/         # Workflow definitions
├── specs/                    # Feature specifications
│   └── ###-feature-name/
│       ├── spec.md           # Requirements
│       ├── plan.md           # Implementation plan
│       ├── tasks.md          # Task breakdown
│       ├── data-model.md     # Database schema
│       └── contracts/        # API contracts
├── backend/                  # FastAPI backend
├── frontend/                 # Next.js frontend
└── docs/                     # Project documentation
```

## 💡 Pro Tips

### 1. Read Constitution First
Always start by reading `.gemini/constitution.md` to understand project principles.

### 2. Be Specific in Specs
Good: "Users can search recipes by ingredients with autocomplete"
Bad: "Add search feature"

### 3. Separate What from How
- **Spec**: What users need and why
- **Plan**: How to implement technically

### 4. Use Workflows, Don't Skip Steps
Each step builds on the previous one. Skipping leads to rework.

### 5. Test as You Go
Don't wait until the end. Test each component as it's built.

### 6. Keep It Simple
Start with the simplest solution. Add complexity only when needed.

## 🚀 Example: Full Feature Development

```bash
# 1. Create feature
.gemini/scripts/bash/create-new-feature.sh "Recipe rating system"
# Creates: 006-recipe-rating-system

# 2. Define requirements
/speckit-specify Users can rate recipes 1-5 stars and leave reviews. Ratings are averaged and displayed on recipe cards. Users can edit/delete their own reviews.

# 3. Create technical plan
/speckit-plan Add rating model to PostgreSQL with user_id, recipe_id, stars, review_text. Create FastAPI endpoints for CRUD operations. Frontend shows star rating component with review list.

# 4. Generate tasks
/speckit-tasks

# 5. Implement
/speckit-implement

# 6. Test and push
/safe-push
```

## 📞 Need Help?

1. **Full Documentation**: `.gemini/README.md`
2. **Project Principles**: `.gemini/constitution.md`
3. **Workflow Details**: `.agent/workflows/`
4. **Examples**: `specs/001-gemini-extractor/`, `specs/002-authentication/`

---

**Quick Tip**: Bookmark this file for instant access during development!
