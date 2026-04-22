---
description: >
  Write tests for a React + Vite + TypeScript project using Vitest and React Testing Library.
  Use this skill whenever the user wants to write, generate, fix, or improve any kind of test —
  unit tests for pure functions or hooks, component tests with RTL, integration tests spanning
  multiple components, or tests involving Zustand stores, React Query, react-hook-form, or MUI.
  Also trigger when the user says things like "add tests", "write a test for X", "how do I test Y",
  "my test is failing", or "mock this". Always use this skill before writing any test code.
---

# Vitest + React Testing Library Skill

## Stack

| Tool                          | Purpose             |
| ----------------------------- | ------------------- |
| `vitest`                      | Test runner (v4+)   |
| `@testing-library/react`      | Component rendering |
| `@testing-library/user-event` | User interactions   |
| `@testing-library/jest-dom`   | DOM matchers        |
| `happy-dom` / `jsdom`         | DOM environment     |
| `zustand`                     | State management    |
| `@tanstack/react-query`       | Server state        |
| `react-hook-form`             | Form state          |
| `@mui/material`               | UI components       |

---

## Project Conventions

- Test files live in `__tests__/` folders co-located with the source they test
- Test files are named `<SourceFile>.test.ts` or `<SourceFile>.test.tsx`
- Use `.test.ts` for pure logic, `.test.tsx` for anything that renders JSX

```
src/
  components/
    CharacterForm/
      CharacterForm.tsx
      __tests__/
        CharacterForm.test.tsx
  utils/
    diceRoller.ts
    __tests__/
      diceRoller.test.ts
```

---

## Vitest Config Reference

If no `vitest.config.ts` exists yet, here's a recommended baseline:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom', // or 'jsdom'
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom';
```

---

## Test Anatomy (Arrange-Act-Assert)

Always structure tests as:

```ts
it('should do X when Y', () => {
  // Arrange — set up state, render component, prepare inputs
  // Act — trigger the behaviour
  // Assert — check the result
});
```

---

## 1. Unit Tests — Pure Functions & Utils

```ts
// src/utils/__tests__/diceRoller.test.ts
import { describe, it, expect } from 'vitest';
import { rollDice } from '../diceRoller';

describe('rollDice', () => {
  it('returns a number within the expected range', () => {
    const result = rollDice(10);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
  });

  it('throws when sides is 0 or negative', () => {
    expect(() => rollDice(0)).toThrow();
  });
});
```

---

## 2. Custom Hook Tests

Use `renderHook` from `@testing-library/react`:

```ts
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../useCounter';

it('increments the count', () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});
```

For hooks that need providers (React Query, Zustand, Router), wrap them — see section 5.

---

## 3. Component Tests (RTL)

### Rendering & querying

Prefer queries in this order (most accessible → least):

1. `getByRole` — buttons, inputs, headings, etc.
2. `getByLabelText` — form inputs
3. `getByText` — visible text
4. `getByTestId` — last resort, add `data-testid` to element

```tsx
import { render, screen } from '@testing-library/react';
import { CharacterCard } from '../CharacterCard';

it('displays the character name', () => {
  render(<CharacterCard name="Alaric" career="Soldier" />);
  expect(screen.getByRole('heading', { name: /alaric/i })).toBeInTheDocument();
});
```

### User interactions

Always use `userEvent` over `fireEvent` — it simulates real browser behaviour:

```tsx
import userEvent from '@testing-library/user-event';

it('calls onSubmit with the entered name', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<NameInput onSubmit={onSubmit} />);
  await user.type(screen.getByLabelText(/character name/i), 'Alaric');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(onSubmit).toHaveBeenCalledWith('Alaric');
});
```

### Async rendering

Use `findBy*` (returns a promise) when content appears asynchronously:

```tsx
expect(await screen.findByText(/loaded/i)).toBeInTheDocument();
```

Or `waitFor` for non-element assertions:

```tsx
await waitFor(() => expect(mockFn).toHaveBeenCalled());
```

---

## 4. MUI Component Testing

MUI renders accessible HTML — query by role/label, not by MUI class names.

```tsx
// TextField → query by label
screen.getByLabelText(/character name/i);

// Button → query by role
screen.getByRole('button', { name: /save/i });

// Select → open it, then pick an option
await user.click(screen.getByRole('combobox', { name: /career/i }));
await user.click(screen.getByRole('option', { name: /soldier/i }));

// Checkbox
await user.click(screen.getByRole('checkbox', { name: /veteran/i }));
expect(screen.getByRole('checkbox', { name: /veteran/i })).toBeChecked();
```

**Avoid** querying `.MuiButton-root` or other CSS classes — they break on upgrades.

---

## 5. Provider Wrappers

Create a reusable `renderWithProviders` utility for tests that need routing, React Query, or Zustand:

```tsx
// src/test/renderWithProviders.tsx
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ReactNode } from 'react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

