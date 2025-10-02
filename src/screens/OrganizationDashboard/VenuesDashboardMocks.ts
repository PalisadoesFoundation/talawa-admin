/**
 * Mock data for venue-specific dashboard scenarios.
 *
 * This file contains comprehensive mock responses for testing venue-related
 * pagination edge cases and error scenarios in the organization dashboard.
 *
 * @remarks
 * These mocks are designed to test:
 * - Pagination edge cases (hasNextPage states)
 * - Empty result sets
 * - Inconsistent pagination states
 * - Error handling for venue queries
 */

import { MockedResponse } from '@apollo/client/testing';
import { GET_ORGANIZATION_VENUES_PG } from 'GraphQl/Queries/Queries';

/**
 * Mock for pagination scenario with more pages available and valid cursor.
 */
export const VENUES_PAGINATION_MOCK: MockedResponse = {
  request: {
    query: GET_ORGANIZATION_VENUES_PG,
    variables: { id: 'orgId', first: 32, after: 'venueCursor2' },
  },
  result: {
    data: {
      organization: {
        venues: {
          edges: [
            {
              node: {
                id: 'venue3',
                name: 'Auditorium',
                description: 'Large presentation space',
                capacity: 500,
                attachments: [
                  {
                    url: 'https://example.com/auditorium.jpg',
                    mimeType: 'image/jpeg',
                  },
                ],
                createdAt: '2025-09-03T00:00:00.000Z',
                updatedAt: '2025-09-07T00:00:00.000Z',
              },
              cursor: 'venueCursor3',
            },
            {
              node: {
                id: 'venue4',
                name: 'Workshop Room',
                description: 'Interactive learning space',
                capacity: 30,
                attachments: [],
                createdAt: '2025-09-04T00:00:00.000Z',
                updatedAt: '2025-09-08T00:00:00.000Z',
              },
              cursor: 'venueCursor4',
            },
          ],
          pageInfo: { hasNextPage: true, endCursor: 'venueCursor4' },
        },
      },
    },
  },
};

/**
 * Mock for inconsistent pagination state - hasNextPage true but null cursor.
 * This tests error handling for malformed pagination responses.
 */
export const VENUES_INCONSISTENT_PAGINATION_MOCK: MockedResponse = {
  request: {
    query: GET_ORGANIZATION_VENUES_PG,
    variables: { id: 'orgId', first: 32, after: 'invalidCursor' },
  },
  result: {
    data: {
      organization: {
        venues: {
          edges: [
            {
              node: {
                id: 'venue5',
                name: 'Library Corner',
                description: 'Quiet study space',
                capacity: 15,
                attachments: [],
                createdAt: '2025-09-05T00:00:00.000Z',
                updatedAt: '2025-09-09T00:00:00.000Z',
              },
              cursor: 'venueCursor5',
            },
          ],
          pageInfo: { hasNextPage: true, endCursor: null },
        },
      },
    },
  },
};

/**
 * Mock for empty venues result set.
 * Tests UI behavior when no venues are available for pagination.
 */
export const VENUES_EMPTY_RESULT_MOCK: MockedResponse = {
  request: {
    query: GET_ORGANIZATION_VENUES_PG,
    variables: { id: 'emptyOrgId', first: 32, after: null },
  },
  result: {
    data: {
      organization: {
        venues: {
          edges: [],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
    },
  },
};

/**
 * Combined array of all venue-specific edge-case mocks.
 * Use this for comprehensive venue pagination testing.
 */
export const VENUES_EDGE_CASE_MOCKS: MockedResponse[] = [
  VENUES_PAGINATION_MOCK,
  VENUES_INCONSISTENT_PAGINATION_MOCK,
  VENUES_EMPTY_RESULT_MOCK,
];
