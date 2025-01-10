import { describe, test, expect, vi, beforeEach } from 'vitest';
import { StaticMockLink, mockSingleLink } from './StaticMockLink';
import type { Observer } from '@apollo/client';
import type { MockedResponse } from '@apollo/react-testing';
import { gql, Observable } from '@apollo/client';
import { print } from 'graphql';
import type { FetchResult } from '@apollo/client/link/core';
import { equal } from '@wry/equality';
class TestableStaticMockLink extends StaticMockLink {
  public setErrorHandler(
    handler: (error: unknown, observer?: Observer<FetchResult>) => false | void,
  ): void {
    this.onError = handler;
  }
}

const TEST_QUERY = gql`
  query TestQuery($id: ID!) {
    item(id: $id) {
      id
      name
    }
  }
`;
const mockQuery = gql`
  query TestQuery {
    test {
      id
      name
    }
  }
`;
const sampleQuery = gql`
  query SampleQuery($id: ID!) {
    user(id: $id) {
      id
      name
    }
  }
`;

const sampleResponse = {
  data: {
    user: {
      id: '1',
      name: 'Test User',
      __typename: 'User',
    },
  },
};
describe('StaticMockLink', () => {
  const sampleQuery = gql`
    query SampleQuery($id: ID!) {
      user(id: $id) {
        id
        name
      }
    }
  `;

  const sampleVariables = { id: '1' };

  const sampleResponse = {
    data: {
      user: {
        id: '1',
        name: 'John Doe',
        __typename: 'User',
      },
    },
  };

  let mockLink: StaticMockLink;

  beforeEach((): void => {
    mockLink = new StaticMockLink([], true);
  });

  test('should create instance with empty mocked responses', () => {
    expect(mockLink).toBeInstanceOf(StaticMockLink);
    expect(mockLink.addTypename).toBe(true);
  });

  test('should add mocked response', () => {
    const mockedResponse = {
      request: {
        query: sampleQuery,
        variables: sampleVariables,
      },
      result: sampleResponse,
    };

    mockLink.addMockedResponse(mockedResponse);
    // This is Mocked Response
    return new Promise<void>((resolve) => {
      const observable = mockLink.request({
        query: sampleQuery,
        variables: sampleVariables,
      });

      observable?.subscribe({
        next: (response) => {
          expect(response).toEqual(sampleResponse);
        },
        complete: () => {
          resolve();
        },
      });
    });
  });

  test('should handle delayed responses', () => {
    vi.useFakeTimers(); // Start using fake timers
    const delay = 100;
    const mockedResponse = {
      request: {
        query: sampleQuery,
        variables: sampleVariables,
      },
      result: sampleResponse,
      delay,
    };

    mockLink.addMockedResponse(mockedResponse);

    let completed = false;

    return new Promise<void>((resolve) => {
      const observable = mockLink.request({
        query: sampleQuery,
        variables: sampleVariables,
      });

      observable?.subscribe({
        next: (response) => {
          expect(response).toEqual(sampleResponse);
          completed = true;
        },
        complete: () => {
          expect(completed).toBe(true);
          resolve();
        },
        error: (error) => {
          throw error;
        },
      });

      vi.advanceTimersByTime(delay); // Advance time by the delay
    }).finally(() => {
      vi.useRealTimers(); // Restore real timers
    });
  });

  test('should handle errors in response', () => {
    const errorResponse = {
      request: {
        query: sampleQuery,
        variables: sampleVariables,
      },
      error: new Error('GraphQL Error'),
    };

    mockLink.addMockedResponse(errorResponse);

    return new Promise<void>((resolve) => {
      const observable = mockLink.request({
        query: sampleQuery,
        variables: sampleVariables,
      });

      observable?.subscribe({
        error: (error) => {
          expect(error.message).toBe('GraphQL Error');
          resolve();
        },
      });
    });
  });

  test('should handle dynamic results using newData', () => {
    const dynamicResponse = {
      request: {
        query: sampleQuery,
        variables: { id: '2' }, // Changed to match the request variables
      },
      result: sampleResponse,
      newData: (variables: { id: string }) => ({
        data: {
          user: {
            id: variables.id,
            name: `User ${variables.id}`,
            __typename: 'User',
          },
        },
      }),
    };

    mockLink.addMockedResponse(dynamicResponse);

    return new Promise<void>((resolve) => {
      const observable = mockLink.request({
        query: sampleQuery,
        variables: { id: '2' }, // Matches the request variables in mocked response
      });

      observable?.subscribe({
        next: (response) => {
          expect(response).toEqual({
            data: {
              user: {
                id: '2',
                name: 'User 2',
                __typename: 'User',
              },
            },
          });
        },
        complete: () => {
          resolve();
        },
        error: (error) => {
          // Add error handling to help debug test failures
          console.error('Test error:', error);
          throw error;
        },
      });
    });
  });
  test('should error when no matching response is found', () => {
    return new Promise<void>((resolve) => {
      const observable = mockLink.request({
        query: sampleQuery,
        variables: sampleVariables,
      });

      observable?.subscribe({
        error: (error) => {
          expect(error.message).toContain(
            'No more mocked responses for the query',
          );
          resolve();
        },
      });
    });
  });
});

