describe('User Dashboard', () => {
  beforeEach(() => {
    cy.loginByApi('user');
    cy.visit('/user/organizations');
  });

  it('should display the user organizations and visit Organization Dashboard', () => {
    cy.url().should('include', '/user/organizations');
    cy.get('[data-cy="orgCard"]').should('be.visible');
  });
});
