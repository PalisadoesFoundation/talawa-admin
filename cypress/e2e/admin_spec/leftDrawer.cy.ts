/// <reference types="cypress" />

describe('LeftDrawer CSS Tests', () => {
  beforeEach(() => {
    // Setup any necessary authentication or navigation
    cy.loginByApi('admin');
    cy.visit('/orglist');
    // Visit any organization to check OrgBtn test id
    cy.get('[data-testid="manageBtn"]').first().click();
    cy.url().should('include', '/orgdash');
  });

  it('should have flex-direction: row property for profileContainer class', () => {
    // Wait for the profile container to be visible
    cy.get('[data-testid="OrgBtn"]').should('be.visible');

    // Check that the profileContainer has flex-direction: row
    cy.get('[data-testid="OrgBtn"]').should(
      'have.css',
      'flex-direction',
      'row',
    );
  });

  it('should verify profileContainer CSS properties using CSS modules class', () => {
    // Target element with CSS modules class pattern
    cy.get('[class*="profileContainer"]')
      .should('be.visible')
      .and('have.css', 'flex-direction', 'row');
  });

  it('should check profileContainer styling when organization data is loaded', () => {
    // Wait for organization data to load (not shimmer state)
    cy.get('[data-testid="OrgBtn"]').should('be.visible');
    cy.get('[class*="shimmer"]').should('not.exist');

    // Verify the CSS property using CSS modules pattern
    cy.get('[data-testid="OrgBtn"]')
      .should('have.attr', 'class')
      .and('include', 'profileContainer')
      .then(() => {
        cy.get('[data-testid="OrgBtn"]').should(
          'have.css',
          'flex-direction',
          'row',
        );
      });
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
