export class UserDashboardPage {
  private readonly _orgCard: string = '[data-cy="orgCard"]';
  private readonly _manageButton: string = '[data-cy="manageBtn"]';

  visit() {
    cy.visit('/user/organizations');
    return this;
  }

  verifyOnDashboard() {
    cy.url().should('include', '/user/organizations');
    cy.get(this._orgCard).should('be.visible');
    return this;
  }

  openFirstOrganization() {
    cy.get(this._manageButton).should('be.visible').first().click();
    cy.url().should('match', /\/user\/organization\/[a-f0-9-]+/);
    return this;
  }
}
