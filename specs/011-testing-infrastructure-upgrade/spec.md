# Feature Specification: Testing Infrastructure Upgrade

**Feature Branch**: `011-testing-infrastructure-upgrade`
**Created**: 2026-01-09
**Status**: Draft

## Overview

Establish a comprehensive quality infrastructure that catches issues before they reach the repository. This feature introduces:

1. **Pre-commit Hooks**: Automated quality checks that run at the end of each feature development (before final commit), ensuring all code meets quality standards before entering the repository.

2. **Centralized Quality Configuration**: A single source of truth (`.quality-checks.yml` or similar) that defines all quality checks. The constitution will reference this configuration file rather than hardcoding commands, making it easy to update and maintain.

3. **Frontend Testing Framework**: Comprehensive testing with Vitest for React components (70%+ coverage goal) and Playwright for end-to-end testing of critical user flows.

4. **Improved CI Pipeline**: Enhanced GitHub Actions workflow that mirrors pre-commit checks, uses caching for faster builds, and provides clear feedback on failures.

**Key Principle**: Pre-commit hooks are the **last step** before committing completed feature work, not a continuous interruption during development. Developers work freely, then run quality checks before final commit.

## User Scenarios & Testing

### User Story 1 - Developer Catches Issues Before Commit (Priority: P1)

As a developer, I want to catch formatting, linting, and type errors before committing code, so that I don't waste time waiting for CI to fail and can fix issues immediately.

**Why this priority**: This provides the fastest feedback loop and prevents broken code from entering the repository. It's the foundation for all other quality improvements.

**Independent Test (Automated)**:
- Pre-commit hook runs successfully on sample code changes
- Hook blocks commits with formatting errors
- Hook blocks commits with type errors
- Hook allows clean commits to proceed

**Manual Validation**:
1. Make a code change with formatting issues
2. Attempt to commit
3. Verify hook blocks commit and shows clear error message
4. Fix issues and verify commit succeeds

**Acceptance Scenarios**:

1. **Given** a Python file with incorrect formatting, **When** developer attempts to commit, **Then** pre-commit hook blocks the commit and shows Black formatting errors
2. **Given** a TypeScript file with type errors, **When** developer attempts to commit, **Then** pre-commit hook blocks the commit and shows type checking errors
3. **Given** properly formatted and typed code, **When** developer commits, **Then** pre-commit hook passes and commit succeeds
4. **Given** a developer runs `pre-commit run --all-files`, **When** all checks pass, **Then** developer sees success message for all hooks

---

### User Story 2 - Frontend Components Are Tested (Priority: P1)

As a developer, I want automated tests for React components, so that I can refactor with confidence and catch regressions before they reach production.

**Why this priority**: Frontend has zero test coverage currently. This is critical for maintaining quality as the application grows.

**Independent Test (Automated)**:
- Vitest runs and reports coverage
- Critical components (LoginForm, RecipeCard, Navbar) have tests
- Tests verify component rendering and user interactions
- Coverage threshold enforced in CI (70%+)

**Manual Validation**:
1. Run `npm test` in frontend directory
2. Verify tests pass and coverage report is generated
3. Make a breaking change to a component
4. Verify tests catch the regression

**Acceptance Scenarios**:

1. **Given** the Vitest setup is complete, **When** developer runs `npm test`, **Then** all tests execute and pass
2. **Given** a component test exists, **When** component props change, **Then** test verifies correct rendering
3. **Given** a user interaction test, **When** simulated user clicks a button, **Then** test verifies expected behavior occurs
4. **Given** coverage is below 70%, **When** CI runs, **Then** build fails with coverage report
5. **Given** developer runs `npm run test:ui`, **When** Vitest UI opens, **Then** developer can interactively debug tests

---

### User Story 3 - Critical User Flows Are Tested End-to-End (Priority: P2)

As a developer, I want automated end-to-end tests for critical flows (authentication, recipe extraction), so that I can verify the entire system works together before deploying.

**Why this priority**: E2E tests catch integration issues that unit tests miss. They provide confidence that the full user experience works.

**Independent Test (Automated)**:
- Playwright tests run against local development environment
- Tests cover: login, registration, recipe extraction, cookbook management
- Tests capture screenshots on failure
- Tests run in CI on every PR

**Manual Validation**:
1. Run `npm run test:e2e` in frontend directory
2. Watch browser automation execute test scenarios
3. Verify test report shows all scenarios passing
4. Introduce a bug and verify E2E test catches it

