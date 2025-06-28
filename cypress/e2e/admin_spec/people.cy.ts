describe('Admin People Tab', () => {
  beforeEach(() => {
    cy.loginByApi('admin');
    cy.visit('/orglist');
    cy.get('[data-cy="manageBtn"]').should('be.visible').first().click();
    cy.url().should('match', /\/orgdash\/[a-f0-9-]+/);
    cy.get('[data-cy="leftDrawerButton-People"]').should('be.visible').click();
    cy.url().should('match', /\/orgpeople\/[a-f0-9-]+/);
  });

  it('should able to search a particular member and then resest to all members', () => {
    cy.get('[placeholder="Enter Full Name"]')
      .should('be.visible')
      .type('Harve Lance');
    cy.get('[data-testid="searchbtn"]').should('be.visible').click();
    cy.get('[data-field="name"]').should('be.visible').contains('Harve Lance');
    cy.get('[placeholder="Enter Full Name"]').should('be.visible').clear();
    cy.get('[data-testid="searchbtn"]').should('be.visible').click();
  });
});
