export class UserDashboardPage {
  private readonly _orgCard: string = '[data-cy="orgCard"]';
  private readonly _manageButton: string = '[data-cy="manageBtn"]';

  visit() {
    cy.visit('/user/organizations');
    return this;
  }

  verifyOnDashboard(timeout = 10000) {
    cy.url({ timeout }).should('include', '/user/organizations');
    cy.get(this._orgCard, { timeout }).should('be.visible');
    return this;
  }

  openFirstOrganization(timeout = 10000) {
    cy.get(this._manageButton, { timeout })
      .should('be.visible')
      .first()
      .click();
    cy.url({ timeout }).should('match', /\/user\/organization\/[a-f0-9-]+/);
    return this;
  }
}
