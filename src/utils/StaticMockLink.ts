import { print } from 'graphql';
import { equal } from '@wry/equality';
import { invariant } from 'ts-invariant';

import type { Operation, FetchResult } from '@apollo/client/link/core';
import { ApolloLink } from '@apollo/client/link/core';

import {
  Observable,
  removeClientSetsFromDocument,
  removeConnectionDirectiveFromDocument,
  cloneDeep,
} from '@apollo/client/utilities';

import type { MockedResponse, ResultFunction } from '@apollo/react-testing';

function requestToKey(
  request:
    | Operation
    | import('@apollo/client/core').GraphQLRequest<Record<string, unknown>>,
): string {
  const queryString = request.query && print(request.query);
  const requestKey = { query: queryString };
  return JSON.stringify(requestKey);
}

/**
 * Similar to the standard Apollo MockLink, but doesn't consume a mock
 * when it is used allowing it to be used in places like Storybook.
 */
export class StaticMockLink extends ApolloLink {
  public operation?: Operation;
  private _mockedResponsesByKey: { [key: string]: MockedResponse[] } = {};

  constructor(mockedResponses: readonly MockedResponse[]) {
    super();
    if (mockedResponses) {
      mockedResponses.forEach((mockedResponse) => {
        this.addMockedResponse(mockedResponse);
      });
    }
  }

  public addMockedResponse(mockedResponse: MockedResponse): void {
    const normalizedMockedResponse =
      this._normalizeMockedResponse(mockedResponse);
    const key = requestToKey(normalizedMockedResponse.request);
    let mockedResponses = this._mockedResponsesByKey[key];
    if (!mockedResponses) {
      mockedResponses = [];
      this._mockedResponsesByKey[key] = mockedResponses;
    }
    mockedResponses.push(normalizedMockedResponse);
  }

  public request(operation: Operation): Observable<FetchResult> | null {
    this.operation = operation;
    const key = requestToKey(operation);
    let responseIndex = 0;
    const response = (this._mockedResponsesByKey[key] || []).find(
      (res, index) => {
        const requestVariables = operation.variables || {};
        const mockedResponseVariables = res.request.variables || {};
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
      const { newData } = response;
      if (newData) {
        response.result = newData(operation.variables);
        this._mockedResponsesByKey[key].push(response);
      }

      if (!response.result && !response.error) {
        configError = new Error(
          `Mocked response should contain either result or error: ${key}`,
        );
      }
    }

    return new Observable((observer) => {
      const timer = setTimeout(
        () => {
          if (configError) {
            try {
              // The onError function can return false to indicate that
              // configError need not be passed to observer.error. For
              // example, the default implementation of onError calls
              // observer.error(configError) and then returns false to
              // prevent this extra (harmless) observer.error call.
              if (this.onError(configError, observer) !== false) {
                throw configError;
              }
            } catch (error) {
              observer.error(error);
            }
          } else if (response) {
            if (response.error) {
              observer.error(response.error);
            } else {
              if (response.result) {
                observer.next(
                  typeof response.result === 'function'
                    ? (response.result as ResultFunction<FetchResult>)(
                        operation.variables,
                      )
                    : response.result,
                );
              }
              observer.complete();
            }
          }
        },
        (response && response.delay) || 0,
      );

      return () => {
        clearTimeout(timer);
      };
    });
  }

  private _normalizeMockedResponse(
    mockedResponse: MockedResponse,
  ): MockedResponse {
    const newMockedResponse = cloneDeep(mockedResponse);
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
export function mockSingleLink(
  ...mockedResponses: MockedResponse[]
): InterfaceMockApolloLink {
  return new StaticMockLink(mockedResponses);
}
