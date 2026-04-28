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
- `npm run format` — format all files with Prettier
- `npm run format:check` — check formatting without writing (CI)

## First-time Setup

After cloning, run this once so `git blame` skips the bulk-formatting commit:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

## Architecture

- **Components** live in `src/components/` with logical subfolders (`common`, `layout`, etc.)
- **Pages** live in `src/pages/` grouped by domain (characters, reference)
- **Hooks** in `src/hooks/` wrap services with React Query — keep data-fetching out of components
- **Services** in `src/services/` handle data access logic (not "repository pattern")
- Keep business logic out of components — put it in services or hooks

## Quality Requirements

- Always include error handling (error boundaries, route error elements, try/catch for async)
- Always implement mobile/responsive support (MUI breakpoints, responsive typography, touch targets)
- Run type-check after multi-file changes and before declaring completion
- When editing files, verify linter did not revert changes by re-reading the file after edits

## Workflow Conventions

- Preserve UI state across navigation where reasonable (e.g., search filters, sort order)
- Follow existing project conventions — reference similar components before creating new ones
- For new features, propose a phased plan via ExitPlanMode before writing code

### Mobile AppBar title

The AppBar shows a context-aware title on mobile (`xs`) using two React Router APIs:

- **`handle: { section: '...' }`** — every route in `src/router.tsx` carries a static section name. `AppLayout` reads these via `useMatches()`. **Any new route must include this property** or the mobile title will be blank.
- **`usePageTitle(title)`** (`src/hooks/usePageTitle.ts`) — detail pages call this hook to set a dynamic breadcrumb (e.g. `"Careers / Slayer"`) once their data loads. It uses Outlet context under the hood. **Two rules:**
  1. Call it unconditionally — before any `if (isLoading)` or `if (!data)` guards (hooks rules).
  2. Pass the section name as the fallback while data is loading: `usePageTitle(data ? \`Section / ${data.object.name}\` : 'Section')`.

List pages need no per-page code — the `handle` on the route is sufficient.

### App-shell scroll pattern

`<Box component="main">` in `AppLayout` uses the **app-shell pattern**: it is fixed-height
(`height: calc(100dvh - APP_BAR_HEIGHT)`) with `overflow: hidden`. The page itself never
scrolls — only explicit inner containers do.

**Rule:** Any page whose content can exceed the viewport height **must** opt in to scrolling
by setting `height: '100%'` and `overflowY: 'auto'` on its root element.

Reference pages are handled automatically by `ReferencePageLayout` (its `#scrollable-container`
list has `flex: 1, overflowY: auto`). All other pages (character sheets, forms, long detail
pages) must manage this themselves.

`APP_BAR_HEIGHT` is exported from `src/components/layout/constants.ts` — use it instead of
hardcoding `64px`.

## State Management

- Use **Zustand** for UI and client-only state
- Use **React Query** for all async/server state and caching
- Do not mix them for the same concern

## TypeScript

- Enable all strict flags — `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` are already on
- Prefer `type` imports (`import type`) for type-only imports
- No `any` — use `unknown` and narrow where needed
- Always run `tsc --noEmit` (or project type-check script) after edits to verify types

## Styling

- Use MUI `sx` prop or theme overrides — no inline `style` props, no CSS modules, no Tailwind
- **Diablo** (`DIABLO_FONT_FAMILY`) — display/heading font, used for h1–h4. Self-hosted from `src/assets/fonts/`.
- **Raleway** (`RALEWAY_FONT_FAMILY`) — secondary font, used for all body text and UI. Loaded from Google Fonts.
- Both constants are exported from `src/theme/theme.ts`
- All spacing, colours, and typography should reference the MUI theme
- Always use `variant="body1"` for body text — never `variant="body2"`
- TypeScript + MUI (Material UI) — prefer MUI components and Material icons over custom/text equivalents

## Testing

See [TESTING.md](./TESTING.md) for the full guide — stack, patterns, examples, and AI agent rules.

- Test runner: Vitest with `globals: true` — no need to import `describe`/`it`/`expect`
- Use React Testing Library; test files go in `__tests__/` folders next to source
- Write tests for non-trivial logic and interactive components — not for trivial wrappers
- Setup file at `src/test/setup.ts` imports `@testing-library/jest-dom` matchers globally

## Conventions

- Prioritise readability and maintainability — write code for the next developer, not just the compiler
- Functional components only — no class components
- PascalCase for components and files, camelCase for everything else
- `export default` for components; named exports for utilities and types
- Avoid magic strings and numbers — use constants or enums
- No direct DOM manipulation — use React patterns
- All code must pass ESLint and Prettier before committing
- Debouncing belongs to the component that owns the input — never debounce a callback in the parent

## General

Before you write any code, confirm your plan includes: (1) route/error boundaries, (2) mobile breakpoints via MUI sx responsive syntax, (3) loading & empty states, (4) TypeScript strict types. Then run through ExitPlanMode.

After all edits, run `npx prettier --write` on every file touched, then run the project's type-check (`npx tsc --noEmit`) and lint (`npm run lint`) commands. Report any errors before marking complete.