interface Options extends RenderOptions {
  initialRoute?: string;
}

export function renderWithProviders(
  ui: ReactNode,
  { initialRoute = '/', ...options }: Options = {},
) {
  const queryClient = makeQueryClient();
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>,
    options,
  );
}
```

Usage:

```tsx
renderWithProviders(<CharacterPage />, { initialRoute: '/characters/1' });
```

---

## 6. React Query Testing

Disable retries in the test QueryClient (already in the wrapper above).

### Testing loading / error / success states

```tsx
it('shows a loading spinner initially', () => {
  renderWithProviders(<CharacterList />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

it('renders characters after fetch', async () => {
  renderWithProviders(<CharacterList />);
  expect(await screen.findByText(/alaric/i)).toBeInTheDocument();
});
```

### Mocking fetch / API calls

Use `vi.mock` to stub the API layer:

```ts
vi.mock('../../api/characters', () => ({
  fetchCharacters: vi
    .fn()
    .mockResolvedValue([{ id: '1', name: 'Alaric', career: 'Soldier' }]),
}));
```

Or use `msw` (Mock Service Worker) for more realistic HTTP mocking at the network level — recommended for integration tests.

---

## 7. Zustand Store Testing

### Option A — test the store directly

```ts
import { useCharacterStore } from '../characterStore';

it('adds a character to the store', () => {
  const { addCharacter, characters } = useCharacterStore.getState();
  addCharacter({ id: '1', name: 'Alaric' });
  expect(useCharacterStore.getState().characters).toHaveLength(1);
});

afterEach(() => useCharacterStore.setState({ characters: [] })); // reset between tests
```

### Option B — test a component that reads from the store

Just render the component normally. Zustand doesn't need a Provider.
Seed the store state before rendering:

```tsx
beforeEach(() => {
  useCharacterStore.setState({ characters: [{ id: '1', name: 'Alaric' }] });
});

it('displays store characters', () => {
  render(<CharacterList />);
  expect(screen.getByText(/alaric/i)).toBeInTheDocument();
});
```

---

## 8. react-hook-form Testing

RHF forms submit only when validation passes. Always use `userEvent` to fill fields.

```tsx
it('submits valid form data', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<CharacterForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText(/name/i), 'Alaric');
  await user.click(screen.getByRole('button', { name: /create/i }));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Alaric' }),
    ),
  );
});

it('shows validation error for empty name', async () => {
  const user = userEvent.setup();
  render(<CharacterForm onSubmit={vi.fn()} />);

  await user.click(screen.getByRole('button', { name: /create/i }));

  expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
});
```

---

## 9. Mocking

### Module mock

```ts
vi.mock('../someModule', () => ({
  someFunction: vi.fn().mockReturnValue('mocked'),
}));
```

### Spy on a method

```ts
const spy = vi.spyOn(someObject, 'method').mockReturnValue('mocked');
expect(spy).toHaveBeenCalled();
```

### Mock timers

```ts
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
vi.useRealTimers();
```

### Reset mocks between tests

Add to `vitest.config.ts`:

```ts
test: {
  clearMocks: true,   // clears call history
  resetMocks: true,   // resets implementations too
}
```

---

## 10. Integration Tests

Integration tests render a larger slice of the app (e.g. a full page with routing + store + queries). Use `renderWithProviders`, seed the store and/or mock the API, then assert end-to-end user flows:

```tsx
it('user can create and see a new character', async () => {
  const user = userEvent.setup();
  renderWithProviders(<App />, { initialRoute: '/characters/new' });

  await user.type(screen.getByLabelText(/name/i), 'Alaric');
  await user.click(screen.getByRole('button', { name: /create/i }));

  // After submit, app redirects to list
  expect(await screen.findByText(/alaric/i)).toBeInTheDocument();
});
```

Keep integration tests focused on critical user flows. Unit tests cover edge cases.

---

## Quick Reference — Common Matchers

```ts
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeDisabled();
expect(element).toHaveValue('some text');
expect(element).toHaveTextContent(/pattern/i);
expect(element).toBeChecked();
expect(mockFn).toHaveBeenCalledWith(expect.objectContaining({ key: 'value' }));
expect(mockFn).toHaveBeenCalledTimes(1);
```

---

## Running Tests

```bash
npx vitest              # watch mode
npx vitest run          # single run (CI)
npx vitest --ui         # browser UI
npx vitest run --coverage  # with coverage
```
