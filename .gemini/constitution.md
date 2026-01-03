# ChefStream Constitution

## Core Principles

### I. Gemini-First AI Strategy
We rely on **Google Gemini** models for all AI operations, leveraging its native multimodal capabilities for superior YouTube video transcription and summarization. Prompt engineering must be optimized for Gemini's context window and reasoning style.

### II. Modern Fullstack Architecture
The application MUST adhere to a strict Next.js (Frontend) and FastAPI (Backend) separation. Communication happens over a structured REST API. PostgreSQL is the source of truth for all recipe data.

### III. Production-Ready Scalability
Every feature must be designed with scalability in mind. This includes Dockerization, structured logging, and CI/CD compatibility. Infrastructure as Code (Docker Compose) is the standard for development and deployment.

### IV. Infrastructure as Truth
**Dockerfiles are the absolute source of truth** for the environment. They must be kept up-to-date with every dependency or system library change. Manual environment hacks are forbidden.

### V. Strict Testing Discipline (NON-NEGOTIABLE)
- **Backend Quality**: All service logic MUST maintain **>80% code coverage**. All AI extraction features MUST include regression tests (using cached video inputs).
- **Frontend Quality (Browser Validation Required)**: 
  - All UI features MUST be validated in the browser before marking as complete
  - Manual browser testing required for visual elements, interactions, and user flows
  - Automated E2E tests (Playwright/Cypress) required for critical user journeys
  - Screenshots or screen recordings should document feature validation
- **Unit Tests**: Mandatory for all new functions and API endpoints.

### VI. Security First
- **OWASP Compliance**: All code must be reviewed against OWASP Top 10 vulnerabilities (Injection, Auth failures, etc.).
- **Data Safety**: Strict authorization checks on every endpoint. No hardcoded secrets—use environment variables managed via Docker.

### VII. Operational Excellence
- **Structured Logging**: All logs must be structured JSON to enable scalable monitoring.
- **Observability**: Every service must expose a standard health check endpoint.
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
- **CI Must Pass**: All CI checks (tests, coverage, linting) must pass before merging
- **Feature Isolation**: Each branch contains one complete feature with its spec, plan, and implementation
- **Clean History**: Branches are deleted after successful merge to main

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
Version change: 2.1.0 -> 2.2.0 (MINOR: Added Branch-Per-Feature Workflow)
List of modified principles:
  - [XI] Updated: Removed spec-kit submodule reference
  - [XII] Added: Branch-Per-Feature Workflow (NON-NEGOTIABLE)
CI/CD updates:
  - Updated CI coverage threshold from 75% to 80%
  - Changed linter from black to ruff for consistency
Follow-up TODOs: None
-->

**Version**: 2.2.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-01-03
