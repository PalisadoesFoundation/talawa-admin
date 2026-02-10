export class AdminDashboardPage {
  private readonly _orgcardContainer: string = '[data-cy="orgCardContainer"]';
  private readonly _manageButton: string = '[data-cy="manageBtn"]';
  private readonly _toggleDropdown: string = '[data-testid="togDrop"]';
  private readonly _logoutButton: string = '[data-testid="signOutBtn"]';
  private readonly _loginEmailInput: string = '[data-cy="loginEmail"]';
  private readonly _drawerOptions = [
    { label: 'People', url: '/admin/orgpeople/' },
    { label: 'Tags', url: '/admin/orgtags/' },
    { label: 'Events', url: '/admin/orgevents/' },
    { label: 'Venues', url: '/admin/orgvenues/' },
    { label: 'Posts', url: '/admin/orgpost/' },
    { label: 'Block/Unblock', url: '/admin/blockuser/' },
    { label: 'Advertisement', url: '/admin/orgads/' },
    { label: 'Funds', url: '/admin/orgfunds/' },
    { label: 'Membership Requests', url: '/admin/requests/' },
    { label: 'Settings', url: '/admin/orgsetting/' },
  ];

  visit() {
    cy.visit('/admin/orglist');
    return this;
  }

  verifyOnDashboard(timeout = 20000) {
    cy.url({ timeout }).should('include', '/admin/orglist');
    const emptyStateSelector = '[data-testid="orglist-no-orgs-empty"]';
    cy.get('body', { timeout }).then(($body) => {
      const hasOrgCards = $body.find(this._orgcardContainer).length > 0;
      const hasEmptyState = $body.find(emptyStateSelector).length > 0;

      if (!hasOrgCards && hasEmptyState) {
        cy.createTestOrganization({
          name: `E2E Org ${Date.now()}`,
          auth: { role: 'admin' },
        });
        cy.reload();
      }
    });
    return this;
  }

  openFirstOrganization(timeout = 20000) {
    const openByNavigation = (orgId: string) => {
      cy.visit(`/admin/orgdash/${orgId}`);
      cy.url().should('match', /\/admin\/orgdash\/[a-f0-9-]+/);
    };

    cy.get('body', { timeout }).then(($body) => {
      if ($body.find(this._manageButton).length > 0) {
        cy.get(this._manageButton, { timeout })
          .should('be.visible')
          .first()
          .click();
        cy.url().should('match', /\/admin\/orgdash\/[a-f0-9-]+/);
        return;
      }

      cy.createTestOrganization({
        name: `E2E Org ${Date.now()}`,
        auth: { role: 'admin' },
      }).then(({ orgId }) => {
        openByNavigation(orgId);
      });
    });
    return this;
  }

  verifyLeftDrawerOptions(timeout = 40000) {
    this._drawerOptions.forEach(({ label, url }) => {
      const selector = `[data-cy="leftDrawerButton-${label}"]`;
      cy.get(selector, { timeout }).should('be.visible').click();
      cy.url().should('match', new RegExp(`${url}[a-f0-9-]+`));
    });
    return this;
  }

  logout(timeout = 20000) {
    cy.get(this._logoutButton, { timeout })
      .should('exist')
      .click({ force: true });
    cy.url({ timeout }).should('include', '/');
    cy.get(this._loginEmailInput, { timeout }).should('be.visible');
    return this;
  }
}
