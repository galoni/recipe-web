# Tasks: Testing Infrastructure Upgrade

**Input**: Design documents from `/specs/011-testing-infrastructure-upgrade/`
**Prerequisites**: plan.md (completed), spec.md (completed)

**Organization**: Tasks are grouped by implementation phase from plan.md to enable systematic rollout of testing infrastructure.

## Format: `[ID] [P?] [Phase] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Phase]**: Which phase this task belongs to (P0, P1, P2, P3, P4, P5)
- Include exact file paths in descriptions

## Phase 0: Setup & Configuration (Priority 1) 🎯

**Goal**: Create centralized quality configuration and install pre-commit framework

**Checkpoint**: Pre-commit hooks working locally, constitution updated

- [ ] T001 [P0] Create `.pre-commit-config.yaml` with Python hooks (black, isort, mypy, flake8)
- [ ] T002 [P0] Add TypeScript hooks to `.pre-commit-config.yaml` (eslint, tsc)
- [ ] T003 [P0] Add universal hooks to `.pre-commit-config.yaml` (trailing-whitespace, end-of-file-fixer, check-merge-conflict, check-added-large-files)
- [ ] T004 [P] [P0] Add mypy configuration to `backend/pyproject.toml` (strict mode, exclusions)
- [ ] T005 [P] [P0] Install pre-commit framework (`pip install pre-commit`, `pre-commit install`)
- [ ] T006 [P0] Test pre-commit hooks on sample Python file with formatting issues (verify blocks commit)
- [ ] T007 [P0] Test pre-commit hooks on sample TypeScript file with type errors (verify blocks commit)
- [ ] T008 [P0] Test pre-commit hooks on clean code (verify allows commit)
- [ ] T009 [P0] Update constitution Principle VI to reference `.pre-commit-config.yaml`
- [ ] T010 [P] [P0] Update `DEVELOPMENT.md` with pre-commit installation instructions
- [ ] T011 [P0] Run `pre-commit run --all-files` and fix any existing issues

**Definition of Done**: Pre-commit hooks block bad commits, allow good commits, constitution references config file

---

## Phase 1: Frontend Testing Setup (Priority 1) 🎯

**Goal**: Establish Vitest for component testing with 70%+ coverage goal

**Checkpoint**: Frontend tests running, coverage reporting working, CI integrated

### Setup Tasks

