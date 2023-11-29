import { print } from 'graphql';
import { equal } from '@wry/equality';
import { invariant } from 'ts-invariant';

import type { Operation, FetchResult } from '@apollo/client/link/core';
import { ApolloLink } from '@apollo/client/link/core';

import {
  Observable,
  addTypenameToDocument,
  removeClientSetsFromDocument,
  removeConnectionDirectiveFromDocument,
  cloneDeep,
} from '@apollo/client/utilities';

import type { MockedResponse, ResultFunction } from '@apollo/react-testing';

function requestToKey(request: any, addTypename: boolean): string {
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
  private _mockedResponsesByKey: { [key: string]: MockedResponse[] } = {};

  constructor(mockedResponses: readonly MockedResponse[], addTypename = true) {
    super();
    this.addTypename = addTypename;
    if (mockedResponses) {
      mockedResponses.forEach((mockedResponse) => {
        this.addMockedResponse(mockedResponse);
      });
    }
  }

  public addMockedResponse(mockedResponse: MockedResponse): void {
    const normalizedMockedResponse =
      this._normalizeMockedResponse(mockedResponse);
    const key = requestToKey(
      normalizedMockedResponse.request,
      this.addTypename
    );
    let mockedResponses = this._mockedResponsesByKey[key];
    if (!mockedResponses) {
      mockedResponses = [];
      this._mockedResponsesByKey[key] = mockedResponses;
    }
    mockedResponses.push(normalizedMockedResponse);
  }

  public request(operation: any): Observable<FetchResult> | null {
    this.operation = operation;
    const key = requestToKey(operation, this.addTypename);
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
      }
    );

    let configError: Error;

    if (!response || typeof responseIndex === 'undefined') {
      configError = new Error(
        `No more mocked responses for the query: ${print(
          operation.query
        )}, variables: ${JSON.stringify(operation.variables)}`
      );
    } else {
      const { newData } = response;
      if (newData) {
        response.result = newData();
        this._mockedResponsesByKey[key].push(response);
      }

      if (!response.result && !response.error) {
        configError = new Error(
          `Mocked response should contain either result or error: ${key}`
        );
      }
    }

    return new Observable((observer) => {
      const timer = setTimeout(() => {
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
                  ? (response.result as ResultFunction<FetchResult>)()
                  : response.result
              );
            }
            observer.complete();
          }
        }
      }, (response && response.delay) || 0);

      return () => {
        clearTimeout(timer);
      };
    });
  }

  private _normalizeMockedResponse(
    mockedResponse: MockedResponse
  ): MockedResponse {
    const newMockedResponse = cloneDeep(mockedResponse);
    const queryWithoutConnection = removeConnectionDirectiveFromDocument(
      newMockedResponse.request.query
    );
    invariant(queryWithoutConnection, 'query is required');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    newMockedResponse.request.query = queryWithoutConnection!;
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
  ...mockedResponses: any[]
): InterfaceMockApolloLink {
  // To pull off the potential typename. If this isn't a boolean, we'll just
  // set it true later.
  let maybeTypename = mockedResponses[mockedResponses.length - 1];
  let mocks = mockedResponses.slice(0, mockedResponses.length - 1);

  if (typeof maybeTypename !== 'boolean') {
    mocks = mockedResponses;
    maybeTypename = true;
  }

  return new StaticMockLink(mocks, maybeTypename);
}