**Acceptance Scenarios**:

1. **Given** Playwright is configured, **When** developer runs E2E tests, **Then** browser opens and executes test scenarios
2. **Given** a login flow test, **When** test enters credentials and submits, **Then** test verifies successful navigation to dashboard
3. **Given** a recipe extraction test, **When** test submits a YouTube URL, **Then** test verifies recipe page displays with ingredients
4. **Given** an E2E test fails, **When** test completes, **Then** screenshot and trace are saved for debugging
5. **Given** E2E tests in CI, **When** PR is created, **Then** tests run against Docker Compose environment

---

### User Story 4 - Python Code Is Type-Safe (Priority: P1)

As a developer, I want static type checking for Python code, so that I catch type-related bugs before runtime.

**Why this priority**: Type checking catches entire classes of bugs at development time and improves code documentation.

**Independent Test (Automated)**:
- mypy runs successfully on all Python code
- Type errors block CI builds
- Strict mode enabled for new code
- Existing code gradually typed

**Manual Validation**:
1. Run `poetry run mypy app/` in backend directory
2. Verify type checking completes without errors
3. Introduce a type error
4. Verify mypy catches the error

**Acceptance Scenarios**:

1. **Given** mypy is configured, **When** developer runs type checking, **Then** all type errors are reported
2. **Given** a function with incorrect type annotations, **When** mypy runs, **Then** error is reported with line number
3. **Given** properly typed code, **When** mypy runs in CI, **Then** build passes
4. **Given** strict mode is enabled, **When** new code is added without types, **Then** mypy reports error

---

### Edge Cases

- **Pre-commit hooks fail to install**: Provide clear installation instructions and fallback to CI
- **Tests fail in CI but pass locally**: Ensure consistent environments (Docker, dependencies)
- **E2E tests are flaky**: Implement retry logic and proper wait strategies
- **Coverage drops below threshold**: Provide clear error message with uncovered files
- **Type checking too strict for legacy code**: Use gradual typing with exclusions
- **Hooks are too slow**: Optimize hook execution, allow skipping with `--no-verify` flag (documented)
- **Frontend tests require mocking**: Provide utilities for mocking API calls and auth state

## Requirements

### Functional Requirements

#### Centralized Quality Configuration
- **FR-001**: System MUST define all quality checks in a centralized configuration file (`.pre-commit-config.yaml`)
- **FR-002**: Constitution MUST reference the centralized configuration file, not hardcode commands
- **FR-003**: Quality checks MUST be version-controlled and consistent across all developers
- **FR-004**: Configuration MUST be easily updateable without modifying constitution

#### Pre-commit Hooks
- **FR-005**: System MUST run all checks defined in centralized configuration before commit
- **FR-006**: Pre-commit hooks MUST run Black formatter check on Python files
- **FR-007**: Pre-commit hooks MUST run isort import sorting check on Python files
- **FR-008**: Pre-commit hooks MUST run mypy type checking on Python files
- **FR-009**: Pre-commit hooks MUST run ESLint on TypeScript/TSX files
- **FR-010**: Pre-commit hooks MUST run TypeScript type checking on TypeScript/TSX files
- **FR-011**: System MUST block commits if any hook fails
- **FR-012**: System MUST provide clear error messages when hooks fail
- **FR-013**: Developers MUST be able to bypass hooks with `--no-verify` flag (for emergencies)
- **FR-014**: Pre-commit hooks are intended to run at END of feature development, before final commit

#### Frontend Testing (Vitest)
- **FR-015**: System MUST support testing React components with Vitest
- **FR-016**: System MUST generate code coverage reports
- **FR-017**: System MUST enforce minimum 70% coverage threshold
- **FR-018**: System MUST support testing hooks and utilities
- **FR-019**: System MUST provide mocking utilities for API calls
- **FR-020**: System MUST support snapshot testing for components
- **FR-021**: System MUST run tests in watch mode during development
- **FR-022**: System MUST integrate with CI pipeline

#### E2E Testing (Playwright)
- **FR-023**: System MUST support cross-browser testing (Chromium, Firefox, WebKit)
- **FR-024**: System MUST test authentication flow (login, register, logout)
- **FR-025**: System MUST test recipe extraction flow (URL input, extraction, display)
- **FR-026**: System MUST test cookbook management (save, view, delete recipes)
- **FR-027**: System MUST capture screenshots on test failure
- **FR-028**: System MUST generate HTML test reports
- **FR-029**: System MUST support running tests in headless mode (CI)
- **FR-030**: System MUST support running tests in headed mode (debugging)
- **FR-031**: System MUST integrate with Docker Compose for CI testing

