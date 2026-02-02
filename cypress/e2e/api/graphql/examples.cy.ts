describe('GraphQL utilities', () => {
  it('aliases and waits for a live operation', () => {
    cy.aliasGraphQLOperation('OrganizationListBasic');
    cy.visit('/admin');
    cy.waitForGraphQLOperation('OrganizationListBasic');
  });

  it('mocks a successful query', () => {
    cy.mockGraphQLOperation(
      'OrganizationListBasic',
      'api/graphql/organizations.success.json',
    );
    cy.visit('/admin');
    cy.waitForGraphQLOperation('OrganizationListBasic');

    cy.get('[data-testid="selectOrg"] input').click();
    cy.contains('Example Org').should('be.visible');
  });

  it('mocks an error response', () => {
    cy.mockGraphQLError(
      'OrganizationListBasic',
      'Organization list failed',
      'GRAPHQL_ERROR',
    );
    cy.visit('/admin');

    cy.waitForGraphQLOperation('OrganizationListBasic').then(
      (interception) => {
        const errors = interception.response?.body?.errors as
          | Array<{ message: string }>
          | undefined;
        expect(errors?.[0]?.message).to.eq('Organization list failed');
      },
    );
  });
});
