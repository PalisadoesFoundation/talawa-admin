/// <reference types="cypress" />
export {};

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * @param role - The user role (e.g., 'superadmin', 'admin', 'user')
       */
      loginByApi(role: string): Chainable<Subject>;

      /**
       * @param expectedMessage The expected text (string or RegExp)
       */
      assertToast(expectedMessage: string | RegExp): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginByApi', (role: string) => {
  const sessionName = `login-${role}`;

  return cy.session(sessionName, () => {
    cy.fixture('users').then((users) => {
      const user = users[role];
      if (!user) {
        throw new Error(`User role "${role}" not found in users fixture`);
      }

      const loginPath = role === 'user' ? '/' : '/admin';
      cy.visit(loginPath);
      cy.get('[data-cy="loginEmail"]').type(user.email);
      cy.get('[data-cy="loginPassword"]').type(user.password);
      cy.get('[data-cy="loginBtn"]').click();

      if (role === 'user') {
        cy.url().should('include', '/user/organizations');
      } else {
        cy.url().should('include', '/orglist');
      }
    });
  });
});

Cypress.Commands.add('assertToast', (expectedMessage: string | RegExp) => {
  cy.get('[role=alert]', { timeout: 5000 })
    .should('be.visible')
    .then(($el) => {
      const text = $el.text();

      if (expectedMessage instanceof RegExp) {
        expect(text).to.match(expectedMessage);
      } else {
        expect(text).to.contain(expectedMessage);
      }
    });
});
