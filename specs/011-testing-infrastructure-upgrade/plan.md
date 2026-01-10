# Implementation Plan: Testing Infrastructure Upgrade

**Branch**: `011-testing-infrastructure-upgrade` | **Date**: 2026-01-09 | **Spec**: [spec.md](./spec.md)

## Summary

Establish a comprehensive quality infrastructure that catches issues before they reach the repository. This implementation introduces:

1. **Centralized Quality Configuration** (`.pre-commit-config.yaml`) - Single source of truth for all quality checks
2. **Pre-commit Hooks** - Automated checks that run at the end of feature development
3. **Frontend Testing** - Vitest for component tests (70%+ coverage) and Playwright for E2E tests
4. **Python Type Checking** - mypy for static type safety
5. **Improved CI Pipeline** - Mirrors pre-commit checks with caching for faster builds

**Key Technical Approach**: Use the pre-commit framework to manage hooks, configure all checks in `.pre-commit-config.yaml`, and ensure CI mirrors these checks exactly. Frontend testing uses Vitest (fast, modern) and Playwright (reliable E2E). Constitution will reference the centralized config file, not hardcode commands.

## Operational & Security Context

* **Security**: No direct security implications. Quality checks help prevent security vulnerabilities (type errors, linting catches common issues). Pre-commit hooks run locally, no secrets exposed.
* **Observability**: Test results and coverage reports provide visibility into code quality. CI generates artifacts (coverage reports, test results, Playwright traces).
* **Environment**: Dockerfile updates NOT required. Pre-commit runs on host machine. CI uses existing Docker setup for E2E tests.
* **Docs Impact**:
  - `DEVELOPMENT.md` - Add pre-commit setup instructions
  - `README.md` - Update testing section with new frameworks
  - New: `docs/testing/` - Testing guidelines and best practices

## Technical Context

**Language/Version**: Python 3.13 (backend), TypeScript 5 (frontend), Node.js 20
**Primary Dependencies**:
- Backend: pre-commit, mypy, black, isort, pytest, pytest-cov
- Frontend: vitest, @testing-library/react, @playwright/test, jsdom

**Storage**: N/A (testing infrastructure)
**Testing**: pytest (backend), vitest (frontend unit), playwright (E2E)
**Target Platform**: macOS/Linux development, Ubuntu CI (GitHub Actions)
**Project Type**: Web application (Next.js frontend + FastAPI backend)
**Performance Goals**:
- Pre-commit hooks: <30 seconds
- Frontend tests: <2 minutes
- E2E tests: <5 minutes
- CI pipeline: <5 minutes total

**Constraints**:
- Must work with existing Docker Compose setup
- Must support Python 3.13 and Node.js 20
- Must be compatible with macOS (Bash 3.2)
- Pre-commit hooks should not disrupt development flow

**Scale/Scope**:
- ~50 frontend components to test
- ~20 backend services to type-check
- 5+ critical E2E flows
- 2 developers initially, scalable to team

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Infrastructure as Truth**: No Dockerfile changes needed. Pre-commit runs on host, CI uses existing containers.
- [x] **Backend Quality**: >80% coverage maintained. New tests for previously omitted files (security, email, geoip).
- [x] **Frontend Quality**: E2E tests with Playwright for critical flows. Manual validation documented in spec.
- [x] **Security First**: Pre-commit hooks catch common security issues (type errors, linting). No new authz needed.
- [x] **Operational Excellence**: Test reports provide observability. CI artifacts for debugging.
- [x] **Living Documentation**: `docs/testing/` created with guidelines. DEVELOPMENT.md updated.
- [x] **Modularity**: Configuration files are modular. Test utilities are reusable. No large files.
- [x] **UX Wow Factor**: N/A (infrastructure feature, no user-facing UI)

## Project Structure

### Documentation (this feature)

```text
specs/011-testing-infrastructure-upgrade/
├── spec.md              # Feature specification (COMPLETED)
├── plan.md              # This file (IN PROGRESS)
├── tasks.md             # Task breakdown (NEXT STEP)
└── walkthrough.md       # Implementation walkthrough (AFTER IMPLEMENTATION)
```

### Source Code (repository root)

