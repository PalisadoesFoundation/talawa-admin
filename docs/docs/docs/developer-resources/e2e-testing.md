---
id: e2e-testing
title: End to End Testing
slug: /developer-resources/e2e-testing
sidebar_position: 70
---

This project uses Cypress for comprehensive end-to-end testing to ensure the application works correctly from a user's perspective.

## Prerequisites

Before running Cypress tests, ensure you have the following setup:

### Talawa API Setup

1. **Important**: The [Talawa API](https://github.com/PalisadoesFoundation/talawa-api) must be properly installed, configured, and running before executing any Cypress tests. The tests depend on API endpoints being available and functional.
2. Please follow the complete installation guide at: https://github.com/PalisadoesFoundation/talawa-api/blob/develop/INSTALLATION.md

### Application Server
Ensure your local development server is running on `http://localhost:4321`.

## Directory Structure

The tests follow the Page Object Model pattern for maintainability.

```
cypress/
├── e2e/                    # End-to-end test specifications
│   └── example_spec/       # Related tests
├── fixtures/               # Test data and mock files
│   └── users.json         # User test data
├── pageObjects/           # Page Object Model files
│   └── auth/              # Authentication page objects
└── support/               # Support files and custom commands
    └── commands.ts        # Custom Cypress commands
```

### Key Components:

1. **e2e/**: Contains all test specification files organized by feature
1. **fixtures/**: Static data used in tests (JSON files, images, etc.)
1. **pageObjects/**: Page Object Model implementation for maintainable test code
1. **support/**: Custom commands and utilities to extend Cypress functionality

## Running Tests

Follow these steps to run end to end tests

### Available Commands

```bash

# Open Cypress Test Runner (Interactive Mode) 
# Preferred for Debugging

pnpm run cy:open

# Run all tests in headless mode

pnpm run cy:run
```

### Running Specific Tests

There are multiple testing modes.

#### Interactive Mode

For running specific tests with visual feedback, use the Interactive Mode where you can view all test specs and run individual tests:

```bash
pnpm run cy:open
```

#### Headless Mode

For running specific tests in headless mode, first manually start your application at `http://localhost:4321`, then use the following commands:

```bash
# Run tests in a specific folder
pnpm run cypress:run --spec "cypress/e2e/dashboard_spec/**/*"

# Run a specific test file
pnpm run cypress:run --spec "cypress/e2e/login_spec/login.cy.ts"
```

## Writing Tests

Follow these best practices when writing tests.

### Page Object Model

This project follows the Page Object Model pattern for better test maintenance:

```javascript
// Example usage of page objects
import { LoginPage } from '../pageObjects/auth/LoginPage';

const loginPage = new LoginPage();

it('should login successfully', () => {
  loginPage.verifyLoginPage().login(userData.email, userData.password);;
});
```

### Custom Commands

Custom Cypress commands are defined in `cypress/support/commands.ts` to provide reusable functionality across tests.

### GraphQL Utilities

To reduce duplication and improve reliability, use the GraphQL helpers defined in
`cypress/support/graphql-utils.ts`. These helpers intercept GraphQL requests by
`operationName` and provide a consistent API to mock, alias, and await calls.

> The interceptor respects `CYPRESS_API_URL` via `Cypress.env('apiUrl')`, and
> falls back to `**/graphql` if not set.

```ts
// Mock a successful operation using a fixture
cy.mockGraphQLOperation(
  'OrganizationListBasic',
  'api/graphql/organizations.success.json',
);

// Wait for the mocked operation
cy.waitForGraphQLOperation('OrganizationListBasic');

// Mock a GraphQL error response
cy.mockGraphQLError(
  'CreateOrganization',
  'Organization name already exists',
  'CONFLICT',
);

// Alias a live operation and wait for it
cy.aliasGraphQLOperation('OrganizationListBasic');
cy.waitForGraphQLOperation('OrganizationListBasic');
```

### Test Data

Use fixtures for consistent test data:

```javascript
// Load test data from fixtures
cy.fixture('users').then((users) => {
  // Use users data in tests
});
```

### Test Coverage Report

After running your Cypress tests, you can generate detailed HTML coverage reports to analyze code coverage:

1. **Run Cypress tests** to collect coverage data:
   ```bash
   pnpm run cy:run
   ```

2. **Generate HTML coverage report** using nyc:
   ```bash
   npx nyc --reporter=html
   ```

3. **View the coverage report** in your browser:
   ```bash
   open coverage/index.html
   ```

The HTML report provides an interactive view of:

1. Overall coverage percentages (statements, branches, functions, lines)
1. File-by-file coverage breakdown
1. Detailed line-by-line coverage highlighting
1. Uncovered code sections for easy identification

**Note**: Coverage data is collected during test execution and stored in the `.nyc_output` directory. The HTML report is generated in the `coverage/` directory.

## Contributing

When adding new tests:

1. Follow the existing directory structure
2. Use Page Object Model pattern
3. Add appropriate fixtures for test data
4. Ensure tests are independent and repeatable
5. Document any new custom commands

For more information about Cypress testing, visit the [official Cypress documentation](https://docs.cypress.io/).
