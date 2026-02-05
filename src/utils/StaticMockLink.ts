import {
  print,
  visit,
  DocumentNode,
  DefinitionNode,
  SelectionSetNode,
  FieldNode,
} from 'graphql';
import { equal } from '@wry/equality';
import { invariant } from 'ts-invariant';

import type { Operation, FetchResult } from '@apollo/client';
import { ApolloLink, Observable } from '@apollo/client';
import { addTypenameToDocument } from '@apollo/client/utilities';

import type { MockedResponse, ResultFunction } from '@apollo/client/testing';

// Local implementation of cloneDeep since it's no longer exported from @apollo/client/utilities
function cloneDeep<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => cloneDeep(item)) as unknown as T;
  }
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = cloneDeep((obj as Record<string, unknown>)[key]);
    }
  }
  return result as T;
}

// Local implementation since it's no longer exported from @apollo/client/utilities
function removeConnectionDirectiveFromDocument(
  doc: DocumentNode,
): DocumentNode | null {
  if (!doc) return null;
  return visit(doc, {
    Directive(node) {
      if (node.name.value === 'connection') {
        return null;
      }
      return undefined;
    },
  });
}

// Local implementation since it's no longer exported from @apollo/client/utilities
function removeClientSetsFromDocument(doc: DocumentNode): DocumentNode | null {
  if (!doc) return null;

  const isClientField = (field: FieldNode): boolean => {
    return (
      field.directives?.some(
        (directive) => directive.name.value === 'client',
      ) ?? false
    );
  };

  const removeClientFields = (
    selectionSet: SelectionSetNode,
  ): SelectionSetNode | null => {
    const selections = selectionSet.selections.filter((selection) => {
      if (selection.kind === 'Field') {
        return !isClientField(selection);
      }
      return true;
    });
    if (selections.length === 0) {
      return null;
    }
    return { ...selectionSet, selections };
  };

  const newDefinitions: DefinitionNode[] = [];
  for (const definition of doc.definitions) {
    if (
      definition.kind === 'OperationDefinition' ||
      definition.kind === 'FragmentDefinition'
    ) {
      if (definition.selectionSet) {
        const newSelectionSet = removeClientFields(definition.selectionSet);
        if (newSelectionSet) {
          newDefinitions.push({ ...definition, selectionSet: newSelectionSet });
        }
      } else {
        newDefinitions.push(definition);
      }
    } else {
      newDefinitions.push(definition);
    }
  }

  if (newDefinitions.length === 0) {
    return null;
  }

  return { ...doc, definitions: newDefinitions };
}

/**
 * Extended MockedResponse type that supports variableMatcher for flexible matching,
 * delay, and dynamic newData generation.
 */
export interface IStaticMockedResponse extends MockedResponse {
  variableMatcher?: (variables: Record<string, unknown>) => boolean;
  newData?: (
    variables: Record<string, unknown>,
  ) => FetchResult | ResultFunction<FetchResult>;
  delay?: number | ((operation: Operation) => number);
}

function requestToKey(
  request: Operation | import('@apollo/client').GraphQLRequest,
  addTypename: boolean,
): string {
  const queryString =
    request.query &&
    print(addTypename ? addTypenameToDocument(request.query) : request.query);
  const requestKey = { query: queryString };
  return JSON.stringify(requestKey);
}

/**
 * Similar to the standard Apollo MockLink, but doesn't consume a mock
 * when it is used allowing it to be used in places like Storybook.
 */
export class StaticMockLink extends ApolloLink {
  public operation?: Operation;
  public addTypename = true;
  private _mockedResponsesByKey: { [key: string]: IStaticMockedResponse[] } =
    {};

  constructor(
    mockedResponses: readonly IStaticMockedResponse[],
    addTypename = true,
  ) {
    super();
    this.addTypename = addTypename;
    if (mockedResponses) {
      mockedResponses.forEach((mockedResponse) => {
        this.addMockedResponse(mockedResponse);
      });
    }
  }

  public addMockedResponse(mockedResponse: IStaticMockedResponse): void {
    const normalizedMockedResponse =
      this._normalizeMockedResponse(mockedResponse);
    const key = requestToKey(
      normalizedMockedResponse.request,
      this.addTypename,
    );
    let mockedResponses = this._mockedResponsesByKey[key];
    if (!mockedResponses) {
      mockedResponses = [];
      this._mockedResponsesByKey[key] = mockedResponses;
    }
    mockedResponses.push(normalizedMockedResponse);
  }

