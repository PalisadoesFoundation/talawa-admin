# ESLint configuration

This directory contains the modular ESLint configuration used by the repo.
The entrypoint is `eslint.config.js` in the project root, which composes the
modules below.

## Structure

- `config/base.ts`
  - Base TypeScript/React config.
  - Registers core plugins and applies shared rules.
  - Applies `no-restricted-imports` and `no-restricted-syntax` using rules from
    `scripts/eslint/rules`.
- `config/exemptions.ts`
  - Factory for wrapper exemptions and the registry of allowed wrapper imports.
  - Add new wrapper exemptions here.
- `config/cypress.ts`
  - Cypress-specific globals and rules.
- `config/tests.ts`
  - Test-file rules including the custom Vitest isolation plugin.
- `config/special.ts`
  - GraphQL rules, config-file rules, and search input exemptions.
- `rules/`
  - Shared rule definitions and helpers used by the config modules.
- `plugins/eslint-plugin-vitest-isolation/`
  - Custom ESLint plugin enforcing Vitest mock cleanup.

## Adding a new wrapper exemption

1. Add the restricted import definition in `scripts/eslint/rules/imports.ts`.
2. Add an exemption entry in `scripts/eslint/config/exemptions.ts` using
   `createWrapperExemption` (or a custom object for special cases).
3. Update relevant documentation under `docs/` if needed.

## Validation

Run lint checks with:

```
pnpm run lint:check
```
