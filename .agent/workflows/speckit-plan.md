---
description: Create a technical implementation plan for the current feature
---

1. Execute the setup script to copy the template:
   ```bash
   .specify/scripts/bash/setup-plan.sh "$SPECIFY_FEATURE"
   ```
2. Read the newly created `specs/$SPECIFY_FEATURE/plan.md`.
3. Read the `specs/$SPECIFY_FEATURE/spec.md` to understand requirements.
4. Read `.specify/memory/constitution.md` to ensure compliance.
5. **Fill in the plan.md file**. ensure you replace all placeholders.
   - Cross-reference the "Constitution Check" section.
   - Define the project structure.
   - Add security and operations context.
6. Notify the user to review the plan.
