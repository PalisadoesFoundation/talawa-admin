type GraphQLError = { message: string };

const triggerGraphQLRequest = (operationName: string): Cypress.Chainable => {
  return cy.window().then((win) => {
    return win.fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operationName,
        // operationName drives cy.intercept matching, so a static query body is sufficient.
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
    cy.aliasGraphQLOperation('OrganizationListBasic');
    triggerGraphQLRequest('OrganizationListBasic');
    cy.waitForGraphQLOperation('OrganizationListBasic').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body).to.exist;
    });
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

    cy.waitForGraphQLOperation('OrganizationListBasic').then((interception) => {
      const errors = interception.response?.body?.errors as
        | GraphQLError[]
        | undefined;
      expect(errors?.[0]?.message).to.eq('Organization list failed');
    });
  });
});
