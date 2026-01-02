# Standard Development Workflow (Spec-Kit)

We follow the [Spec-Kit](https://github.com/github/spec-kit) methodology for all feature development. This ensures consistency, quality, and adherence to our project constitution.

## The Workflow

1.  **Establish Principles**: (Done once/updated rarely)
    *   Command: `/speckit.constitution` (or manual edit of `.specify/memory/constitution.md`)
    *   Purpose: Define the "Rules of the Road" (Security, Testing, Infra).

2.  **Create Feature Branch**:
    *   Command: `.specify/scripts/bash/create-new-feature.sh "Feature Name"`
    *   Purpose: Creates branch `###-feature-name` and `specs/###-feature-name/` directory.

3.  **Create Specification**:
    *   Edit: `specs/###-feature-name/spec.md`
    *   Purpose: Define *User Stories*, *Requirements*, and *Success Criteria*.
    *   **Gate**: Must differentiate "Independent Tests (Automated)" and "Manual Validation".

4.  **Create Implementation Plan**:
    *   Command: `.specify/scripts/bash/setup-plan.sh "Feature Name"`
    *   Edit: `specs/###-feature-name/plan.md`
    *   Purpose: Define Architecture, Dependencies, Data Models, and perform **Constitution Checks**.

5.  **Task Breakdown**:
    *   Command: `/speckit.tasks` (or manual creation based on template)
    *   Edit: `specs/###-feature-name/tasks.md`
    *   Purpose: Break plan into granular, independent tasks grouped by User Story.

6.  **Implement**:
    *   Execute tasks in `tasks.md` sequentially.
    *   Update `docs/` as part of the work ("Living Documentation").

## Scripts Reference

*   `create-new-feature.sh`: Scaffolds branch and spec file.
*   `setup-plan.sh`: Scaffolds plan file from template.
*   `check-prerequisites.sh`: Verifies repo state.

> **Always** run these scripts rather than creating files manually to ensure naming consistency and path validity.