describe('mockSingleLink', () => {
  test('should create StaticMockLink with default typename', () => {
    const mockedResponse = {
      request: {
        query: gql`
          query {
            hello
          }
        `,
        variables: {},
      },
      result: { data: { hello: 'world' } },
    };

    const link = mockSingleLink(mockedResponse);
    expect(link).toBeInstanceOf(StaticMockLink);
  });

  test('should create StaticMockLink with specified typename setting', () => {
    const mockedResponse = {
      request: {
        query: gql`
          query {
            hello
          }
        `,
        variables: {},
      },
      result: { data: { hello: 'world' } },
    };

    const link = mockSingleLink(mockedResponse, false);
    expect((link as StaticMockLink).addTypename).toBe(false);
  });

  test('should handle non-matching variables between request and mocked response', () => {
    const mockLink = new StaticMockLink([]);
    const mockedResponse = {
      request: {
        query: sampleQuery,
        variables: { id: '1' },
      },
      result: sampleResponse,
    };

    mockLink.addMockedResponse(mockedResponse);

    return new Promise<void>((resolve) => {
      const observable = mockLink.request({
        query: sampleQuery,
        variables: { id: '2' }, // Different variables
      });

      observable?.subscribe({
        error: (error) => {
          expect(error.message).toContain('No more mocked responses');
          resolve();
        },
      });
    });
  });

  test('should handle matching query but mismatched variable structure', () => {
    const mockLink = new StaticMockLink([]);
    const mockedResponse = {
      request: {
        query: sampleQuery,
        variables: { id: '1', extra: 'field' },
      },
      result: sampleResponse,
    };

    mockLink.addMockedResponse(mockedResponse);

    return new Promise<void>((resolve) => {
      const observable = mockLink.request({
        query: sampleQuery,
        variables: { id: '1' }, // Missing extra field
      });

      observable?.subscribe({
        error: (error) => {
          expect(error.message).toContain('No more mocked responses');
          resolve();
        },
      });
    });
  });

  test('should handle onError behavior correctly', async () => {
    const mockLink = new TestableStaticMockLink([], true);
    const handlerSpy = vi.fn().mockReturnValue(undefined); // Return undefined to trigger error throw

    mockLink.setErrorHandler(handlerSpy);

    await new Promise<void>((resolve) => {
      const observable = mockLink.request({
        query: gql`
          query TestQuery {
            field
          }
        `,
        variables: {},
      });

      observable?.subscribe({
        next: () => {
          throw new Error('Should not succeed');
        },
        error: (error) => {
          // Verify the error handler was called
          expect(handlerSpy).toHaveBeenCalledTimes(1);

          // Verify we got the expected error
          expect(error.message).toContain('No more mocked responses');

          resolve();
        },
      });
    });
  }, 10000);
  it('should throw an error if a mocked response lacks result and error', () => {
    const mockedResponses = [
      {
        request: { query: mockQuery },
        // Missing `result` and `error`
      },
    ];

    const link = new StaticMockLink(mockedResponses);

    const operation = {
      query: mockQuery,
      variables: {},
    };

    const observable = link.request(operation);

    expect(observable).toBeInstanceOf(Observable);

    // Subscribe to the observable and expect an error
    observable?.subscribe({
      next: () => {
        // This shouldn't be called
        throw new Error('next() should not be called');
      },
      error: (err) => {
        // Check the error message
        expect(err.message).toContain(
          'Mocked response should contain either result or error',
        );
      },
      complete: () => {
        // This shouldn't be called
        throw new Error('complete() should not be called');
      },
    });
  });

  it('should return undefined when no mocked response matches operation variables', () => {
    const mockedResponses = [
      {
        request: {
          query: mockQuery,
          variables: { id: '123' },
        },
        result: { data: { test: { id: '123', name: 'Test Name' } } },
      },
    ];

    const link = new StaticMockLink(mockedResponses);

    // Simulate operation with unmatched variables
    const operation = {
      query: mockQuery,
      variables: { id: '999' },
    };

    const key = JSON.stringify({
      query: link.addTypename
        ? print(mockQuery) // Add typename if necessary
        : print(mockQuery),
    });

    const mockedResponsesByKey = link['_mockedResponsesByKey'][key];

    // Emulate the internal logic
    let responseIndex = -1;
    const response = (mockedResponsesByKey || []).find((res, index) => {
      const requestVariables = operation.variables || {};
      const mockedResponseVariables = res.request.variables || {};
      if (equal(requestVariables, mockedResponseVariables)) {
        responseIndex = index;
        return true;
      }
      return false;
    });

    // Assertions
    expect(response).toBeUndefined();
    expect(responseIndex).toBe(-1);
  });

  test('should initialize with empty mocked responses array', () => {
    // Test with null/undefined
    const mockLinkNull = new StaticMockLink(
      null as unknown as readonly MockedResponse[],
    );
    expect(mockLinkNull).toBeInstanceOf(StaticMockLink);

    // Test with defined responses
    const mockResponses: readonly MockedResponse[] = [
      {
        request: {
          query: sampleQuery,
          variables: { id: '1' },
        },
        result: {
          data: {
            user: {
              id: '1',
              name: 'Test User',
              __typename: 'User',
            },
          },
        },
      },
      {
        request: {
          query: sampleQuery,
          variables: { id: '2' },
        },
        result: {
          data: {
            user: {
              id: '2',
              name: 'Test User 2',
              __typename: 'User',
            },
          },
        },
      },
    ];

    const mockLink = new StaticMockLink(mockResponses, true);

    // Verify responses were added via constructor
    const observable1 = mockLink.request({
      query: sampleQuery,
      variables: { id: '1' },
    });

    const observable2 = mockLink.request({
      query: sampleQuery,
      variables: { id: '2' },
    });

    return Promise.all([
      new Promise<void>((resolve) => {
        observable1?.subscribe({
          next: (response) => {
            expect(response?.data?.user?.id).toBe('1');
            resolve();
          },
        });
      }),
      new Promise<void>((resolve) => {
        observable2?.subscribe({
          next: (response) => {
            expect(response?.data?.user?.id).toBe('2');
            resolve();
          },
        });
      }),
    ]);
  });

  test('should handle undefined operation variables', () => {
    const mockLink = new StaticMockLink([]);
    const mockedResponse: MockedResponse = {
      request: {
        query: sampleQuery,
      },
      result: {
        data: {
          user: {
            id: '1',
            name: 'Test User',
            __typename: 'User',
          },
        },
      },
    };

    mockLink.addMockedResponse(mockedResponse);

    const observable = mockLink.request({
      query: sampleQuery,
      // Intentionally omitting variables
    });

    return new Promise<void>((resolve) => {
      observable?.subscribe({
        next: (response) => {
          expect(response?.data?.user?.id).toBe('1');
          resolve();
        },
      });
    });
  });

  test('should handle response with direct result value', async () => {
    const mockResponse: MockedResponse = {
      request: {
        query: TEST_QUERY,
        variables: { id: '1' },
      },
      result: {
        data: {
          item: {
            id: '1',
            name: 'Test Item',
            __typename: 'Item',
          },
        },
      },
    };

    const link = new StaticMockLink([mockResponse]);

    return new Promise<void>((resolve, reject) => {
      const observable = link.request({
        query: TEST_QUERY,
        variables: { id: '1' },
      });

      if (!observable) {
        reject(new Error('Observable is null'));
        return;
      }

      observable.subscribe({
        next(response) {
          expect(response).toEqual(mockResponse.result);
          resolve();
        },
        error: reject,
      });
    });
  });

  test('should handle response with result function', async () => {
    const mockResponse: MockedResponse = {
      request: {
        query: TEST_QUERY,
        variables: { id: '1' },
      },
      result: (variables: { id: string }) => ({
        data: {
          item: {
            id: variables.id,
            name: `Test Item ${variables.id}`,
            __typename: 'Item',
          },
        },
      }),
    };

    const link = new StaticMockLink([mockResponse]);

    return new Promise<void>((resolve, reject) => {
      const observable = link.request({
        query: TEST_QUERY,
        variables: { id: '1' },
      });

      if (!observable) {
        reject(new Error('Observable is null'));
        return;
      }

      observable.subscribe({
        next(response) {
          expect(response).toEqual({
            data: {
              item: {
                id: '1',
                name: 'Test Item 1',
                __typename: 'Item',
              },
            },
          });
          resolve();
        },
        error: reject,
      });
    });
  });

  test('should handle response with error', async () => {
    const testError = new Error('Test error');
    const mockResponse: MockedResponse = {
      request: {
        query: TEST_QUERY,
        variables: { id: '1' },
      },
      error: testError,
    };

    const link = new StaticMockLink([mockResponse]);

    return new Promise<void>((resolve, reject) => {
      const observable = link.request({
        query: TEST_QUERY,
        variables: { id: '1' },
      });

      if (!observable) {
        reject(new Error('Observable is null'));
        return;
      }

      observable.subscribe({
        next() {
          reject(new Error('Should not have called next'));
        },
        error(error) {
          expect(error).toBe(testError);
          resolve();
        },
      });
    });
  });

  test('should respect response delay', async () => {
    const mockResponse: MockedResponse = {
      request: {
        query: TEST_QUERY,
        variables: { id: '1' },
      },
      result: {
        data: {
          item: {
            id: '1',
            name: 'Test Item',
            __typename: 'Item',
          },
        },
      },
      delay: 50,
    };

    const link = new StaticMockLink([mockResponse]);
    const startTime = Date.now();

    return new Promise<void>((resolve, reject) => {
      const observable = link.request({
        query: TEST_QUERY,
        variables: { id: '1' },
      });

      if (!observable) {
        reject(new Error('Observable is null'));
        return;
      }

      observable.subscribe({
        next(response) {
          const elapsed = Date.now() - startTime;
          expect(elapsed).toBeGreaterThanOrEqual(50);
          expect(response).toEqual(mockResponse.result);
          resolve();
        },
        error: reject,
      });
    });
  });
});
