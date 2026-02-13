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

## Run Subsets by Folder

```bash
# Admin portal specs
pnpm run cypress:run --spec "cypress/e2e/AdminPortal/**/*.cy.ts"

# User portal specs
pnpm run cypress:run --spec "cypress/e2e/UserPortal/**/*.cy.ts"

# Authentication specs
pnpm run cypress:run --spec "cypress/e2e/Auth/**/*.cy.ts"

# Shared component and utility specs
pnpm run cypress:run --spec "cypress/e2e/SharedComponents/**/*.cy.ts"
```

## Additional Guide

- Online docs: <https://docs-admin.talawa.io/docs/developer-resources/e2e-testing>
- Local docs: `docs/docs/docs/developer-resources/e2e-testing.md`

For fixture library structure, GraphQL mocking examples, and mock isolation
guidance, refer to the E2E guide above.
