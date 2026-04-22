---
description: Review a component against project conventions (MUI, TypeScript, a11y, tests, performance)
---

Review the component at `$ARGUMENTS` against the project conventions in CLAUDE.md and COMPONENT_RULES.md.

Check for:

1. MUI usage and theming consistency — no inline `style` props, no hardcoded colours or spacing, correct font variants
2. Responsive/mobile breakpoints
3. Error handling and edge cases
4. TypeScript strictness — no `any`, proper prop types, validated external data
5. Accessibility — semantic roles, labels, keyboard nav
6. App-shell scroll pattern — if the page content can overflow the viewport, it must opt in to scrolling (`height: '100%'`, `overflowY: 'auto'`)
7. TODO comments in the code
8. Hardcoded magic values that should be constants
9. Unnecessary re-renders or expensive computations
10. Security — user input handling, data fetching error paths
11. If it has routing, navigation and state persistence
12. If it interacts with an API or service, response and error handling
13. Code cleanliness and readability

Then run `tsc --noEmit` and report any type errors.

If the component has associated tests in a `__tests__/` folder, review them against the guidelines in TESTING.md and TESTING_SKILLS.md — check coverage, use of `userEvent` over `fireEvent`, correct provider wrapping, and proper query priority.

Finish with a prioritised list of issues: **blocking** (correctness/a11y/type errors) → **important** (convention violations) → **minor** (style/cleanup).
