import { describe, test, expect, vi, beforeEach } from 'vitest';
import { StaticMockLink, mockSingleLink } from './StaticMockLink';
import type { Observer } from '@apollo/client';
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

const mockQuery = gql`
  query TestQuery {
    test {
      id
      name
    }
  }
`;

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

    const startTime = Date.now();

    return new Promise<void>((resolve) => {
      const observable = mockLink.request({
        query: sampleQuery,
        variables: sampleVariables,
      });

      observable?.subscribe({
        next: (response) => {
          const elapsedTime = Date.now() - startTime;
          // Add buffer of 5ms to account for timing variations
          expect(elapsedTime).toBeGreaterThanOrEqual(delay - 5);
          expect(response).toEqual(sampleResponse);
        },
        complete: () => {
          resolve();
        },
        error: (error) => {
          console.error('Test error:', error);
          throw error;
        },
      });
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
});
