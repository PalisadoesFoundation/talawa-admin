---
id: e2e-testing
title: End to End Testing
slug: /developer-resources/e2e-testing
sidebar_position: 7
---

## Introduction

End-to-End (E2E) testing is performed using **Cypress** to validate the application from a user's perspective, ensuring all components function together reliably.

---

### Prerequisites

Before running tests, ensure the following are set up:

* **Talawa API:** The **Talawa API** must be fully installed, configured, and running. Tests depend on its endpoints.
    * *Installation Guide:* [https://docs-api.talawa.io/docs/installation](https://docs-api.talawa.io/docs/installation)
* **Application Server:** Your local development server must be running at **`http://localhost:4321`**.

---

### Test Structure and Components

The tests follow the **Page Object Model** pattern for maintainability.

| Directory | Purpose | Key Component |
| :--- | :--- | :--- |
| **`cypress/e2e/`** | End-to-end test specification files, organized by feature. | `login.cy.ts` |
| **`cypress/fixtures/`** | Static test data (e.g., JSON files). | `users.json` |
| **`cypress/pageObjects/`** | **Page Object Model** classes for abstracting page interactions. | `auth/LoginPage.ts` |
| **`cypress/support/`** | Custom commands and utilities for reusable functionality. | `commands.ts` |

---

### Running Tests

| Mode | Command | Description |
| :--- | :--- | :--- |
| **Interactive (Debugging)** | `npm run cy:open` | Opens the Cypress Test Runner for visual feedback and debugging. |
| **Headless (CI/Run All)** | `npm run cy:run` | Runs all tests in the headless mode. |

---

### Writing Tests & Best Practices

1.  **Page Object Model (POM):** Use POM (located in `cypress/pageObjects/`) to make tests more readable and maintainable.
2.  **Custom Commands:** Define reusable actions in `cypress/support/commands.ts`.
3.  **Test Data:** Use **fixtures** (loaded via `cy.fixture('users')`) for consistent test data.

---

### Test Coverage Report

Generate a detailed HTML report to analyze code coverage:

1.  **Run Tests:** `npm run cy:run` (collects coverage data).
2.  **Generate Report:** `npx nyc --reporter=html`
3.  **View Report:** `open coverage/index.html` (in your browser).

The report provides overall percentages and detailed line-by-line coverage analysis.