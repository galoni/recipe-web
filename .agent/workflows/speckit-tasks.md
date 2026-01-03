---
description: Generate comprehensive task list from the implementation plan
---

1. Read the `specs/$SPECIFY_FEATURE/plan.md` (Implementation Plan).
2. Read the `specs/$SPECIFY_FEATURE/spec.md` (Specification).
3. Read `.gemini/templates/tasks-template.md` (Template).
4. Create `specs/$SPECIFY_FEATURE/tasks.md` by applying the template to the plan.
   - Group tasks by **User Story**.
   - Include **Phase 1: Setup** and **Phase 2: Foundational** tasks.
   - Include **Security Review** and **Docs Update** tasks as per Constitution.
   - Ensure every task has a clear "Definition of Done".
5. Notify the user to review the tasks.
