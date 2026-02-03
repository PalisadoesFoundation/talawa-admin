type GraphQLError = { message: string };

const requestTimeoutMs = 5000;
const windowTimeoutMs = 10000;

const triggerGraphQLRequest = (
  operationName: string,
  url: string = '/graphql',
): Cypress.Chainable => {
  return cy.window({ timeout: windowTimeoutMs }).then((win) => {
    const controller = new AbortController();
    const timeoutId = win.setTimeout(
      () => controller.abort(),
      requestTimeoutMs,
    );
    return win
      .fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operationName,
          // operationName drives cy.intercept matching, so a static query body is sufficient.
          query: 'query ExampleOperation { __typename }',
        }),
      })
      .catch((error) => {
        throw new Error(
          `GraphQL request "${operationName}" failed: ${String(error)}`,
        );
      })
      .finally(() => {
        win.clearTimeout(timeoutId);
      });
  });
};

describe('GraphQL utilities', () => {
  let originalApiUrl: unknown;
  let originalApiUrlEnv: unknown;
  let originalCypressApiUrl: unknown;

  beforeEach(() => {
    originalApiUrl = Cypress.env('apiUrl');
    originalApiUrlEnv = Cypress.env('API_URL');
    originalCypressApiUrl = Cypress.env('CYPRESS_API_URL');
    Cypress.env('apiUrl', '/graphql');
    Cypress.env('API_URL', null);
    Cypress.env('CYPRESS_API_URL', null);
    cy.visit('/');
  });

  afterEach(() => {
    Cypress.env('apiUrl', originalApiUrl);
    Cypress.env('API_URL', originalApiUrlEnv);
    Cypress.env('CYPRESS_API_URL', originalCypressApiUrl);
  });

  it('aliases and waits for a live operation', () => {
    cy.aliasGraphQLOperation('OrganizationListBasic');
    triggerGraphQLRequest('OrganizationListBasic');
    cy.waitForGraphQLOperation('OrganizationListBasic').then((interception) => {
      expect(interception.response).to.not.equal(undefined);
      expect(interception.response?.body).to.not.equal(undefined);
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

  it('uses API_URL when apiUrl is not set', () => {
    Cypress.env('apiUrl', null);
    Cypress.env('API_URL', '/graphql-api-url');
    cy.mockGraphQLOperation('ApiUrlOperation', {
      data: { ok: true },
    });

    triggerGraphQLRequest('ApiUrlOperation', '/graphql-api-url');
    cy.waitForGraphQLOperation('ApiUrlOperation')
      .its('response.body.data.ok')
      .should('eq', true);
  });

  it('uses CYPRESS_API_URL when other envs are unset', () => {
    Cypress.env('apiUrl', null);
    Cypress.env('API_URL', null);
    Cypress.env('CYPRESS_API_URL', '/graphql-cypress-env');

    cy.mockGraphQLOperation('CypressEnvOperation', {
      data: { ok: true },
    });

    triggerGraphQLRequest('CypressEnvOperation', '/graphql-cypress-env');
    cy.waitForGraphQLOperation('CypressEnvOperation')
      .its('response.body.data.ok')
      .should('eq', true);
  });

  it('falls back to default pattern when envs are unset', () => {
    Cypress.env('apiUrl', null);
    Cypress.env('API_URL', null);
    Cypress.env('CYPRESS_API_URL', null);

    cy.mockGraphQLOperation('DefaultOperation', {
      data: { ok: true },
    });

    triggerGraphQLRequest('DefaultOperation');
    cy.waitForGraphQLOperation('DefaultOperation')
      .its('response.body.data.ok')
      .should('eq', true);
  });

  it('supports function responders', () => {
    cy.mockGraphQLOperation('FunctionResponder', (req) => {
      req.reply({ statusCode: 201, body: { data: { ok: true } } });
    });

    triggerGraphQLRequest('FunctionResponder');
    cy.waitForGraphQLOperation('FunctionResponder')
      .its('response.statusCode')
      .should('eq', 201);
  });

  it('passes through non-matching operations', () => {
    cy.mockGraphQLOperation('MatchOperation', { data: { ok: false } });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body?.operationName === 'DifferentOperation') {
        req.alias = 'fallbackOperation';
        req.reply({ statusCode: 200, body: { data: { ok: true } } });
        return;
      }

      req.continue();
    });

    triggerGraphQLRequest('DifferentOperation');

    cy.wait('@fallbackOperation')
      .its('response.body.data.ok')
      .should('eq', true);
  });
});
