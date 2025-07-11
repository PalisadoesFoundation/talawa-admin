# Cypress End-to-End Testing

This project uses Cypress for comprehensive end-to-end testing to ensure the application works correctly from a user's perspective.

## Prerequisites

Before running Cypress tests, ensure you have the following setup:

### 1. Talawa API Setup
**Important**: The [Talawa API](https://github.com/PalisadoesFoundation/talawa-api) must be properly installed, configured, and running before executing any Cypress tests. The tests depend on API endpoints being available and functional.

Please follow the complete installation guide at: https://github.com/PalisadoesFoundation/talawa-api/blob/develop/INSTALLATION.md

### 2. Application Server
Ensure your local development server is running on `http://localhost:4321`.

## Directory Structure

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

- **e2e/**: Contains all test specification files organized by feature
- **fixtures/**: Static data used in tests (JSON files, images, etc.)
- **pageObjects/**: Page Object Model implementation for maintainable test code
- **support/**: Custom commands and utilities to extend Cypress functionality

## Running Tests

### Available Commands

```bash
# Open Cypress Test Runner (Interactive Mode) 
# Preferred for Debugging 
npm run cy:open

# Run all tests in headless mode
npm run cy:run
```

### Running Specific Tests

#### Interactive Mode
For running specific tests with visual feedback, use the Interactive Mode where you can view all test specs and run individual tests:
```bash
npm run cy:open
```

#### Headless Mode
For running specific tests in headless mode, first manually start your application at `http://localhost:4321`, then use the following commands:

```bash
# Run tests in a specific folder
npm run cypress:run --spec "cypress/e2e/dashboard_spec/**/*"

# Run a specific test file
npm run cypress:run --spec "cypress/e2e/login_spec/login.cy.ts"
```

## Writing Tests

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

### Test Data
Use fixtures for consistent test data:

```javascript
// Load test data from fixtures
cy.fixture('users').then((users) => {
  // Use users data in tests
});
```

## Contributing

When adding new tests:

1. Follow the existing directory structure
2. Use Page Object Model pattern
3. Add appropriate fixtures for test data
4. Ensure tests are independent and repeatable
5. Document any new custom commands

For more information about Cypress testing, visit the [official Cypress documentation](https://docs.cypress.io/).