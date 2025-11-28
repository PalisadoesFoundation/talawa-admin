//
// Page Object Model (POM) Compliance Checker for E2E Tests

// This script validates that all Cypress end-to-end test files in the project
// follow the Page Object Model (POM) design pattern. It scans through all TypeScript
// test files in the cypress/e2e directory and checks for direct usage of Cypress
// commands that should be encapsulated within page object classes.

// The script identifies forbidden Cypress commands (like cy.get(), cy.click(), etc.)
// that indicate direct DOM interaction instead of using page objects. This helps
// maintain clean, maintainable, and reusable test code by enforcing the POM pattern.

// Exit codes:
// - 0: All tests follow POM (no forbidden patterns found)
// - 1: POM violations detected (forbidden patterns found)
//
import { readFileSync } from 'fs';
import { globSync } from 'glob';

const forbiddenMethods = [
  'get',
  'contains',
  'find',
  'children',
  'closest',
  'filter',
  'first',
  'last',
  'next',
  'prev',
  'siblings',
  'click',
  'dblclick',
  'rightclick',
  'type',
  'select',
  'check',
  'uncheck',
  'trigger',
  'clear',
  'scrollIntoView',
  'should',
  'and',
  'within',
];

const forbiddenPatterns = forbiddenMethods.map((m) => `cy.${m}(`);

const files = globSync('cypress/e2e/**/*.ts');

let hasError = false;

files.forEach((file) => {
  const content = readFileSync(file, 'utf8');
  forbiddenPatterns.forEach((pattern) => {
    if (content.includes(pattern)) {
      console.error(`Found "${pattern}" in ${file}`);
      hasError = true;
    }
  });
});

if (hasError) {
  console.error(
    '❗ POM violations detected. Please refactor the tests to use page objects.',
  );
  process.exit(1);
} else {
  console.log('✅ All e2e tests follow POM.');
}
