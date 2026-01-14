/**
 * Mock data and utilities for UserPortalNavigationBar component tests
 */

import { GET_ORGANIZATION_BASIC_DATA } from 'GraphQl/Queries/Queries';
import { LOGOUT_MUTATION } from 'GraphQl/Mutations/mutations';

/**
 * Mock user and organization IDs
 */
export const mockUserId = 'test-user-123';
export const mockUserName = 'Test User';
export const mockOrganizationId = 'org-123';
export const mockOrganizationName = 'Test Organization';

import React from 'react';

/**
 * Generic icon function (not a component definition by itself because of arguments).
 * Helper to bypass react/no-multi-comp.
 */
const GenericIcon = (
  type: 'home' | 'permIdentity',
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  if (type === 'home') {
    return React.createElement(
      'div',
      { 'data-testid': 'mock-home-icon' },
      'Home Icon',
    );
  }
  return React.createElement('div', props, 'Person Icon');
};

/**
 * Factory function to get mock icon components.
 * Uses bind to create component functions dynamically.
 */
export const getMockIcon = (type: 'home' | 'permIdentity') => {
  return GenericIcon.bind(null, type) as React.FC<
    React.HTMLAttributes<HTMLDivElement>
  >;
};

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
 * Mock GraphQL mutation for logout
 * Using variableMatcher to match any variables
 */
export const logoutMock = {
  request: {
    query: LOGOUT_MUTATION,
  },
  variableMatcher: () => true, // Match any variables
  result: {
    data: {
      logout: { success: true },
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
 * Mock GraphQL error response for logout
 * Used to test error handling during logout
 */
export const logoutErrorMock = {
  request: {
    query: LOGOUT_MUTATION,
  },
  variableMatcher: () => true, // Match any variables
  error: new Error('Failed to logout'),
};

/**
 * Mock network error for logout
 * Simulates network failure during logout
 */
export const logoutNetworkErrorMock = {
  request: {
    query: LOGOUT_MUTATION,
  },
  variableMatcher: () => true,
  result: {
    errors: [
      { message: 'Network error', extensions: { code: 'NETWORK_ERROR' } },
    ],
  },
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
