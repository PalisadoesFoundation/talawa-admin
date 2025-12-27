/**
 * Mock data and utilities for UserPortalNavigationBar component tests
 */

import { GET_ORGANIZATION_BASIC_DATA } from 'GraphQl/Queries/Queries';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';

/**
 * Mock user and organization IDs
 */
export const mockUserId = 'test-user-123';
export const mockUserName = 'Test User';
export const mockOrganizationId = 'org-123';
export const mockOrganizationName = 'Test Organization';

/**
 * Mock GraphQL response for fetching organization basic data
 */
export const organizationDataMock = {
  request: {
    query: GET_ORGANIZATION_BASIC_DATA,
    variables: { id: mockOrganizationId },
  },
  result: {
    data: {
      organization: {
        id: mockOrganizationId,
        name: mockOrganizationName,
        __typename: 'Organization',
      },
    },
  },
};

/**
 * Mock GraphQL mutation for revoking refresh token
 * Using variableMatcher to match any refresh token string
 */
export const revokeRefreshTokenMock = {
  request: {
    query: REVOKE_REFRESH_TOKEN,
  },
  variableMatcher: () => true, // Match any variables
  result: {
    data: {
      revokeRefreshToken: true,
    },
  },
};

/**
 * Base mock navigation links for testing (without onClick handlers)
 * Tests can add vi.fn() onClick handlers as needed
 */
export const mockNavigationLinksBase = [
  {
    id: 'home',
    label: 'Home',
    path: '/home',
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    path: '/campaigns',
    translationKey: 'userNavbar.campaigns',
  },
  {
    id: 'events',
    label: 'Events',
    path: '/events',
  },
];

/**
 * Mock GraphQL error response for fetching organization basic data
 * Used to test error handling when organization query fails
 */
export const organizationDataErrorMock = {
  request: {
    query: GET_ORGANIZATION_BASIC_DATA,
    variables: { id: mockOrganizationId },
  },
  error: new Error('Failed to fetch organization data'),
};

/**
 * Mock GraphQL error response for revoking refresh token
 * Used to test error handling during logout
 */
export const revokeRefreshTokenErrorMock = {
  request: {
    query: REVOKE_REFRESH_TOKEN,
  },
  variableMatcher: () => true, // Match any variables
  error: new Error('Failed to revoke refresh token'),
};

/**
 * Mock network error for revoking refresh token
 * Simulates network failure during logout
 */
export const revokeRefreshTokenNetworkErrorMock = {
  request: {
    query: REVOKE_REFRESH_TOKEN,
  },
  variableMatcher: () => true,
  error: new Error('Network error'),
};

/**
 * Mock GraphQL null data response for organization query
 * Used to test fallback behavior when data is null
 */
export const organizationDataNullMock = {
  request: {
    query: GET_ORGANIZATION_BASIC_DATA,
    variables: { id: mockOrganizationId },
  },
  result: {
    data: {
      organization: null,
    },
  },
};
