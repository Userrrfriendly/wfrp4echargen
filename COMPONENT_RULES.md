// Project-wide rules for AI-generated and human code
// Place in project root and keep updated as conventions evolve

/\*\*

- COMPONENT RULES
- - All components must be in src/components/ with logical subfolders (e.g., common, inputs, layout).
- - Use PascalCase for component and file names.
- - Use TypeScript for all components and props.
- - Prefer functional components and hooks.
- - Use MUI for styling; use sx/theme, not inline styles.
- - Each component must have JSDoc and a usage example (in code comments or a Markdown file).
- - Export default unless multiple exports are needed.
- - Write unit tests for non-trivial logic in **tests**/ folders using React Testing Library.
- - All interactive components must be accessible (ARIA attributes, keyboard navigation).
- - Use only approved dependencies (MUI for UI, no jQuery or unapproved libraries).
- - Group related components in logical subfolders for discoverability.
-
- AI-GENERATED CODE RULES
- - All AI agents (Claude, Copilot, Cursor, etc.) must read and follow these rules before generating code.
- - No direct DOM manipulation—use React patterns.
- - Avoid magic numbers/strings; use constants/enums.
- - All code must pass ESLint and Prettier.
- - Document all reusable code.
- - If unsure about a convention, ask for clarification or add a TODO comment.
- - All new components must be reviewed for rule compliance.
    \*/
