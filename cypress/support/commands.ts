/// <reference types="cypress" />
export {};

/** Type definitions for GraphQL signIn response */
interface SignInUser {
  id: string;
  name: string;
  emailAddress: string;
  role: string;
}

interface SignInResponse {
  data?: {
    signIn?: {
      user: SignInUser;
      accessToken: string;
      refreshToken: string;
    };
  };
  errors?: Array<{ message: string }>;
}

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * @param role - The user role (e.g., 'superadmin', 'admin', 'user')
       */
      loginByApi(role: string): Chainable<Subject>;
      /**
       * @param expectedMessage - The expected text (string or RegExp)
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

      // Intercept signIn query to capture response using operation name for robust matching
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body?.operationName === 'SignIn') {
          req.alias = 'signInRequest';
        }
        req.continue();
      });

      const loginPath = role === 'user' ? '/' : '/admin';
      cy.visit(loginPath);
      cy.get('[data-cy="loginEmail"]').type(user.email);
      cy.get('[data-cy="loginPassword"]').type(user.password);
      if (Cypress.env('RECAPTCHA_SITE_KEY')) {
        cy.get('iframe')
          .first()
          .then((recaptchaIframe) => {
            const body = recaptchaIframe.contents();
            cy.wrap(body)
              .find('.recaptcha-checkbox-border')
              .should('be.visible')
              .click();
          });
        cy.wait(1000); // wait for 1 second to simulate recaptcha completion
      }
      cy.get('[data-cy="loginBtn"]').click();

      // Wait for and check the signIn response
      cy.wait('@signInRequest', { timeout: 15000 }).then((interception) => {
        const body = interception.response?.body as SignInResponse;
        if (body?.errors && body.errors.length > 0) {
          const errMsg = body.errors.map((e) => e.message).join(', ');
          throw new Error(`Login failed: ${errMsg}`);
        }
        if (!body?.data?.signIn) {
          const message = `Login response missing signIn data. Response: ${JSON.stringify(body)}`;
          cy.log(message);
          throw new Error(message);
        }
      });

      if (role === 'user') {
        cy.url({ timeout: 15000 }).should('include', '/user/organizations');
      } else {
        cy.url({ timeout: 15000 }).should('include', '/admin/orglist');
      }
    });
  });
});

Cypress.Commands.add('assertToast', (expectedMessage: string | RegExp) => {
  cy.get('.Toastify__toast', { timeout: 5000 })
    .should('be.visible')
    .and('contain.text', expectedMessage);
});
