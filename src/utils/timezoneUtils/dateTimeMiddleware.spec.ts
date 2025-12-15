import { requestMiddleware, responseMiddleware } from './dateTimeMiddleware';
import type { ApolloLink } from '@apollo/client';
import { gql, Observable } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import { describe, it, expect, vi } from 'vitest';

const DUMMY_QUERY: DocumentNode = gql`
  query GetDummyData {
    dummyData {
      id
    }
  }
`;

describe('Date Time Middleware Tests', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Request Middleware', () => {
    it('should convert local date and time to UTC format in request variables', () => {
      const operation: ApolloLink.Operation = {
        query: DUMMY_QUERY,
        operationName: 'GetDummyData',
        variables: { startDate: '2023-09-01', startTime: '12:00:00' },
        getContext: vi.fn(() => ({})),
        setContext: vi.fn(),
        extensions: {},
      };

      const forward = vi.fn(
        (op) =>
          new Observable<ApolloLink.Result>((observer) => {
            expect(op.variables['startDate']).toBe('2023-09-01');
            expect(op.variables['startTime']).toMatch(
              /\d{2}:\d{2}:\d{2}.\d{3}Z/,
            );
            observer.complete();
          }),
      );

      const observable = requestMiddleware.request(operation, forward);
      expect(observable).not.toBeNull();
      observable?.subscribe(() => {
        expect(forward).toHaveBeenCalled();
      });
    });
  });

  describe('Response Middleware', () => {
    it('should convert UTC date and time to local format in response data', () => {
      const testResponse: ApolloLink.Result = {
        data: { createdAt: '2023-09-01T12:00:00.000Z' },
        extensions: {},
        context: {},
      };

      const operation: ApolloLink.Operation = {
        query: DUMMY_QUERY,
        operationName: 'GetDummyData',
        variables: {},
        getContext: vi.fn(() => ({})),
        setContext: vi.fn(),
        extensions: {},
      };

      const forward = vi.fn(
        () =>
          new Observable<ApolloLink.Result>((observer) => {
            observer.next(testResponse);
            observer.complete();
          }),
      );

      const observable = responseMiddleware.request(operation, forward);
      expect(observable).not.toBeNull();
      return new Promise<void>((resolve, reject) => {
        observable?.subscribe({
          next: (response: ApolloLink.Result) => {
            if (!response.data) {
              reject(new Error('Expected response.data to be defined'));
              return;
            }

            // Now it's safe to assume response.data exists for the following expectations
            expect(response.data['createdAt']).not.toBe(
              '2023-09-01T12:00:00.000Z',
            );
            resolve();
          },
          error: reject,
        });
      }).then(() => {
        expect(forward).toHaveBeenCalled();
      });
    });
  });

  describe('Date Time Middleware Edge Cases', () => {
    it('should handle invalid date formats gracefully in request middleware', () => {
      const operation: ApolloLink.Operation = {
        query: DUMMY_QUERY,
        operationName: 'GetDummyData',
        variables: { startDate: 'not-a-date', startTime: '25:99:99' },
        getContext: vi.fn(() => ({})),
        setContext: vi.fn(),
        extensions: {},
      };

      const forward = vi.fn(
        (op) =>
          new Observable<ApolloLink.Result>((observer) => {
            expect(op.variables['startDate']).toBe('not-a-date');
            expect(op.variables['startTime']).toBe('25:99:99');
            observer.complete();
          }),
      );

      const observable = requestMiddleware.request(operation, forward);
      expect(observable).not.toBeNull();
      observable?.subscribe(() => {
        expect(forward).toHaveBeenCalled();
      });
    });

    it('should not break when encountering invalid dates in response middleware', () => {
      const testResponse: ApolloLink.Result = {
        data: { createdAt: 'invalid-date-time' },
        extensions: {},
        context: {},
      };

      const operation: ApolloLink.Operation = {
        query: DUMMY_QUERY,
        operationName: 'GetDummyData',
        variables: {},
        getContext: vi.fn(() => ({})),
        setContext: vi.fn(),
        extensions: {},
      };

      const forward = vi.fn(
        () =>
          new Observable<ApolloLink.Result>((observer) => {
            observer.next(testResponse);
            observer.complete();
          }),
      );

      const observable = responseMiddleware.request(operation, forward);

      expect(observable).not.toBeNull();
      return new Promise<void>((resolve, reject) => {
        observable?.subscribe({
          next: (response: ApolloLink.Result) => {
            // Ensure there's always an assertion
            expect(response.data).toBeTruthy(); // This ensures `response.data` is defined and truthy

            if (!response.data) {
              // Explicitly throw an error if response.data is null or undefined
              reject(new Error('Expected response.data to be defined'));
              return;
            }

            // Now it's safe to assume response.data exists for the following expectations
            expect(response.data['createdAt']).toBe('invalid-date-time');
            resolve();
          },
          error: reject,
        });
      }).then(() => {
        expect(forward).toHaveBeenCalled();
      });
    });
  });

  describe('Recursive Date Conversion in Nested Objects', () => {
    it('should recursively convert date and time in deeply nested objects in request middleware', () => {
      const operation: ApolloLink.Operation = {
        query: DUMMY_QUERY,
        operationName: 'GetDummyData',
        variables: {
          event: {
            startDate: '2023-10-01',
            startTime: '08:00:00',
            details: {
              endDate: '2023-10-01',
              endTime: '18:00:00',
              additionalInfo: {
                createdAt: '2023-10-01T08:00:00.000Z',
              },
            },
          },
        },
        getContext: vi.fn(() => ({})),
        setContext: vi.fn(),
        extensions: {},
      };

      const forward = vi.fn(
        (op) =>
          new Observable<ApolloLink.Result>((observer) => {
            expect(op.variables.event.startDate).toBe('2023-10-01');
            expect(op.variables.event.startTime).toMatch(
              /\d{2}:\d{2}:\d{2}.\d{3}Z/,
            );
            expect(op.variables.event.details.endDate).toBe('2023-10-01');
            expect(op.variables.event.details.endTime).toMatch(
              /\d{2}:\d{2}:\d{2}.\d{3}Z/,
            );
            expect(op.variables.event.details.additionalInfo.createdAt).toMatch(
              /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/,
            );
            observer.complete();
          }),
      );

      const observable = requestMiddleware.request(operation, forward);
      expect(observable).not.toBeNull();
      return new Promise<void>((resolve, reject) => {
        observable?.subscribe({
          complete: resolve,
          error: reject,
        });
      }).then(() => {
        expect(forward).toHaveBeenCalled();
      });
    });
  });
});
