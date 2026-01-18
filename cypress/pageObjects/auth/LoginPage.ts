/**
 * Page Object Model for the Login Page.
 * Contains selectors and methods for interacting with the login page.
 */
export class LoginPage {
  private readonly _emailInput: string = '[data-cy=loginEmail]';
  private readonly _passwordInput: string = '[data-cy=loginPassword]';
  private readonly _loginButton: string = '[data-cy=loginBtn]';

  verifyLoginPage(timeout = 10000) {
    cy.get(this._emailInput, { timeout }).should('be.visible');
    cy.get(this._passwordInput, { timeout }).should('be.visible');
    cy.get(this._loginButton, { timeout }).should('be.visible');
    return this;
  }

  login(email: string, password: string, timeout = 10000) {
    cy.get(this._emailInput, { timeout })
      .should('be.visible')
      .clear()
      .type(email);
    cy.get(this._passwordInput, { timeout })
      .should('be.visible')
      .clear()
      .type(password);
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
    cy.get(this._loginButton, { timeout }).should('be.enabled').click();
    return this;
  }

  verifyToastVisible(expectedMessage?: string, timeout = 10000) {
    const toast = cy.get('[role=alert]', { timeout }).should('be.visible');
    if (expectedMessage) {
      toast.should('contain.text', expectedMessage);
    }
    return this;
  }

  verifyErrorToast(timeout = 10000) {
    return this.verifyToastVisible(undefined, timeout);
  }
}
