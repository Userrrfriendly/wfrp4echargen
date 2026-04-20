# CLAUDE.md — Project Rules & Context

## Project

Warhammer Fantasy Roleplay 4e character generator. A React web app for creating and managing WFRP4e character sheets, with reference pages for careers, skills, talents, spells, prayers, and trappings.

See [COMPONENT_RULES.md](./COMPONENT_RULES.md) for component-specific conventions.

## Stack

- **Framework**: React 19 + TypeScript + Vite
- **UI**: MUI v9 with custom theme (`src/theme/theme.ts`)
- **Routing**: React Router v7
- **Client state**: Zustand
- **Server/async state**: TanStack React Query
- **Forms**: react-hook-form
- **Testing**: Vitest + React Testing Library (happy-dom)

## Commands

- `npm run dev` — start dev server
- `npm test` — run tests in watch mode
- `npm run build` — type-check and build
- `npm run lint` — lint with ESLint

## Architecture

- **Components** live in `src/components/` with logical subfolders (`common`, `layout`, etc.)
- **Pages** live in `src/pages/` grouped by domain (characters, reference)
- **Hooks** in `src/hooks/` wrap services with React Query — keep data-fetching out of components
- **Services** in `src/services/` handle data access logic (not "repository pattern")
- Keep business logic out of components — put it in services or hooks

## State Management

- Use **Zustand** for UI and client-only state
- Use **React Query** for all async/server state and caching
- Do not mix them for the same concern

## TypeScript

- Enable all strict flags — `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` are already on
- Prefer `type` imports (`import type`) for type-only imports
- No `any` — use `unknown` and narrow where needed

## Styling

- Use MUI `sx` prop or theme overrides — no inline `style` props, no CSS modules, no Tailwind
- **Diablo** (`DIABLO_FONT_FAMILY`) — display/heading font, used for h1–h4. Self-hosted from `src/assets/fonts/`.
- **Raleway** (`RALEWAY_FONT_FAMILY`) — secondary font, used for all body text and UI. Loaded from Google Fonts.
- Both constants are exported from `src/theme/theme.ts`
- All spacing, colours, and typography should reference the MUI theme
- Always use `variant="body1"` for body text — never `variant="body2"`

## Testing

See [TESTING.md](./TESTING.md) for the full guide — stack, patterns, examples, and AI agent rules.

- Test runner: Vitest with `globals: true` — no need to import `describe`/`it`/`expect`
- Use React Testing Library; test files go in `__tests__/` folders next to source
- Write tests for non-trivial logic and interactive components — not for trivial wrappers
- Setup file at `src/test/setup.ts` imports `@testing-library/jest-dom` matchers globally

## Conventions

- Functional components only — no class components
- PascalCase for components and files, camelCase for everything else
- `export default` for components; named exports for utilities and types
- Avoid magic strings and numbers — use constants or enums
- No direct DOM manipulation — use React patterns
- All code must pass ESLint and Prettier before committing