- [ ] T012 [P] [P1] Install vitest dependencies (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`)
- [ ] T013 [P1] Create `frontend/vitest.config.ts` with coverage thresholds (70%), jsdom environment
- [ ] T014 [P] [P1] Create `frontend/src/test-utils/setup.ts` (global test setup, extend matchers)
- [ ] T015 [P] [P1] Create `frontend/src/test-utils/mocks.ts` (API mocks, auth mocks)
- [ ] T016 [P] [P1] Create `frontend/src/test-utils/render.tsx` (custom render with providers)
- [ ] T017 [P1] Add test scripts to `frontend/package.json` (test, test:ui, test:coverage, test:watch)

### Component Tests

- [ ] T018 [P] [P1] Write tests for `LoginForm` component in `frontend/src/__tests__/components/auth/LoginForm.test.tsx` (rendering, validation, submission, error states)
- [ ] T019 [P] [P1] Write tests for `RecipeCard` component in `frontend/src/__tests__/components/shared/RecipeCard.test.tsx` (props, interactions, edge cases, responsive)
- [ ] T020 [P] [P1] Write tests for `Navbar` component in `frontend/src/__tests__/components/shared/Navbar.test.tsx` (navigation, auth state, mobile menu)
- [ ] T021 [P] [P1] Write tests for at least 2 more critical components to reach 70% coverage

### CI Integration

- [ ] T022 [P1] Update `.github/workflows/ci.yml` to add frontend-test job
- [ ] T023 [P1] Configure frontend-test job to run `npm test` with coverage
- [ ] T024 [P1] Configure frontend-test job to fail if coverage < 70%
- [ ] T025 [P1] Test CI locally and verify coverage enforcement works

**Definition of Done**: `npm test` passes, coverage ≥70%, CI enforces coverage threshold

---

## Phase 2: E2E Testing Setup (Priority 2)

**Goal**: Establish Playwright for end-to-end testing of critical flows

**Checkpoint**: E2E tests running locally and in CI, screenshots on failure

### Setup Tasks

- [ ] T026 [P] [P2] Install Playwright (`@playwright/test`)
- [ ] T027 [P2] Run `npx playwright install --with-deps` to install browsers
- [ ] T028 [P2] Create `frontend/playwright.config.ts` (browsers: chromium/firefox/webkit, base URL, screenshots on failure, trace on retry)
- [ ] T029 [P] [P2] Create `frontend/e2e/fixtures/` directory for test data
- [ ] T030 [P2] Add E2E scripts to `frontend/package.json` (test:e2e, test:e2e:ui, test:e2e:debug)

### E2E Tests

- [ ] T031 [P] [P2] Write auth flow E2E test in `frontend/e2e/auth.spec.ts` (login, register, logout)
- [ ] T032 [P] [P2] Write recipe extraction E2E test in `frontend/e2e/recipe-extraction.spec.ts` (URL input, extraction, display)
- [ ] T033 [P] [P2] Write cookbook management E2E test in `frontend/e2e/cookbook.spec.ts` (save, view, delete recipes)
- [ ] T034 [P] [P2] Write at least 2 more E2E tests for critical flows

### CI Integration

- [ ] T035 [P2] Update `.github/workflows/ci.yml` to add e2e-test job
- [ ] T036 [P2] Configure e2e-test job to start Docker Compose services
- [ ] T037 [P2] Configure e2e-test job to run Playwright in headless mode
- [ ] T038 [P2] Configure e2e-test job to upload screenshots/traces as artifacts on failure
- [ ] T039 [P2] Test E2E tests in CI and verify they pass

**Definition of Done**: E2E tests pass locally and in CI, screenshots captured on failure

---

## Phase 3: Backend Testing Improvements (Priority 1) 🎯

**Goal**: Add tests for previously omitted files and enable type checking

**Checkpoint**: mypy passing, coverage omissions removed, 80%+ coverage maintained

### Type Checking Setup

- [ ] T040 [P] [P3] Add type annotations to `backend/app/services/security_service.py`
- [ ] T041 [P] [P3] Add type annotations to `backend/app/services/email_service.py`
- [ ] T042 [P] [P3] Add type annotations to `backend/app/services/geoip.py`
- [ ] T043 [P3] Run `poetry run mypy app/` and fix any type errors
- [ ] T044 [P3] Verify mypy passes with zero errors

### Unit Tests

- [ ] T045 [P] [P3] Write unit tests for `SecurityService` in `backend/tests/unit/services/test_security_service.py` (2FA setup, verification, session management, device tracking)
- [ ] T046 [P] [P3] Write unit tests for `EmailService` in `backend/tests/unit/services/test_email_service.py` (email sending, templates, error handling)
- [ ] T047 [P] [P3] Write unit tests for `GeoIPService` in `backend/tests/unit/services/test_geoip.py` (location lookup, caching, error handling)
- [ ] T048 [P3] Remove coverage omissions from `backend/pyproject.toml` (security_service, email_service, geoip, security endpoint)
- [ ] T049 [P3] Run `poetry run pytest --cov=app --cov-fail-under=80` and verify passes

### CI Integration

- [ ] T050 [P3] Update `.github/workflows/ci.yml` backend-qa job to run mypy
- [ ] T051 [P3] Verify CI fails on type errors
- [ ] T052 [P3] Verify CI fails if coverage drops below 80%

**Definition of Done**: mypy passes, all services have tests, coverage ≥80%, no omissions

---

## Phase 4: CI Pipeline Improvements (Priority 2)

**Goal**: Optimize CI with caching and ensure it mirrors pre-commit checks

**Checkpoint**: CI completes in <5 minutes, uses caching, mirrors pre-commit

### Caching

- [ ] T053 [P] [P4] Add Poetry cache to `.github/workflows/ci.yml` backend-qa job
- [ ] T054 [P] [P4] Add npm cache to `.github/workflows/ci.yml` frontend-qa job
- [ ] T055 [P4] Test CI with caching and measure build time improvement

### Pre-commit Alignment

- [ ] T056 [P4] Ensure CI backend-qa job runs all checks from `.pre-commit-config.yaml` (black, isort, mypy, flake8)
- [ ] T057 [P4] Ensure CI frontend-qa job runs all checks from `.pre-commit-config.yaml` (eslint, tsc)
- [ ] T058 [P4] Add clear error reporting to CI (coverage reports, test summaries)

### Optimization

- [ ] T059 [P4] Optimize job parallelization (run backend-qa, frontend-qa, frontend-test, e2e-test in parallel)
- [ ] T060 [P4] Measure total CI duration and optimize to <5 minutes
- [ ] T061 [P4] Test full CI pipeline end-to-end

**Definition of Done**: CI mirrors pre-commit, uses caching, completes in <5 minutes

---

## Phase 5: Documentation & Training (Priority 3)

**Goal**: Document testing practices and train team

**Checkpoint**: All documentation complete, team trained

### Documentation

- [ ] T062 [P] [P5] Create `docs/testing/README.md` (testing overview, philosophy, quick start)
- [ ] T063 [P] [P5] Create `docs/testing/frontend.md` (Vitest guide, examples, best practices)
- [ ] T064 [P] [P5] Create `docs/testing/backend.md` (pytest guide, fixtures, mocking)
- [ ] T065 [P] [P5] Create `docs/testing/e2e.md` (Playwright guide, selectors, debugging)
- [ ] T066 [P] [P5] Update `README.md` with testing commands section
- [ ] T067 [P5] Create walkthrough document in `specs/011-testing-infrastructure-upgrade/walkthrough.md`

### Training (if applicable)

- [ ] T068 [P5] Conduct team walkthrough of testing infrastructure
- [ ] T069 [P5] Answer team questions and gather feedback

**Definition of Done**: All docs complete, README updated, walkthrough created

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 0 (Setup)**: No dependencies - can start immediately ✅
- **Phase 1 (Frontend Testing)**: Can start in parallel with Phase 0
- **Phase 2 (E2E Testing)**: Depends on Phase 1 (needs test-utils)
- **Phase 3 (Backend Testing)**: Can start in parallel with Phase 0
- **Phase 4 (CI Improvements)**: Depends on Phases 0, 1, 2, 3 (needs all checks defined)
- **Phase 5 (Documentation)**: Can start anytime, complete after all phases

### Recommended Execution Order

**Sprint 1 (Quick Wins)**:
1. Complete Phase 0 (Setup & Configuration) - 1-2 days
2. Complete Phase 3 (Backend Testing) - 2-3 days
3. Update constitution after Phase 0 complete

**Sprint 2 (Frontend Testing)**:
4. Complete Phase 1 (Frontend Testing) - 3-5 days

**Sprint 3 (E2E & Polish)**:
5. Complete Phase 2 (E2E Testing) - 3-5 days
6. Complete Phase 4 (CI Improvements) - 1-2 days
7. Complete Phase 5 (Documentation) - 1-2 days

### Parallel Opportunities

- Phases 0 and 3 can run in parallel (different codebases)
- Within each phase, tasks marked [P] can run in parallel
- Documentation (Phase 5) can be written alongside implementation

---

## Success Metrics

- [ ] Pre-commit hooks installed and working for all developers
- [ ] Frontend test coverage ≥70%
- [ ] 5+ E2E test scenarios passing
- [ ] Python type coverage ≥90% (excluding tests)
- [ ] Backend test coverage ≥80% with no omissions
- [ ] CI build time <5 minutes
- [ ] Zero formatting/linting issues reach CI (caught by pre-commit)
- [ ] All tests passing in CI
- [ ] Documentation complete and accessible

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Phase] label maps task to specific phase for organization
- Pre-commit hooks are intended to run at END of feature development
- Constitution should only be updated AFTER Phase 0 is complete and tested
- Stop at each checkpoint to validate phase independently
- Commit after each task or logical group
