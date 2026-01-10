# Frontend Testing Guide

We use **Vitest** + **React Testing Library** for unit and component testing.

## Tech Stack
- **Runner**: Vitest (Jest-compatible, fast)
- **DOM Utilities**: `@testing-library/react`
- **User Simulator**: `@testing-library/user-event`
- **Environment**: `jsdom`

## Running Tests

```bash
cd frontend
npm test                 # Watch mode
npm run test:coverage    # Generate coverage report
npm run test:ui          # UI dashboard
```

## Structure
Tests are located alongside source code in `__tests__` directories or co-located (e.g., `Component.test.tsx`).
- `src/__tests__/`: Integration tests or grouped component tests.
- `src/utils/*.test.ts`: Unit tests for utilities.

## Best Practices

1.  **Test Behavior, Not Implementation**:
    - Use `screen.getByRole`, `screen.getByText` rather than `container.querySelector`.
    - Simulate user clicks with `userEvent.click()`.

2.  **Mocking**:
    - API calls are mocked using `vi.mock('@/lib/api')`.
    - See `src/test-utils/mocks.ts` for reusable mocks.
    - `src/test-utils/render.tsx` provides a custom render function with providers (Auth, QueryClient).

## Coverage Requirement
We enforce a **70%** coverage threshold for lines, functions, branches, and statements. CI will fail if this is not met.
