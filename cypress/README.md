# Cypress End-to-End Testing

The canonical E2E spec layout is portal-based under `cypress/e2e/`:

- `Auth/`
- `AdminPortal/`
- `UserPortal/`
- `SharedComponents/`
- `E2EFlows/`
- `ErrorScenarios/`
- `CascadingEffects/`
- `MultiOrganization/`
- `Accessibility/`

## Run Cypress

```bash
# Interactive mode (recommended for local debugging)
pnpm run cy:open

# Headless run for all E2E specs
pnpm run cy:run
```

## Current E2E Defaults

- `specPattern`: `cypress/e2e/**/*.cy.ts`
- `testIsolation`: `true`
- `retries`: `runMode: 2`, `openMode: 0`
- `defaultCommandTimeout`: `30000`
- `requestTimeout`, `responseTimeout`, `pageLoadTimeout`: `30000`

## Run Subsets by Folder

```bash
# Admin portal specs
pnpm run cy:run:admin

# User portal specs
pnpm run cy:run:user

# Authentication specs
pnpm run cy:run:auth

# Shared component and utility specs
pnpm run cy:run:shared
```

For a single spec file, run `pnpm run cy:open` and select the spec in the
interactive runner.

## Additional Guide

- Online docs: <https://docs-admin.talawa.io/docs/developer-resources/e2e-testing>
- Local docs: `docs/docs/docs/developer-resources/e2e-testing.md`

For fixture library structure, GraphQL mocking examples, and mock isolation
guidance, refer to the E2E guide above.
