const triggerGraphQLRequest = (operationName: string): Cypress.Chainable => {
  return cy.window().then((win) => {
    return win.fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operationName,
        query: 'query ExampleOperation { __typename }',
      }),
    });
  });
};

describe('GraphQL utilities', () => {
  beforeEach(() => {
    Cypress.env('apiUrl', '/graphql');
    cy.visit('/');
  });

  it('aliases and waits for a live operation', () => {
    cy.aliasGraphQLOperation('ExampleOperation');
    triggerGraphQLRequest('ExampleOperation');
    cy.waitForGraphQLOperation('ExampleOperation');
  });

  it('mocks a successful query', () => {
    cy.mockGraphQLOperation(
      'OrganizationListBasic',
      'api/graphql/organizations.success.json',
    );
    triggerGraphQLRequest('OrganizationListBasic');
    cy.waitForGraphQLOperation('OrganizationListBasic')
      .its('response.body.data.organizations.0.name')
      .should('eq', 'Example Org');
  });

  it('mocks an error response', () => {
    cy.mockGraphQLError(
      'OrganizationListBasic',
      'Organization list failed',
      'GRAPHQL_ERROR',
    );
    triggerGraphQLRequest('OrganizationListBasic');

    cy.waitForGraphQLOperation('OrganizationListBasic')
      .its('response.body.errors.0.message')
      .should('eq', 'Organization list failed');
  });
});
