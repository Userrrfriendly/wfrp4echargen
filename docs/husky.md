# Plan: Add Husky Pre-commit Hooks

## Context

The project has ESLint and Prettier configured but no enforcement at commit time. A developer without "format on save" could commit unformatted code, ESLint warnings can accumulate, and broken tests can be committed. Husky pre-commit hooks solve all three by blocking commits that don't meet quality standards.

---

## My Input on the Approach

**Does it bring value? Yes, all three checks do — with one nuance on tests.**

| Check              | Value      | Notes                                                                                                                        |
| ------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Prettier on commit | High       | Prevents format-noise commits polluting `git blame`, guarantees consistency for every contributor                            |
| ESLint on commit   | High       | Catches errors before they're in history; especially valuable with the project's strict TypeScript flags                     |
| Tests on commit    | High _now_ | At ~900ms the suite is negligible friction. As the suite grows (minutes), consider moving tests to a `pre-push` hook instead |

**Is this best practice? Yes.** Husky + lint-staged is the industry standard for JS/TS projects. The one refinement worth making: use **lint-staged** alongside Husky so Prettier and ESLint only run on _staged files_, not the whole project. This keeps the hook fast as the codebase grows and means you're only checking what's actually about to be committed.

**One thing to be aware of:** ESLint with `--max-warnings=0` means even warnings block the commit. This matches the project's strict TypeScript config and is the right call, but worth knowing — if a warning creeps in it will block everyone until fixed.

---

## Implementation Plan

### Packages to install

```
npm install --save-dev husky lint-staged prettier
```

Note: `prettier` needs to be an explicit devDependency (currently just configured via `.prettierrc` but not installed).

### Step 1 — Initialise Husky

```
npx husky init
```

This creates `.husky/pre-commit` and adds `"prepare": "husky"` to package.json scripts. The `prepare` script means any new contributor who runs `npm install` gets the hook automatically — no manual setup.

### Step 2 — `.husky/pre-commit` content

```sh
npx lint-staged
npx vitest run
```

- `lint-staged` — runs Prettier then ESLint on staged files only, re-stages any files Prettier modifies
- `vitest run` — single-pass test run (not watch mode); exits non-zero on failure

### Step 3 — lint-staged config (in `package.json`)

```json
"lint-staged": {
  "**/*.{ts,tsx}": [
    "prettier --write",
    "eslint --max-warnings=0"
  ],
  "**/*.{json,md,css,html}": [
    "prettier --write"
  ]
}
```

Prettier runs first (formats + re-stages), ESLint checks the formatted output second. ESLint is only applied to `.ts/.tsx` since that's what the project's `eslint.config.js` targets.

### Step 4 — New npm scripts in `package.json`

```json
"prepare": "husky",
"format": "prettier --write .",
"format:check": "prettier --check ."
```

- `format` — bulk-format the whole project (useful for the initial pass)
- `format:check` — CI-friendly dry-run check

### Step 5 — Run initial Prettier pass

Before committing the hook setup, format the whole codebase once to avoid spurious diffs on the first real commit:

```
npm run format
```

Commit this separately as `style: apply initial Prettier formatting`.

### Step 6 — Update CLAUDE.md commands section

Add `npm run format` and `npm run format:check` to the Commands section.

---

## Files Changed

| File                | Action                                                   |
| ------------------- | -------------------------------------------------------- |
| `package.json`      | Add devDependencies, scripts, lint-staged config         |
| `.husky/pre-commit` | Created by husky init, then overwritten with 2-line hook |
| `CLAUDE.md`         | Add format commands                                      |

---

## Verification

1. `npm install` — installs husky/lint-staged/prettier, triggers `prepare` which installs the git hook
2. Modify a `.tsx` file with a formatting issue → `git commit` → Prettier should auto-fix it and commit should succeed
3. Introduce an ESLint error → `git commit` → commit should be blocked with ESLint output
4. Break a test → `git commit` → commit should be blocked with Vitest output
5. `git commit --no-verify` — confirms the escape hatch works when needed
