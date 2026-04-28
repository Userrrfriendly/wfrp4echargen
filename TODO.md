//TODOs

1. Start using commands (Skills?)
2. Try out test driven development
3. TESTING.MD TESTING_SKILLS.md and the testing.md it's a mess clean it up!
4. https://youtu.be/v4F1gFy-hqg?si=8q8f6xWrvdB5dmQm

---- Active ----
-in the career Details on mobile probably the whole content should be scrollable (otherwise there is little room because the class/races and description are always on)

---

- REACT THREE FIBER FOR DICE ROLLER!!! WOW
- Create a Character
- Character Sheet
-

MOBILE:

RULES:

# KLANKER Things

## Commands:

Built In Commands:
/insights
/review — the built-in PR review (reads the git diff on the current branch)

Custom Commands:
/review-component src/components/Foo.tsx — your project-specific component review
/testing — loads the Vitest/RTL skill as context before writing tests

Ask Claude: "Use parallel agents: one to add alphabetical sorting, one to add the source filter, and one to add page-number display. Then integrate and type-check."

This is a multi-file feature. Enter plan mode first: list every file to create/modify, the types/interfaces involved, error and loading states, and responsive behavior. Only exit plan mode after I approve.

### Parallel Agents for Feature Verticals:

Use the Task tool with multiple concurrent Agent invocations in a single message, each with a specialized system prompt (UI, a11y, responsive, error-handling). Add a CLAUDE.md checklist enforcing these dimensions as non-negotiable sub-agents.

I want to add a new feature: [DESCRIBE FEATURE]. Launch 4 parallel sub-agents via the Task tool simultaneously: (1) Implementation Agent - builds the component and wires it into the app, (2) Responsive Agent - ensures mobile/tablet breakpoints work with MUI's sx/useMediaQuery, (3) Error Handling Agent - adds error boundaries, loading states, and routing fallbacks, (4) Review Agent - audits against project conventions in CLAUDE.md and runs the type-checker. After all agents complete, reconcile conflicts, then show me a unified diff with a checklist confirming each dimension was addressed. Do not mark the task complete until all 4 agents report green.

### Test-Driven UI Component Generation:

I want to build [COMPONENT NAME] using test-driven development. Follow this strict loop autonomously without asking me between steps: (1) Write a Vitest spec file covering: render, user interactions, edge cases, accessibility (role queries), and responsive behavior using @testing-library/react. (2) Run `npx vitest run [spec-file]` - confirm all tests fail for the right reasons. (3) Implement the component minimally. (4) Run tests. (5) If failing, iterate implementation only (not tests) until green. (6) Refactor for MUI theming consistency and re-run. (7) Commit with a conventional commit message. Report back only when tests are green and code is committed. Start with the reusable PDF download button component.
