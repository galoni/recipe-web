# Development Guidelines

This document outlines the coding standards, workflows, and CI/CD requirements to ensure development is smooth and stable.

## 🎯 Pre-Commit Quality Checks (AUTOMATED)

**All quality checks are automated via pre-commit hooks.** These run automatically before each commit to catch issues early.

### Initial Setup (One-Time)

```bash
# Install pre-commit (if not already installed)
python3 -m pip install pre-commit

# Install the git hooks
python3 -m pre_commit install
```

### What Gets Checked Automatically

All checks are defined in `.pre-commit-config.yaml` (the single source of truth):

**Python (Backend)**:
- ✅ Black formatting
- ✅ isort import sorting
- ✅ mypy type checking
- ✅ Trailing whitespace, file endings

**TypeScript/React (Frontend)**:
- ✅ ESLint linting
- ✅ TypeScript type checking
- ✅ Trailing whitespace, file endings

**Universal**:
- ✅ YAML syntax
- ✅ Merge conflict markers
- ✅ Large files (>1MB)

### When Hooks Run

Pre-commit hooks are intended to run at the **END of feature development**, before your final commit. Work freely during development, then run quality checks before committing completed work.

### Manual Execution

```bash
# Run all hooks on all files
python3 -m pre_commit run --all-files

# Run hooks on staged files only
git commit  # Hooks run automatically

# Skip hooks (EMERGENCY ONLY - must fix in follow-up commit)
git commit --no-verify
```

### Troubleshooting

- **Hooks fail**: Fix the reported issues and commit again
- **Hooks too slow**: They only run on changed files by default
- **Need to update hooks**: Edit `.pre-commit-config.yaml`

### Legacy: Manual Pre-Push Checklist

If pre-commit hooks are not installed, manually run:

**Backend**: `cd backend && python3 -m black . && poetry run pytest --cov=app --cov-fail-under=80`
**Frontend**: `cd frontend && npm run lint && npx tsc --noEmit && npm run build`

---

## 🏗️ Architectural Patterns

### Backend Service Pattern
- **Logic Isolation**: All external API calls (Gemini, YouTube) MUST be wrapped in a class in `app/services/`.
- **Async First**: Use `AsyncSession` for database interactions and `AsyncMock` for testing async logic.
- **Fail Gracefully**: Database connections in `lifespan` handlers must be wrapped in `try/except` to allow CI runners to execute even without a live DB.

### Aggressive Modularity
- **Complexity Cap**: Functions SHOULD NOT exceed **50 lines**. Files SHOULD NOT exceed **300 lines**.
- **Refactoring**: If a component breaches these limits, it MUST be refactored into smaller, reusable units immediately.

### Database Migrations
- **Alembic**: ALWAYS use `alembic revision --autogenerate` for schema changes.
- **Handling Data**: If adding a `NOT NULL` column, ensure the migration script handles existing rows by setting a default value.

### Frontend Component Pattern
- **Shadcn-lite**: UI components (buttons, inputs) live in `src/components/ui/`.
- **Page Isolation**: Use `Suspense` around client components that use `useSearchParams`.
- **Lucide Icons**: Use consistently for the premium aesthetic.

---

## Feature Development Workflow

We use **Spec-Kit** for all feature development.
Please verify the full workflow in [`docs/processes/spec_workflow.md`](docs/processes/spec_workflow.md).

**Quick Summary**:
1. Run `.specify/scripts/bash/create-new-feature.sh`
2. Write Spec (`spec.md`)
3. Run `.specify/scripts/bash/setup-plan.sh`
4. Write Plan (`plan.md`)
5. Create Tasks (`tasks.md`)
6. Implement & Verify

---

## 🧪 Testing Strategy

1. **Unit Tests**: Test single functions/classes in isolation. Mock ALL network calls.
2. **Contract Tests**: Verify the API endpoint matches the spec. Use `app.testclient.TestClient`. Mock the services layer.
3. **Regression Tests**: Use the "Golden Set" approach in `backend/tests/regression/`. These tests check the quality of AI extractions against known good outputs.

---

## 🛠️ Tooling Gotchas

- **Poetry**: Do not use `pip install` directly if possible; use `poetry add`. However, in GitHub Actions, we often use `poetry install --no-root`.
- **AsyncMock**: When mocking `await` calls, use `mock_obj.attribute = AsyncMock(return_value=...)` instead of `mock_obj.attribute.return_value = ...` to avoid `TypeError: AsyncMock object cannot be used in await expression`.
- **Next.js**: Unused imports and variables will trigger ESLint errors. Remove them before committing.
