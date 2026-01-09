# ChefStream Constitution

## Core Principles

### I. Gemini-First AI Strategy
We rely on **Google Gemini** models for all AI operations, leveraging its native multimodal capabilities for superior YouTube video transcription and summarization. Prompt engineering must be optimized for Gemini's context window and reasoning style.

### II. Modern Fullstack Architecture
The application MUST adhere to a strict Next.js (Frontend) and FastAPI (Backend) separation. Communication happens over a structured REST API. PostgreSQL is the source of truth for all recipe data.

### III. Production-Ready Scalability
Every feature must be designed with scalability in mind. This includes Dockerization, structured logging, and CI/CD compatibility. **Docker Compose is the non-negotiable standard** for development, testing, and deployment to ensure absolute environment parity.

### IV. Container-Centric Infrastructure (Infrastructure as Truth)
**The containerized environment is the absolute source of truth.** All development and testing MUST occur within the Docker containers. Manual "bare-metal" modifications or environment hacks are strictly forbidden. Dockerfiles and Compose configurations must be updated immediately upon any dependency or system library change.

### V. Strict Testing Discipline (NON-NEGOTIABLE)
- **Backend Quality**: All service logic MUST maintain **>80% code coverage**. All AI extraction features MUST include regression tests (using cached video inputs).
- **Frontend Quality (Browser Validation Required)**: 
  - All UI features MUST be validated in the browser before marking as complete
  - Manual browser testing required for visual elements, interactions, and user flows
  - Automated E2E tests (Playwright/Cypress) required for critical user journeys
  - Screenshots or screen recordings should document feature validation
- **Unit Tests**: Mandatory for all new functions and API endpoints. 
- **Containerized Testing**: All tests MUST pass within the project's official Docker container. Success on the host machine but failure in the container is a REJECTION.
- **Definition of Done**: Work is ONLY finished when all CI tests pass inside the containerized environment, code coverage thresholds are met, and manual browser verification is documented.

### VI. Security First
- **OWASP Compliance**: All code must be reviewed against OWASP Top 10 vulnerabilities (Injection, Auth failures, etc.).
- **Data Safety**: Strict authorization checks on every endpoint. No hardcoded secrets—use environment variables managed via Docker.

### VII. Operational Excellence
- **Structured Logging**: All logs must be structured JSON to enable scalable monitoring.
- **Observability**: Every service must expose a standard health check endpoint, optimized for Docker/Kubernetes liveness and readiness probes.
- **Fail-Safe**: graceful degradation for AI failures (retries, timeouts).

### VIII. Living Documentation
- **Centralized Knowledge**: The `docs/` folder is the project's brain. It MUST be updated *per work* to capture architecture decisions, process improvements, and setup guides.
- **Documentation as Code**: API specs (OpenAPI), ADRs, and User Guides are first-class citizens, committed alongside code.

### IX. Aggressive Modularity
- **Complexity Cap**: Functions SHOULD NOT exceed **50 lines**. Files SHOULD NOT exceed **300 lines**.
- **Refactoring**: If a component breaches these limits, it MUST be refactored into smaller, reusable units immediately.

### X. Premium, Interactive UX
User interfaces must prioritize a "wow" factor, using modern typography, subtle micro-animations, and a highly responsive, interactive step-by-step experience that feels alive and premium.

### XI. Gemini Workflows Integration
All development workflows are managed through `.gemini/` directory. The `.gemini/` directory is the single source of truth for:
- Project constitution and governance
- Workflow definitions and templates
- Command configurations
- Feature specifications and implementation plans

### XII. Branch-Per-Feature Workflow (NON-NEGOTIABLE)
Every feature MUST be developed in a dedicated feature branch following the `###-feature-name` pattern:
- **Branch Creation**: Use `.gemini/scripts/bash/create-new-feature.sh` to create numbered branches (e.g., `001-gemini-extractor`, `002-authentication`)
- **No Direct Commits to Main**: All changes must go through pull requests
- **CI Must Pass (Completion Criterion)**: Work is only considered finished once all CI checks (tests, coverage, linting) pass. Commits with failing CI are "Work In Progress".
- **Feature Isolation**: Each branch contains one complete feature with its spec, plan, and implementation
- **Clean History**: Branches are deleted after successful merge to main

### XIII. Scripting Standards (macOS Compatibility)
All automation scripts (`.sh`) MUST be compatible with **Bash 3.2**, which is the default on macOS. 
- **NO BASH 4.0+ FEATURES**: Avoid `${var^^}` (upper), `${var,,}` (lower), or associative arrays.
- **Portability**: Use `tr`, `awk`, or `sed` for string manipulation to ensure scripts run reliably on developer machines and CI runners alike.

## Governance

### Versioning Policy
This constitution follows Semantic Versioning (SemVer):
- MAJOR: Backward incompatible changes to core principles.
- MINOR: Additions of new principles or major guidance updates.
- PATCH: Formatting, typo fixes, or minor clarifications.

### Amendment Procedure
Changes to this constitution require a dedicated PR, approval from the lead developer, and a summary of impacts on existing templates.

## Sync Impact Report
<!--
Version change: 2.4.0 -> 2.5.0 (MINOR: Added Scripting Standards for macOS)
List of modified principles:
  - [XIII] Added: Bash 3.2 compatibility mandate for macOS/CI portability
CI/CD updates: None
Follow-up TODOs: None
-->

**Version**: 2.5.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-01-09
