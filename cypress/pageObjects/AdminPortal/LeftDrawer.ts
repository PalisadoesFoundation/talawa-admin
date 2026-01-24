export class LeftDrawer {
  checkBreakpoint(): void {
    // Ensure we're inside the <1280px breakpoint where the fix applies
    cy.viewport(1200, 900);
    // Stabilize assertions by waiting on org data
    cy.intercept('POST', '**/graphql').as('graphql');
    cy.visit('/admin/orglist');
    // Visit any organization to check OrgBtn test id
    cy.get('[data-testid="manageBtn"]').first().click();
    cy.url().should('include', '/admin/orgdash');
    cy.wait('@graphql', { timeout: 15000 });
  }

  checkRowViewport(): void {
    // Wait for the profile container to be visible
    cy.get('[data-testid="OrgBtn"]').should('be.visible');

    // Check that the profileContainer has flex-direction: row
    cy.get('[data-testid="OrgBtn"]').should(
      'have.css',
      'flex-direction',
      'row',
    );
  }

  checkProfileContainerStyling(): void {
    // Wait for organization data to load (not shimmer state)
    cy.get('[data-testid="OrgBtn"]').should('be.visible');
    cy.get('[class*="shimmer"]').should('not.exist');

    // Verify the CSS property using CSS modules pattern
    cy.get('[data-testid="OrgBtn"]')
      .should('be.visible')
      .and('have.css', 'flex-direction', 'row');
  }
}