#### Python Type Checking (mypy)
- **FR-032**: System MUST run mypy type checking on all Python code
- **FR-033**: System MUST use strict mode for type checking
- **FR-034**: System MUST allow gradual typing with exclusions for legacy code
- **FR-035**: System MUST block CI builds on type errors
- **FR-036**: System MUST provide clear type error messages

#### Improved CI Pipeline
- **FR-037**: CI MUST mirror all pre-commit checks exactly
- **FR-038**: CI MUST cache Poetry dependencies to reduce build time
- **FR-039**: CI MUST cache npm dependencies to reduce build time
- **FR-040**: CI MUST provide clear, actionable error messages on failure
- **FR-041**: CI MUST run frontend tests with coverage reporting
- **FR-042**: CI MUST run E2E tests in Docker Compose environment
- **FR-043**: CI MUST fail if any quality check fails (no warnings allowed)
- **FR-044**: CI MUST complete in under 5 minutes for typical PRs

### Non-Functional Requirements

- **NFR-001**: Pre-commit hooks MUST complete in under 30 seconds for typical commits
- **NFR-002**: Frontend tests MUST complete in under 2 minutes
- **NFR-003**: E2E tests MUST complete in under 5 minutes
- **NFR-004**: CI pipeline MUST cache dependencies to reduce build time
- **NFR-005**: Test reports MUST be easily accessible and readable
- **NFR-006**: Documentation MUST be updated with testing guidelines

### Key Entities

- **Centralized Quality Configuration** (`.pre-commit-config.yaml`): Single source of truth for all quality checks. Defines what tools run, in what order, and with what parameters. Referenced by both pre-commit hooks and CI pipeline to ensure consistency.
- **Constitution Reference**: Constitution points to `.pre-commit-config.yaml` for quality check definitions, not hardcoded commands
- **Vitest Configuration** (`vitest.config.ts`): Defines test runner settings, coverage thresholds
- **Playwright Configuration** (`playwright.config.ts`): Defines E2E test settings, browsers, base URL
- **mypy Configuration** (`pyproject.toml`): Defines type checking rules and exclusions
- **CI Workflow** (`.github/workflows/ci.yml`): Mirrors pre-commit checks, adds caching and E2E tests
- **Test Fixtures**: Reusable test data and setup utilities
- **Test Mocks**: Mock implementations for external services (API, auth)

## Success Criteria

### Measurable Outcomes

- **SC-001**: Pre-commit hooks installed and running for all developers (100% adoption)
- **SC-002**: Frontend test coverage reaches 70%+ within first implementation phase
- **SC-003**: At least 5 critical E2E test scenarios implemented and passing
- **SC-004**: Python codebase has 90%+ type coverage (excluding tests)
- **SC-005**: CI build time reduced by 20% through caching optimizations
- **SC-006**: Zero formatting/linting issues reach CI (caught by pre-commit hooks)
- **SC-007**: Developers report increased confidence in refactoring (qualitative feedback)
- **SC-008**: Regression bugs caught in testing phase increase by 50%
- **SC-009**: All new code has accompanying tests (enforced by coverage threshold)
- **SC-010**: E2E test flakiness rate below 5% (95%+ consistent pass rate)

### Quality Gates

- ✅ All pre-commit hooks pass on sample commits
- ✅ Frontend test suite runs and passes
- ✅ E2E tests run and pass in CI
- ✅ Type checking passes with zero errors
- ✅ Coverage thresholds met (70% frontend, 80% backend)
- ✅ CI pipeline completes in under 5 minutes
- ✅ Documentation updated with testing guidelines
- ✅ Team trained on new testing tools

## Technical Constraints

- Must work with existing CI/CD pipeline (GitHub Actions)
- Must support Python 3.13 and Node.js 20
- Must work on macOS, Linux, and Windows (CI)
- Must integrate with existing Docker Compose setup
- Must not significantly slow down development workflow
- Must be compatible with existing code formatting tools (Black, ESLint)

## Out of Scope

- Performance/load testing (future enhancement)
- Visual regression testing (future enhancement)
- Mutation testing (future enhancement)
- Security scanning (separate feature)
- API contract testing with external tools (future enhancement)
- Mobile app testing (not applicable)
- Accessibility testing (future enhancement)
