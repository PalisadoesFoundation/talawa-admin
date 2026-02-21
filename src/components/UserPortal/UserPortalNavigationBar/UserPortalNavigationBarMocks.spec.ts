import React from 'react';
import { describe, it, expect } from 'vitest';
import {
  mockUserId,
  mockUserName,
  mockOrganizationId,
  mockOrganizationName,
  getMockIcon,
  organizationDataMock,
  logoutMock,
  mockNavigationLinksBase,
  organizationDataErrorMock,
  logoutErrorMock,
  logoutNetworkErrorMock,
  organizationDataNullMock,
} from './UserPortalNavigationBarMocks';

describe('UserPortalNavigationBarMocks', () => {
  describe('Mock Constants', () => {
    it('should export correct string constants', () => {
      expect(mockUserId).toBe('test-user-123');
      expect(mockUserName).toBe('Test User');
      expect(mockOrganizationId).toBe('org-123');
      expect(mockOrganizationName).toBe('Test Organization');
    });
  });

  describe('getMockIcon factory', () => {
    type MockIconProps = React.HTMLAttributes<HTMLDivElement> & {
      'data-testid'?: string;
    };

    it('should return the Home Icon when type is "home"', () => {
      const HomeIconComponent = getMockIcon('home');
      const element = HomeIconComponent(
        {},
      ) as React.ReactElement<MockIconProps>;

      expect(element.props['data-testid']).toBe('mock-home-icon');
      expect(element.props.children).toBe('Home Icon');
    });

    it('should return the Person Icon when type is "permIdentity"', () => {
      const PersonIconComponent = getMockIcon('permIdentity');
      const element = PersonIconComponent({
        className: 'test-class',
      }) as React.ReactElement<MockIconProps>;

      expect(element.props.className).toBe('test-class');
      expect(element.props.children).toBe('Person Icon');
    });
  });

  describe('Navigation Links Mock', () => {
    it('should export an array of navigation links', () => {
      expect(mockNavigationLinksBase).toHaveLength(3);
      expect(mockNavigationLinksBase[0]).toEqual({
        id: 'home',
        label: 'Home',
        path: '/home',
      });
      expect(mockNavigationLinksBase[1]).toEqual({
        id: 'campaigns',
        label: 'Campaigns',
        path: '/campaigns',
        translationKey: 'userNavbar.campaigns',
      });
      expect(mockNavigationLinksBase[2]).toEqual({
        id: 'events',
        label: 'Events',
        path: '/events',
      });
    });
  });

  describe('GraphQL Mocks', () => {
    it('should export organizationDataMock with query and organization data', () => {
      expect(organizationDataMock.request.query).toBeDefined();
      expect(organizationDataMock.request.variables).toEqual({
        id: mockOrganizationId,
      });
      expect(organizationDataMock.result).toEqual({
        data: {
          organization: {
            id: mockOrganizationId,
            name: mockOrganizationName,
            __typename: 'Organization',
          },
        },
      });
    });

    it('should export organizationDataErrorMock with a query and an error', () => {
      expect(organizationDataErrorMock.request.query).toBeDefined();
      expect(organizationDataErrorMock.request.variables).toEqual({
        id: mockOrganizationId,
      });
      expect(organizationDataErrorMock.error.message).toBe(
        'Failed to fetch organization data',
      );
    });

    it('should export logoutMock containing a query, variableMatcher, and a successful logout result', () => {
      expect(logoutMock.request.query).toBeDefined();
      expect(logoutMock.result).toEqual({
        data: {
          logout: { success: true },
        },
      });
      expect(logoutMock.variableMatcher()).toBe(true);
    });

    it('should export logoutErrorMock with a query, variableMatcher, and error', () => {
      expect(logoutErrorMock.request.query).toBeDefined();
      expect(logoutErrorMock.error.message).toBe('Failed to logout');
      expect(logoutErrorMock.variableMatcher()).toBe(true);
    });

    it('should export logoutNetworkErrorMock with a query, variableMatcher, and network errors array', () => {
      expect(logoutNetworkErrorMock.request.query).toBeDefined();
      expect(logoutNetworkErrorMock.result).toEqual({
        errors: [
          { message: 'Network error', extensions: { code: 'NETWORK_ERROR' } },
        ],
      });
      expect(logoutNetworkErrorMock.variableMatcher()).toBe(true);
    });

    it('should export organizationDataNullMock with a query and null result', () => {
      expect(organizationDataNullMock.request.query).toBeDefined();
      expect(organizationDataNullMock.request.variables).toEqual({
        id: mockOrganizationId,
      });
      expect(organizationDataNullMock.result).toEqual({
        data: {
          organization: null,
        },
      });
    });
  });
});
