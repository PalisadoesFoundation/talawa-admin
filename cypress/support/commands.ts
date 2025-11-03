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
       * @param expectedMessage The expected error text (string or RegExp)
       */
      assertToastError(expectedMessage: string | RegExp): Chainable<void>;
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

Cypress.Commands.add('assertToastError', (expectedMessage: string | RegExp) => {
  cy.get('[role=alert]', { timeout: 5000 })
    .should('be.visible')
    .and('contain.text', expectedMessage);
});


/// <reference types="cypress" />
export {};

declare global {
  namespace Cypress {
    interface ToastCommandOptions {
      /**
       * Timeout for the command in milliseconds.
       * @default 5000
       */
      timeout?: number;
      /**
       * Whether to log the command to the Cypress command log.
       * @default true
       */
      log?: boolean;
    }

    interface Chainable<Subject> {
      /**
       * @param role - The user role (e.g., 'superadmin', 'admin', 'user')
       */
      loginByApi(role: string): Chainable<Subject>;

      /**
       * Asserts that a toast notification is visible and contains the expected message.
       * @deprecated Use `cy.expectToastMessage` instead. This command is now an alias for it.
       * @param expectedMessage The expected error text (string or RegExp)
       * @param options Command options
       * @returns Chainable<JQuery<HTMLElement>> - The toast element containing the message
       */
      assertToastError(expectedMessage: string | RegExp, options?: ToastCommandOptions): Chainable<JQuery<HTMLElement>>;

      /**
       * Gets the currently visible `react-toastify` toast notification element.
       * This command waits for the toast to be visible.
       * @param options Command options (e.g., timeout)
       * @returns Chainable<JQuery<HTMLElement>> - The toast element
       */
      getToast(options?: ToastCommandOptions): Chainable<JQuery<HTMLElement>>;

      /**
       * Asserts that a `react-toastify` toast notification is visible and contains the expected message.
       * This command internally uses `cy.getToast()` and waits for the message to appear.
       * @param message The expected text (string or RegExp) to be found in the toast.
       * @param options Command options (e.g., timeout)
       * @returns Chainable<JQuery<HTMLElement>> - Yields the toast element for further chaining.
       */
      expectToastMessage(message: string | RegExp, options?: ToastCommandOptions): Chainable<JQuery<HTMLElement>>;

      /**
       * Clicks an action button within a visible `react-toastify` toast notification.
       * This is useful for interactive toasts (e.g., 'Undo', 'Retry').
       * @param actionText The text content of the action button to click.
       * @param options Command options (e.g., timeout)
       * @returns Chainable<JQuery<HTMLElement>> - Yields the toast element that contained the clicked button for further chaining.
       */
      clickToastAction(actionText: string, options?: ToastCommandOptions): Chainable<JQuery<HTMLElement>>;
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

// Define default options for toast commands for consistency and reusability
const defaultToastOptions: Cypress.ToastCommandOptions = {
  timeout: 5000,
  log: true,
};

Cypress.Commands.add('getToast', (options?: Cypress.ToastCommandOptions) => {
  const opts = { ...defaultToastOptions, ...options };
  const log = opts.log && Cypress.log({
    name: 'getToast',
    displayName: 'GET TOAST',
    message: '',
    timeout: opts.timeout,
    consoleProps: () => ({ options: opts }),
  });

  // react-toastify renders toasts with the class 'Toastify__toast'
  return cy.get('.Toastify__toast', { timeout: opts.timeout, log: false })
    .should('be.visible')
    .then(($el) => {
      log?.set('$el', $el).snapshot().end();
      return $el;
    });
});

Cypress.Commands.add('expectToastMessage', (message: string | RegExp, options?: Cypress.ToastCommandOptions) => {
  const opts = { ...defaultToastOptions, ...options };
  const log = opts.log && Cypress.log({
    name: 'expectToastMessage',
    displayName: 'EXPECT TOAST MESSAGE',
    message: message.toString(),
    timeout: opts.timeout,
    consoleProps: () => ({ message, options: opts }),
  });

  // Use cy.getToast with logging disabled to avoid duplicate logs
  return cy.getToast({ ...opts, log: false })
    .contains(message, { log: false })
    .then(($el) => {
      log?.set('$el', $el).snapshot().end();
      return $el;
    });
});

Cypress.Commands.add('clickToastAction', (actionText: string, options?: Cypress.ToastCommandOptions) => {
  const opts = { ...defaultToastOptions, ...options };
  const log = opts.log && Cypress.log({
    name: 'clickToastAction',
    displayName: 'CLICK TOAST ACTION',
    message: actionText,
    timeout: opts.timeout,
    consoleProps: () => ({ actionText, options: opts }),
  });

  return cy.getToast({ ...opts, log: false })
    .find('button', { log: false })
    .contains(actionText, { log: false })
    .click({ log: false })
    .then(($button) => {
      const $toast = $button.closest('.Toastify__toast');
      log?.set('$el', $toast).snapshot().end();
      // Return the toast element, not the button, for better chaining
      return cy.wrap($toast as JQuery<HTMLElement>);
    });
});

// Re-implement the old command using the new, more robust logic.
// This maintains backward compatibility while encouraging use of the new command.
Cypress.Commands.add('assertToastError', (expectedMessage: string | RegExp, options?: Cypress.ToastCommandOptions) => {
  return cy.expectToastMessage(expectedMessage, options);
});