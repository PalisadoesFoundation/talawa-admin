/// <reference types="cypress" />

describe('LeftDrawer CSS Tests', () => {
    beforeEach(() => {
        // Setup any necessary authentication or navigation
        cy.loginByApi('admin');
        // Ensure we're inside the <1280px breakpoint where the fix applies
        cy.viewport(1200, 900);
        // Stabilize assertions by waiting on org data
        cy.intercept('POST', '**/graphql').as('graphql');
        cy.visit('/orglist');
        // Visit any organization to check OrgBtn test id
        cy.get('[data-testid="manageBtn"]').first().click();
        cy.url().should('include', '/orgdash');
        cy.wait('@graphql', { timeout: 15000 });
    });

    it('profile container uses row under <1280px viewport', () => {
        // Wait for the profile container to be visible
        cy.get('[data-testid="OrgBtn"]').should('be.visible');

        // Check that the profileContainer has flex-direction: row
        cy.get('[data-testid="OrgBtn"]').should(
            'have.css',
            'flex-direction',
            'row',
        );
    });

    it('should check profileContainer styling when organization data is loaded', () => {
        // Wait for organization data to load (not shimmer state)
        cy.get('[data-testid="OrgBtn"]').should('be.visible');
        cy.get('[class*="shimmer"]').should('not.exist');

        // Verify the CSS property using CSS modules pattern
        cy.get('[data-testid="OrgBtn"]')
            .should('be.visible')
            .and('have.css', 'flex-direction', 'row');
    });

    afterEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });
});
