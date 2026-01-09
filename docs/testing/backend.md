# Backend Testing Guide

We use **Pytest** for backend testing, using `asyncio` for async DB tests.

## Tech Stack
- **Runner**: Pytest
- **Async Support**: `pytest-asyncio`
- **Mocking**: `unittest.mock` (`AsyncMock`, `patch`)
- **Coverage**: `pytest-cov`

## Running Tests

```bash
cd backend
poetry run pytest
```

Configuration is in `pyproject.toml` under `[tool.pytest.ini_options]`.

## Structure
- `backend/tests/unit/`: Isolated unit tests (mocked DB).
- `backend/tests/integration/`: API endpoint tests (using test DB or mocked services).
- `backend/tests/conftest.py`: Global fixtures (e.g., `db_session`).

## Guidelines

1.  **Service Tests**:
    - Mock external dependencies (`GeoIPService`, `EmailService`).
    - Use `AsyncMock` for async methods.
    - Validate logic (conditionals, error handling).

2.  **Strict Typing**:
    - All services must include type annotations.
    - CI runs `mypy` to enforce this.

## Coverage Requirement
We enforce an **80%** coverage threshold. CI will fail if coverage drops below this.
