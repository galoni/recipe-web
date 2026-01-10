# Testing at ChefStream

We maintain a high standard of code quality through a comprehensive testing strategy involving three layers:

1.  **Backend Unit & Integration Tests** (Pytest) - Covers API logic, services, and database interactions.
2.  **Frontend Component Tests** (Vitest) - Covers UI components, hooks, and utilities.
3.  **End-to-End Tests** (Playwright) - Covers critical user journeys and full-stack integration.

## Quick Start

### Backend
```bash
cd backend
# Run all tests
poetry run pytest
# Run with coverage
poetry run pytest --cov=app
```

### Frontend
```bash
cd frontend
# Run component tests
npm test
# Run with coverage
npm run test:coverage
```

### End-to-End
```bash
cd frontend
# Run E2E tests (requires backend running or mocked)
npm run test:e2e
# Run UI mode
npm run test:e2e:ui
```

## Detailed Guides

- [Frontend Testing Guide](./frontend.md)
- [Backend Testing Guide](./backend.md)
- [End-to-End Testing Guide](./e2e.md)

## Continuous Integration

Our CI pipeline (local via pre-commit and remote via GitHub Actions) enforces:
- **Linting**: Black, Isort, Flake8 (Python); ESLint (TypeScript)
- **Type Checking**: MyPy (Python); TSC (TypeScript)
- **Coverage**:
    - Backend: 80% minimum
    - Frontend: 70% minimum
