/// <reference types="cypress" />
import type { CyHttpMessages } from 'cypress/types/net-stubbing';

export {};

/**
 * @public
 * GraphQL responder used by Cypress utilities to mock operation responses.
 * Supports fixture paths, inline body objects, or custom request handlers.
 */
type GqlResponder =
  | string
  | Record<string, unknown>
  | ((req: CyHttpMessages.IncomingHttpRequest) => void);

/**
 * @public
 * Extensions object for GraphQL errors (key/value metadata map).
 */
type GqlErrorExtensions = Record<string, unknown>;

/**
 * @public
 * Partial Cypress response configuration applied when replying to operations.
 */
type GqlOperationOptions = Partial<Cypress.StaticResponse>;

const getApiPattern = (): string => {
  const apiUrl =
    (Cypress.env('apiUrl') as string | undefined) ||
    (Cypress.env('API_URL') as string | undefined) ||
    (Cypress.env('CYPRESS_API_URL') as string | undefined);

  return apiUrl || '**/graphql';
};

const interceptGraphQLOperation = (
  operationName: string,
  handler: (req: CyHttpMessages.IncomingHttpRequest) => void,
): void => {
  const apiPattern = getApiPattern();
  cy.intercept('POST', apiPattern, (req) => {
    if (req.body?.operationName !== operationName) {
      req.continue();
      return;
    }
    req.alias = operationName;
    handler(req);
  });
};

/**
 * Alias a GraphQL operation by name so it can be awaited via cy.wait.
 * @param operationName - GraphQL operationName to alias.
 * @returns void
 */
export const aliasGraphQLOperation = (operationName: string): void => {
  interceptGraphQLOperation(operationName, (req) => req.continue());
};

/**
 * Wait for a previously-aliased GraphQL operation.
 * @param operationName - GraphQL operationName to await.
 * @returns Cypress chainable interception for further assertions.
 */
export const waitForGraphQLOperation = (
  operationName: string,
): Cypress.Chainable<Cypress.Interception> => {
  return cy.wait(
    `@${operationName}`,
  ) as Cypress.Chainable<Cypress.Interception>;
};

/**
 * Mock a GraphQL operation response by operationName.
 *
 * Uses interceptGraphQLOperation to route matching requests and applies
 * the responder based on its shape:
 * - function: receives the request and can call req.reply or req.continue manually
 * - string: treated as a fixture path and passed to req.reply with fixture and options
 * - object: treated as a response body and passed to req.reply with body and options
 *
 * @param operationName - GraphQL operationName to mock.
 * @param responder - Fixture path, inline body, or request handler.
 * @param options - Partial Cypress.StaticResponse merged into req.reply.
 * @returns void
 */
export const mockGraphQLOperation = (
  operationName: string,
  responder: GqlResponder,
  options?: GqlOperationOptions,
): void => {
  interceptGraphQLOperation(operationName, (req) => {
    if (typeof responder === 'function') {
      responder(req);
      return;
    }

    if (typeof responder === 'string') {
      req.reply({ fixture: responder, ...options });
      return;
    }

    req.reply({ body: responder, ...options });
  });
};

/**
 * Mock a GraphQL error response for a named operation.
 *
 * @param operationName - GraphQL operationName to mock.
 * @param message - Error message returned in the GraphQL errors array.
 * @param code - Optional error code (default: 'GRAPHQL_ERROR').
 * @param extensions - Optional GraphQL error extensions.
 * @returns void
 *
 * @example
 * mockGraphQLError('CreateOrganization', 'Organization name already exists', 'CONFLICT');
 */
export const mockGraphQLError = (
  operationName: string,
  message: string,
  code = 'GRAPHQL_ERROR',
  extensions: GqlErrorExtensions = {},
): void => {
  mockGraphQLOperation(operationName, {
    errors: [{ message, extensions: { code, ...extensions } }],
  });
};

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      aliasGraphQLOperation(operationName: string): Chainable<Subject>;
      waitForGraphQLOperation(
        operationName: string,
      ): Chainable<Cypress.Interception>;
      mockGraphQLOperation(
        operationName: string,
        responder: GqlResponder,
        options?: GqlOperationOptions,
      ): Chainable<Subject>;
      mockGraphQLError(
        operationName: string,
        message: string,
        code?: string,
        extensions?: GqlErrorExtensions,
      ): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add('aliasGraphQLOperation', aliasGraphQLOperation);
Cypress.Commands.add('waitForGraphQLOperation', waitForGraphQLOperation);
Cypress.Commands.add('mockGraphQLOperation', mockGraphQLOperation);
Cypress.Commands.add('mockGraphQLError', mockGraphQLError);
