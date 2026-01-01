# ChefStream Constitution

## Core Principles

### I. Gemini-First AI Strategy
We rely on **Google Gemini** models for all AI operations, leveraging its native multimodal capabilities for superior YouTube video transcription and summarization. Prompt engineering must be optimized for Gemini's context window and reasoning style.

### II. Modern Fullstack Architecture
The application MUST adhere to a strict Next.js (Frontend) and FastAPI (Backend) separation. Communication happens over a structured REST API. PostgreSQL is the source of truth for all recipe data.

### III. Production-Ready Scalability
Every feature must be designed with scalability in mind. This includes Dockerization, structured logging, and CI/CD compatibility. Infrastructure as Code (Docker Compose) is the standard for development and deployment.

### IV. Strict Testing Discipline (NON-NEGOTIABLE)
- **Coverage**: Backend service logic MUST maintain **>80% code coverage**.
- **Regression**: All AI extraction features MUST include regression tests (using cached video inputs) to verify output consistency.
- **Unit Tests**: Mandatory for all new functions and API endpoints.

### V. Aggressive Modularity
- **Complexity Cap**: Functions SHOULD NOT exceed **50 lines**. Files SHOULD NOT exceed **300 lines**.
- **Refactoring**: If a component breaches these limits, it MUST be refactored into smaller, reusable units immediately.

### VI. Premium, Interactive UX
User interfaces must prioritize a "wow" factor, using modern typography, subtle micro-animations, and a highly responsive, interactive step-by-step experience that feels alive and premium.

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
Version change: 1.0.0 -> 1.1.0 (MINOR: Added strict limits and model strategy)
List of modified principles:
  - [I] AI-First Extraction -> Gemini-First AI Strategy
  - [IV] Testing & Quality Discipline -> Strict Testing Discipline (Added 80% coverage + Regression)
  - [V] Added: Aggressive Modularity (50/300 line limits)
Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated)
Follow-up TODOs: None
-->

**Version**: 1.1.0 | **Ratified**: 2026-01-01 | **Last Amended**: 2026-01-01
