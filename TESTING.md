# Testing Guide

## Stack

| Package                         | Role                                                                                                                                                                         |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vitest**                      | Test runner. Reuses `vite.config.ts` — no separate Babel/transform setup needed. Jest-compatible API.                                                                        |
| **happy-dom**                   | Simulates a browser (DOM, `document`, `window`) inside Node.js so React components can be rendered and queried.                                                              |
| **@testing-library/react**      | Renders components and provides query helpers (`getByRole`, `getByText`, etc.). Tests from the user's perspective, not implementation details.                               |
| **@testing-library/jest-dom**   | Adds readable DOM matchers: `toBeInTheDocument()`, `toBeDisabled()`, `toHaveTextContent()`, etc.                                                                             |
| **@testing-library/user-event** | Simulates real user interactions (click, type, keyboard). More accurate than the basic `fireEvent` — fires focus, pointer, and keyboard events in the correct browser order. |

> **Why happy-dom and not jsdom?** `jsdom@27` introduced ESM-only CSS dependencies that break in Vitest's worker process. `happy-dom` is faster and has no ESM compatibility issues.

---

## Commands

```bash
npm test          # run in watch mode (re-runs on file save)
npm run test:ui   # open the Vitest browser UI
npx vitest run    # single run, no watch (good for CI)
```

---

## File Structure

Test files live in `__tests__/` folders **next to the source they test**:

```
src/
  components/
    common/
      PrimaryButton.tsx
      __tests__/
        PrimaryButton.test.tsx   ← tests for PrimaryButton
  hooks/
    useSkills.ts
    __tests__/
      useSkills.test.ts
```

Vitest automatically finds any file matching `**/*.{test,spec}.{ts,tsx}`.

---

## What to Test

**Do test:**

- Interactive components (render, user events, accessibility attributes)
- Hooks with non-trivial logic (data transformation, derived state)
- Service/utility functions with conditional logic or edge cases

**Don't test:**

- Simple wrappers that just forward props (no logic = no test value)
- MUI internals or third-party library behaviour
- Implementation details (internal state, private methods)

---

## Key Patterns

### Querying the DOM

Always prefer `getByRole` — it targets elements the same way a screen reader would, which doubles as an accessibility check:

```tsx
// Good — tests what the user and screen reader see
screen.getByRole('button', { name: 'Save' });
screen.getByRole('heading', { name: 'Character Sheet' });
screen.getByRole('textbox', { name: 'Character Name' });

// Avoid — couples tests to implementation details
screen.getByTestId('save-button');
screen.getByClassName('MuiButton-root');
```

### Simulating User Interactions

Use `userEvent` over `fireEvent` for interactions — it fires the full event sequence a real browser would:

```tsx
it('calls onClick when clicked', async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();

  render(<PrimaryButton onClick={handleClick}>Save</PrimaryButton>);
  await user.click(screen.getByRole('button', { name: 'Save' }));

  expect(handleClick).toHaveBeenCalledOnce();
});
```

### Mock Functions

`vi.fn()` creates a mock function you can assert against:

```tsx
const handleClick = vi.fn();

expect(handleClick).toHaveBeenCalledOnce();
expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
expect(handleClick).not.toHaveBeenCalled();
```

### Testing Disabled State

MUI applies `pointer-events: none` to disabled buttons. `userEvent` correctly refuses to click them (matching real browser behaviour), so test the disabled _attribute_ rather than trying to click:

```tsx
// Correct
it('is disabled when the disabled prop is passed', () => {
  render(<PrimaryButton disabled>Save</PrimaryButton>);
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
});

// Will throw — userEvent refuses to interact with pointer-events: none
await user.click(screen.getByRole('button', { name: 'Save' })); // ❌
```

### Globals

`describe`, `it`, `expect`, and `vi` are available globally — no imports needed. This is configured via `globals: true` in `vite.config.ts`.

---

## Setup File

`src/test/setup.ts` runs before every test file. Currently it imports `@testing-library/jest-dom` to register the custom matchers globally. Add any other global test setup here (e.g. mocking `window.matchMedia`, resetting Zustand stores).

---

## AI Agent Rules

- Always place test files in `__tests__/` next to the source file.
- Use `getByRole` as the primary query. Fall back to `getByLabelText`, then `getByText`. Only use `getByTestId` as a last resort.
- Use `userEvent.setup()` + `await user.click/type()` for interactions — not `fireEvent`.
- Use `vi.fn()` for mock functions — not `jest.fn()`.
- Do not mock MUI components or React Router — render the real thing.
- Do not assert on class names, `data-*` attributes, or computed CSS — assert on roles, labels, text, and ARIA state.
- For disabled elements, assert `toBeDisabled()` — do not attempt to click them with `userEvent`.
- Tests must pass `npx vitest run` with exit code 0 before a task is considered complete.
