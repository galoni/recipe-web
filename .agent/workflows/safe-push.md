---
description: Perform a safe push by running all required checks and formatting
---

# Safe Push Workflow

This workflow ensures your code meets the quality bar (formatting, linting, and tests) before pushing to origin. This prevents CI failures on the pull request.

## // turbo-all
1. **Format Backend Code**
   `cd backend && python3 -m black .`

2. **Run Backend Tests**
   `cd backend && poetry run pytest --cov=app --cov-fail-under=75`

3. **Check Frontend Linting**
   `cd frontend && npm run lint`

4. **Run Frontend Type Check**
   `cd frontend && npx tsc --noEmit`

5. **Commit and Push**
   `git add . && git commit -m "Update from safe-push workflow" && git push`

---
*Note: Ensure your GEMINI_API_KEY is configured in `backend/.env` for any live tests.*
