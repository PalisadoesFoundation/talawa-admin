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

      // Intercept signIn query to capture response
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body?.query?.includes('signIn')) {
          req.alias = 'signInRequest';
        }
      });

      const loginPath = role === 'user' ? '/' : '/admin';
      cy.visit(loginPath);
      cy.get('[data-cy="loginEmail"]').type(user.email);
      cy.get('[data-cy="loginPassword"]').type(user.password);
      cy.get('[data-cy="loginBtn"]').click();

      // Wait for and check the signIn response
      cy.wait('@signInRequest', { timeout: 30000 }).then((interception) => {
        const body = interception.response?.body;
        if (body?.errors?.length > 0) {
          const errMsg = body.errors
            .map((e: { message: string }) => e.message)
            .join(', ');
          throw new Error(`Login failed: ${errMsg}`);
        }
        if (!body?.data?.signIn) {
          throw new Error(
            `Login failed: No signIn data in response. Response: ${JSON.stringify(body)}`,
          );
        }
      });

      if (role === 'user') {
        cy.url({ timeout: 60000 }).should('include', '/user/organizations');
      } else {
        cy.url({ timeout: 60000 }).should('include', '/orglist');
      }
    });
  });
});

Cypress.Commands.add('assertToast', (expectedMessage: string | RegExp) => {
  cy.get('[role=alert]', { timeout: 5000 })
    .should('be.visible')
    .and('contain.text', expectedMessage);
});
