import { requestMiddleware, responseMiddleware } from './dateTimeMiddleware';
import {
  gql,
  Observable,
  ApolloClient,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client';
import { createOperation } from '@apollo/client/link/utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { DocumentNode } from 'graphql';
import { describe, it, expect, vi } from 'vitest';

dayjs.extend(utc);

const mockClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.empty(),
});

const DUMMY_QUERY: DocumentNode = gql`
  query GetDummyData {
    dummyData {
      id
    }
  }
`;

function makeOperation(variables: Record<string, unknown> = {}): ApolloLink.Operation {
  return createOperation(
    { query: DUMMY_QUERY, variables },
    { client: mockClient },
  );
}

describe('Date Time Middleware Tests', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Request Middleware', () => {
    it('should convert local date and time to UTC format in request variables', () => {
      const operation = makeOperation({
        startDate: dayjs().format('YYYY-MM-DD'),
        startTime: '12:00:00',
      });

      const forward = vi.fn(
        (op) =>
          new Observable<ApolloLink.Result>((observer) => {
            expect(op.variables['startDate']).toBe(
              dayjs().format('YYYY-MM-DD'),
            );
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
      const utcDate = dayjs.utc().hour(12).minute(0).second(0).millisecond(0);
      const testResponse: ApolloLink.Result = {
        data: { createdAt: utcDate.toISOString() },
        extensions: {},
      };

      const operation = makeOperation({});

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
            expect(response.data['createdAt']).not.toBe(utcDate.toISOString());
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
      const operation = makeOperation({
        startDate: 'not-a-date',
        startTime: '25:99:99',
      });

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
      };

      const operation = makeOperation({});

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
      const today = dayjs().format('YYYY-MM-DD');
      const startDateTime = dayjs()
        .format('YYYY-MM-DD')
        .concat('T08:00:00.000Z');

      const operation = makeOperation({
        event: {
          startDate: today,
          startTime: '08:00:00',
          details: {
            endDate: today,
            endTime: '18:00:00',
            additionalInfo: {
              createdAt: startDateTime,
            },
          },
        },
      });

      const forward = vi.fn(
        (op) =>
          new Observable<ApolloLink.Result>((observer) => {
            expect(op.variables.event.startDate).toBe(today);
            expect(op.variables.event.startTime).toMatch(
              /\d{2}:\d{2}:\d{2}.\d{3}Z/,
            );
            expect(op.variables.event.details.endDate).toBe(today);
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
