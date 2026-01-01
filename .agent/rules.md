# ChefStream AI-Driven SDLC Constitution

This document defines the rules, standards, and workflows for all development on the ChefStream project. Both human developers and AI agents must adhere to these guidelines.

## 1. Technology Stack Standard
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS.
- **Backend**: FastAPI (Python 3.10+), Pydantic V2, SQLAlchemy (Async).
- **Database**: PostgreSQL 16+.
- **Infrastructure**: Docker Compose (Local), Docker (Prod).
- **Package Managers**: `pnpm` (Frontend), `poetry` (Backend).

## 2. Coding Standards

### General
- **Comments**: Code must be self-documenting. Use comments *why* decision was made, not *what* code does.
- **Naming**: `snake_case` for Python, `camelCase` for TypeScript/JavaScript variables, `PascalCase` for React components/Classes.

### Frontend (Next.js/React)
- **Strict Typing**: `noImplicitAny` is ON. Interfaces for all props and state.
- **Server Components**: Use Server Components (RSC) by default. Add `'use client'` only when interactivity is needed.
- **Styling**: Tailwind utility classes first. Use `clsx` or `tailwind-merge` for conditional class names.
- **State**: Avoid global state unless necessary (use Zustand if needed). Prefer server state (TanStack Query) for data fetching.

### Backend (Python/FastAPI)
- **Type Hints**: 100% type hint coverage required for function signatures.
- **Models**: Use Pydantic models for ALL request/response schemas.
- **Error Handling**: Use custom exception classes and global exception handlers. Never return raw 500s.
- **Async**: Use `async def` for all route handlers and DB operations.

## 3. Testing Strategy
- **Coverage**: Minimum 80% code coverage required.
- **Frontend**: `vitest` or `jest` for unit tests. `Playwright` for E2E.
- **Backend**: `pytest` for unit/integration tests.
    - Use `conftest.py` for fixtures.
    - Test DB must be spun up/torn down per session or function as appropriate.

## 4. Workflows

### Feature Development
1. **Plan**: Create/Update `implementation_plan.md`.
2. **Test**: Write failing test (TDD preferred).
3. **Implement**: Write code to pass text.
4. **Refactor**: Optimize and clean.

### CI/CD Pipeline
- **Linting**: Pre-commit hooks for `black`, `isort`, `eslint`, `prettier`.
- **Validation**: GitHub Actions must pass on every PR.