```text
# Root Configuration Files (NEW)
.pre-commit-config.yaml   # Centralized quality checks configuration
.github/workflows/
└── ci.yml                # Updated CI pipeline with caching and E2E tests

# Backend (UPDATED)
backend/
├── pyproject.toml        # Add mypy configuration
├── tests/
│   ├── unit/
│   │   └── services/
│   │       ├── test_security_service.py  # NEW: Previously omitted
│   │       ├── test_email_service.py     # NEW: Previously omitted
│   │       └── test_geoip.py             # NEW: Previously omitted
│   └── fixtures/         # NEW: Shared test fixtures
└── .mypy.ini             # Optional: Separate mypy config if needed

# Frontend (UPDATED)
frontend/
├── vitest.config.ts      # NEW: Vitest configuration
├── playwright.config.ts  # NEW: Playwright configuration
├── src/
│   ├── __tests__/        # NEW: Component tests
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── LoginForm.test.tsx
│   │   │   ├── shared/
│   │   │   │   ├── Navbar.test.tsx
│   │   │   │   └── RecipeCard.test.tsx
│   │   │   └── recipe/
│   │   │       └── IngredientList.test.tsx
│   │   ├── hooks/
│   │   └── utils/
│   └── test-utils/       # NEW: Testing utilities
│       ├── setup.ts      # Test setup and global mocks
│       ├── mocks.ts      # API mocks
│       └── render.tsx    # Custom render with providers
├── e2e/                  # NEW: E2E tests
│   ├── auth.spec.ts      # Login, register, logout flows
│   ├── recipe-extraction.spec.ts  # Recipe extraction flow
│   ├── cookbook.spec.ts  # Cookbook management
│   └── fixtures/         # E2E test data
└── package.json          # Add vitest, playwright dependencies

# Documentation (NEW)
docs/
└── testing/
    ├── README.md         # Testing overview
    ├── frontend.md       # Frontend testing guide
    ├── backend.md        # Backend testing guide
    └── e2e.md            # E2E testing guide
```

**Structure Decision**: Web application structure (Option 2). Frontend and backend are separate with their own test configurations. Root-level `.pre-commit-config.yaml` applies to both. Documentation centralized in `docs/testing/`.

## Implementation Phases

### Phase 0: Setup & Configuration (Priority 1)

**Goal**: Create centralized quality configuration and install pre-commit framework

**Deliverables**:
1. `.pre-commit-config.yaml` with all quality checks defined
2. Pre-commit framework installed and tested
3. Constitution updated to reference `.pre-commit-config.yaml`
4. DEVELOPMENT.md updated with setup instructions

**Tasks**:
- Create `.pre-commit-config.yaml` with hooks for:
  - Python: black, isort, mypy, flake8
  - TypeScript: eslint, tsc
  - Universal: trailing-whitespace, end-of-file-fixer, check-merge-conflict
- Add mypy configuration to `backend/pyproject.toml`
- Test pre-commit hooks on sample commits
- Update constitution Principle VI to reference config file
- Document pre-commit setup in DEVELOPMENT.md

**Acceptance Criteria**:
- Pre-commit hooks block commits with formatting errors
- Pre-commit hooks block commits with type errors
- Pre-commit hooks allow clean commits
- Constitution references `.pre-commit-config.yaml`

### Phase 1: Frontend Testing Setup (Priority 1)

**Goal**: Establish Vitest for component testing with 70%+ coverage goal

**Deliverables**:
1. Vitest configured and running
2. Test utilities and mocks created
3. Tests for 3+ critical components (LoginForm, RecipeCard, Navbar)
4. Coverage reporting integrated with CI

**Tasks**:
- Install vitest, @testing-library/react, jsdom
- Create `vitest.config.ts` with coverage thresholds (70%)
- Create `src/test-utils/` with setup, mocks, custom render
- Write tests for LoginForm (rendering, validation, submission)
- Write tests for RecipeCard (props, interactions, edge cases)
- Write tests for Navbar (navigation, auth state, responsive)
- Add test scripts to `package.json` (test, test:ui, test:coverage)
- Update CI to run frontend tests and enforce coverage

**Acceptance Criteria**:
- `npm test` runs and passes
- Coverage report generated (HTML + terminal)
- Coverage threshold enforced (70%+)
- CI runs frontend tests and fails if coverage drops

### Phase 2: E2E Testing Setup (Priority 2)

**Goal**: Establish Playwright for end-to-end testing of critical flows

**Deliverables**:
1. Playwright configured for cross-browser testing
2. E2E tests for 5 critical flows
3. Screenshot/trace capture on failure
4. CI integration with Docker Compose

**Tasks**:
- Install @playwright/test
- Create `playwright.config.ts` (browsers, base URL, screenshots)
- Create `e2e/auth.spec.ts` (login, register, logout)
- Create `e2e/recipe-extraction.spec.ts` (URL input, extraction, display)
- Create `e2e/cookbook.spec.ts` (save, view, delete recipes)
- Configure Playwright to use Docker Compose environment in CI
- Add E2E test scripts to `package.json` (test:e2e, test:e2e:ui)
- Update CI to run E2E tests in headless mode

