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
    cy.get(this._loginButton, { timeout }).should('be.enabled').click();
    return this;
  }

  verifyErrorToast(timeout = 5000) {
    cy.get('.Toastify__toast', { timeout }).should('be.visible');
    return this;
  }
}
