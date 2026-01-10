# End-to-End Testing Guide

We use **Playwright** for end-to-end testing to verify critical user flows.

## Tech Stack
- **Framework**: Playwright
- **Browser Engine**: Chromium, Firefox, WebKit

## Running Tests

```bash
cd frontend
# Run all E2E tests (headless)
npm run test:e2e
# Run with UI debugger
npm run test:e2e:ui
# Debug specific test
npm run test:e2e:debug
```

## Structure
- `frontend/tests/`: Spec files (e.g., `auth.spec.ts`).
- `frontend/playwright.config.ts`: Configuration.

## Mocking Strategy
Our E2E tests currently mock the backend API to ensure stability and speed.
- Use `page.route('**/api/v1/...')` to intercept requests.
- This allows testing frontend UI logic independent of backend state.
- *Future*: Add true integration E2E tests against a tailored backend seed.

## CI Workflow
- Runs on every PR and Push.
- Uploads traces and screenshots/videos as artifacts on failure.
