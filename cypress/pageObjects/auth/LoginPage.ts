export class LoginPage {
  private readonly _emailInput: string = '[data-cy=loginEmail]';
  private readonly _passwordInput: string = '[data-cy=loginPassword]';
  private readonly _loginButton: string = '[data-cy=loginBtn]';

  verifyLoginPage() {
    cy.get(this._emailInput).should('be.visible');
    cy.get(this._passwordInput).should('be.visible');
    cy.get(this._loginButton).should('be.visible');
    return this;
  }

  login(email: string, password: string) {
    cy.get(this._emailInput).type(email);
    cy.get(this._passwordInput).type(password);
    cy.get(this._loginButton).click();
    return this;
  }
}
