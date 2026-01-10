# Walkthrough: Testing Infrastructure Upgrade

This document outlines the extensive upgrades made to the ChefStream testing infrastructure, establishing a robust quality assurance net for both frontend and backend.

## 1. Overview of Changes

We moved from a partial testing setup to a comprehensive, multi-layer strategy:

| Feature | Before | After |
| :--- | :--- | :--- |
| **Frontend Unit** | Basic setup, no coverage goals | **Vitest** setup with **70% coverage** enforcement |
| **End-to-End** | None | **Playwright** suite covering critical flows (Extraction, Cookbook) |
| **Backend CI** | Basic pytest | **Strict MyPy** + **80% coverage** + **Isort/Black/Flake8** |
| **CI Performance** | Slow, no caching | **Optimized** with Poetry/NPM caching |
| **Pre-commit** | None/Manual | **Automatic** hooks ensuring code quality before push |

## 2. New Quality Gates

### Pre-commit Hooks
Run automatically on `git commit`. Checks formatting and basic linting.
- **Python**: Black, Isort, Flake8, MyPy.
- **JS/TS**: ESLint, TSC (via CI/Manual).
- **Universal**: Trailing whitespace, heavy file checks.

### Continuous Integration (GitHub Actions)
Runs on every Push and PR.
1.  **Backend QA**: Lints, Type Checks (MyPy), Tests (Pytest with 80% coverage).
2.  **Frontend QA**: Lints, Type Checks (TSC), Tests (Vitest with 70% coverage).
3.  **Frontend E2E**: Integration tests (Playwright) against mocked API.

## 3. How to Write Tests

### Frontend Integration (E2E)
Location: `frontend/tests/*.spec.ts`
We use Playwright with mocked network requests to ensure stability.

```typescript
test('user can delete recipe', async ({ page }) => {
    // 1. Mock API
    await page.route('**/api/v1/recipes/', async route => { ... });

    // 2. Interact
    await page.goto('/cookbook');
    await page.getByRole('button', { name: 'Delete' }).click();

    // 3. Assert
    await expect(page.getByText('Deleted successfully')).toBeVisible();
});
```

### Backend Services
Location: `backend/tests/unit/services/`
We use `unittest.mock` and `pytest-asyncio`.

```python
@pytest.mark.asyncio
async def test_create_session(mock_db):
    service = SecurityService(mock_db)
    with patch("app.services.email_service.EmailService") as MockEmail:
        await service.create_session(...)
        MockEmail.send_new_device_login_email.assert_called_once()
```

## 4. Troubleshooting CI

- **Coverage Failure**: Run `npm run test:coverage` (frontend) or `poetry run pytest --cov=app` (backend) locally to identify missing lines.
- **Type Errors**: Run `tsc` or `mypy` locally. They must pass with zero errors.
- **E2E Failures**: Check the "Artifacts" section in GitHub Actions summary for screenshots/videos of failed tests.

## 5. Next Steps
- Maintain these thresholds.
- Add E2E tests for new features as part of the Definition of Done.
