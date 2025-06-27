export class AdminDashboardPage {
  private readonly _orgcardContainer: string = '[data-cy="orgCardContainer"]';
  private readonly _manageButton: string = '[data-cy="manageBtn"]';
  private readonly _toggleDropdown: string = '[data-testid="togDrop"]';
  private readonly _logoutButton: string = '[data-testid="logoutBtn"]';
  private readonly _loginEmailInput: string = '[data-cy="loginEmail"]';

  visit() {
    cy.visit('/orgList');
    return this;
  }

  verifyOnDashboard(timeout = 10000) {
    cy.url({ timeout }).should('include', '/orgList');
    cy.get(this._orgcardContainer, { timeout }).should('be.visible');
    cy.contains('Talawa Admin Portal', { timeout }).should('be.visible');
    return this;
  }

  openFirstOrganization(timeout = 10000) {
    cy.get(this._manageButton, { timeout })
      .should('be.visible')
      .first()
      .click();
    cy.url().should('match', /\/orgdash\/[a-f0-9-]+/);
    return this;
  }

  logout(timeout = 10000) {
    cy.get(this._toggleDropdown, { timeout }).should('be.visible').click();
    cy.get(this._logoutButton, { timeout }).should('be.visible').click();
    cy.url({ timeout }).should('include', '/');
    cy.get(this._loginEmailInput, { timeout }).should('be.visible');
    return this;
  }
}