**Acceptance Criteria**:
- `npm run test:e2e` runs and passes
- Tests run in Chromium, Firefox, WebKit
- Screenshots captured on failure
- CI runs E2E tests against Docker Compose environment

### Phase 3: Backend Testing Improvements (Priority 1)

**Goal**: Add tests for previously omitted files and enable type checking

**Deliverables**:
1. mypy type checking enabled and passing
2. Tests for security_service, email_service, geoip
3. Coverage omissions removed from pyproject.toml
4. Type annotations added to existing code

**Tasks**:
- Configure mypy in `pyproject.toml` (strict mode for new code)
- Add type annotations to `app/services/security_service.py`
- Add type annotations to `app/services/email_service.py`
- Add type annotations to `app/services/geoip.py`
- Write unit tests for SecurityService (2FA, session management)
- Write unit tests for EmailService (email sending, templates)
- Write unit tests for GeoIPService (location lookup, caching)
- Remove coverage omissions from `pyproject.toml`
- Update CI to run mypy and enforce type checking

**Acceptance Criteria**:
- `poetry run mypy app/` passes with zero errors
- Coverage for security_service, email_service, geoip >80%
- No coverage omissions in pyproject.toml
- CI fails on type errors

### Phase 4: CI Pipeline Improvements (Priority 2)

**Goal**: Optimize CI with caching and ensure it mirrors pre-commit checks

**Deliverables**:
1. CI caches Poetry and npm dependencies
2. CI mirrors all pre-commit checks exactly
3. CI provides clear error messages
4. CI completes in <5 minutes

**Tasks**:
- Add Poetry cache to `.github/workflows/ci.yml`
- Add npm cache to `.github/workflows/ci.yml`
- Ensure CI runs all checks from `.pre-commit-config.yaml`
- Add frontend test job to CI
- Add E2E test job to CI (with Docker Compose)
- Optimize job parallelization
- Add clear error reporting (coverage reports, test summaries)
- Measure and optimize CI duration

**Acceptance Criteria**:
- CI uses cached dependencies (faster builds)
- CI mirrors pre-commit checks (black, isort, mypy, eslint, tsc)
- CI runs frontend tests with coverage
- CI runs E2E tests in Docker Compose
- CI completes in <5 minutes for typical PRs

### Phase 5: Documentation & Training (Priority 3)

**Goal**: Document testing practices and train team

**Deliverables**:
1. Testing documentation in `docs/testing/`
2. DEVELOPMENT.md updated with pre-commit setup
3. README.md updated with testing commands
4. Team walkthrough completed

**Tasks**:
- Create `docs/testing/README.md` (overview, philosophy)
- Create `docs/testing/frontend.md` (Vitest guide, examples)
- Create `docs/testing/backend.md` (pytest guide, fixtures)
- Create `docs/testing/e2e.md` (Playwright guide, best practices)
- Update DEVELOPMENT.md with pre-commit installation
- Update README.md with testing commands
- Create walkthrough document in `specs/011-testing-infrastructure-upgrade/walkthrough.md`
- Conduct team walkthrough (if applicable)

**Acceptance Criteria**:
- All documentation complete and reviewed
- DEVELOPMENT.md includes pre-commit setup
- README.md includes testing commands
- Walkthrough document created

## Complexity Tracking

> No constitution violations. All checks passed.

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Pre-commit hooks too slow | Medium | High | Optimize hook execution, allow selective running, document `--no-verify` |
| E2E tests flaky | High | Medium | Implement retry logic, proper waits, use data-testid selectors |
| Type checking breaks existing code | Medium | High | Use gradual typing, exclude legacy code initially, add types incrementally |
| CI duration exceeds 5 minutes | Medium | Medium | Optimize caching, parallelize jobs, profile slow steps |
| Low frontend test coverage | Low | Medium | Start with critical components, set realistic initial goal (50%), increase to 70% |
| Team resistance to pre-commit hooks | Low | Low | Emphasize benefits, provide clear docs, make hooks fast |

## Success Metrics

- [ ] Pre-commit hooks installed for all developers
- [ ] Frontend test coverage ≥70%
- [ ] 5+ E2E test scenarios passing
- [ ] Python type coverage ≥90% (excluding tests)
- [ ] CI build time <5 minutes
- [ ] Zero formatting/linting issues reach CI
- [ ] All tests passing in CI
