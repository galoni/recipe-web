# Development Guidelines

This document outlines the coding standards, workflows, and CI/CD requirements to ensure development is smooth and stable.

## 🚀 The "Pre-Push" Checklist
**Always** run these before pushing to origin. The CI will fail if these are skipped.

### Backend (Python)
- [ ] **Format**: `python3 -m black .` (within `/backend`).
- [ ] **Initialize**: Ensure every new directory has an `__init__.py` file.
- [ ] **Tests**: `poetry run pytest --cov=app --cov-fail-under=80`.
- [ ] **Config**: Ensure `DATABASE_URL` has a default in `config.py` (for CI).
- [ ] **Poetry**: Set `package-mode = false` in `pyproject.toml`.

### Frontend (Next.js)
- [ ] **Lint**: `npm run lint` (ESLint warnings are treated as errors in CI).
- [ ] **Types**: `npx tsc --noEmit`.
- [ ] **Build**: `npm run build` to verify production readiness.

---

## 🏗️ Architectural Patterns

### Backend Service Pattern
- **Logic Isolation**: All external API calls (Gemini, YouTube) MUST be wrapped in a class in `app/services/`.
- **Async First**: Use `AsyncSession` for database interactions and `AsyncMock` for testing async logic.
- **Fail Gracefully**: Database connections in `lifespan` handlers must be wrapped in `try/except` to allow CI runners to execute even without a live DB.

### Aggressive Modularity
- **Complexity Cap**: Functions SHOULD NOT exceed **50 lines**. Files SHOULD NOT exceed **300 lines**.
- **Refactoring**: If a component breaches these limits, it MUST be refactored into smaller, reusable units immediately.

### Frontend Component Pattern
- **Shadcn-lite**: UI components (buttons, inputs) live in `src/components/ui/`.
- **Page Isolation**: Use `Suspense` around client components that use `useSearchParams`.
- **Lucide Icons**: Use consistently for the premium aesthetic.

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
