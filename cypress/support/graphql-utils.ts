/// <reference types="cypress" />
export {};

type GqlResponder =
  | string
  | Record<string, unknown>
  | ((req: Cypress.Request) => void);

type GqlErrorExtensions = Record<string, unknown>;

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
  handler: (req: Cypress.Request) => void,
): void => {
  const apiPattern = getApiPattern();
  cy.intercept('POST', apiPattern, (req) => {
    if (req.body?.operationName !== operationName) return;
    req.alias = operationName;
    handler(req);
  });
};

export const aliasGraphQLOperation = (operationName: string): void => {
  interceptGraphQLOperation(operationName, () => undefined);
};

export const waitForGraphQLOperation = (
  operationName: string,
): Cypress.Chainable<Cypress.Interception> => {
  return cy.wait(
    `@${operationName}`,
  ) as Cypress.Chainable<Cypress.Interception>;
};

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