  public request(operation: Operation): Observable<FetchResult> {
    this.operation = operation;
    const key = requestToKey(operation, this.addTypename);
    let responseIndex = 0;
    const response = (this._mockedResponsesByKey[key] || []).find(
      (res, index) => {
        const requestVariables = operation.variables || {};
        const mockedResponseVariables = res.request.variables || {};

        // Support variableMatcher function for flexible matching
        // If matcher exists and returns true, use this mock
        // If matcher returns false, fall back to deep-equal check
        const matcher = res.variableMatcher;
        if (typeof matcher === 'function' && matcher(requestVariables)) {
          responseIndex = index;
          return true;
        }

        if (equal(requestVariables, mockedResponseVariables)) {
          responseIndex = index;
          return true;
        }
        return false;
      },
    );

    let configError: Error;

    if (!response || typeof responseIndex === 'undefined') {
      configError = new Error(
        `No more mocked responses for the query: ${print(
          operation.query,
        )}, variables: ${JSON.stringify(operation.variables)}`,
      );
    } else {
      const { newData } = response as IStaticMockedResponse;
      if (newData) {
        response.result = newData(
          operation.variables as Record<string, unknown>,
        );
        this._mockedResponsesByKey[key].push(response);
      }

      if (!response.result && !response.error) {
        configError = new Error(
          `Mocked response should contain either result or error: ${key}`,
        );
      }
    }

    const currentResponse = response as IStaticMockedResponse | undefined;

    return new Observable((observer) => {
      const delay =
        typeof currentResponse?.delay === 'function'
          ? currentResponse.delay(operation)
          : currentResponse?.delay || 0;

      const timer = setTimeout(() => {
        if (configError) {
          try {
            if (this.onError(configError, observer) !== false) {
              throw configError;
            }
          } catch (error) {
            observer.error(error);
          }
        } else if (currentResponse) {
          if (currentResponse.error) {
            observer.error(currentResponse.error);
          } else {
            if (currentResponse.result) {
              observer.next(
                typeof currentResponse.result === 'function'
                  ? (currentResponse.result as ResultFunction<FetchResult>)(
                      operation.variables,
                    )
                  : currentResponse.result,
              );
            }
            observer.complete();
          }
        }
      }, delay);

      return () => {
        clearTimeout(timer);
      };
    });
  }

  public onError(_error: Error, _observer?: unknown): boolean | void {
    return false;
  }

  private _normalizeMockedResponse(
    mockedResponse: IStaticMockedResponse,
  ): IStaticMockedResponse {
    const newMockedResponse = cloneDeep(mockedResponse);
    // cloneDeep might strip functions, so we restore the variableMatcher if it existed
    if (mockedResponse.variableMatcher) {
      newMockedResponse.variableMatcher = mockedResponse.variableMatcher;
    }
    if (mockedResponse.newData) {
      newMockedResponse.newData = mockedResponse.newData;
    }

    const queryWithoutConnection = removeConnectionDirectiveFromDocument(
      newMockedResponse.request.query,
    );
    invariant(queryWithoutConnection, 'query is required');
    newMockedResponse.request.query = queryWithoutConnection;
    const query = removeClientSetsFromDocument(newMockedResponse.request.query);
    if (query) {
      newMockedResponse.request.query = query;
    }
    return newMockedResponse;
  }
}

export interface InterfaceMockApolloLink extends ApolloLink {
  operation?: Operation;
}

// Pass in multiple mocked responses, so that you can test flows that end up
// making multiple queries to the server.
// NOTE: The last arg can optionally be an `addTypename` arg.
export function mockSingleLink(
  ...mockedResponses: (IStaticMockedResponse | boolean)[]
): InterfaceMockApolloLink {
  // To pull off the potential typename. If this isn't a boolean, we'll just
  // set it true later.
  let maybeTypename = mockedResponses[mockedResponses.length - 1];
  let mocks = mockedResponses.slice(0, mockedResponses.length - 1);

  if (typeof maybeTypename !== 'boolean') {
    mocks = mockedResponses;
    maybeTypename = true;
  }

  // Ensure mocks is of type IStaticMockedResponse[]
  return new StaticMockLink(
    mocks as IStaticMockedResponse[],
    maybeTypename as boolean,
  );
}
