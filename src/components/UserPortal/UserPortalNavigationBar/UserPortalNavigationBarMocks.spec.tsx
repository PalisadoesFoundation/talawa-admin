import type { HTMLAttributes, ReactElement } from 'react';
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

type MockIconProps = HTMLAttributes<HTMLDivElement> & {
  'data-testid'?: string;
};

describe('UserPortalNavigationBarMocks', () => {
  describe('Mock Constants', () => {
    it('should export correct string constants', () => {
      expect(typeof mockUserId).toBe('string');
      expect(mockUserId).toBeTruthy();
      expect(typeof mockUserName).toBe('string');
      expect(mockUserName).toBeTruthy();
      expect(typeof mockOrganizationId).toBe('string');
      expect(mockOrganizationId).toBeTruthy();
      expect(typeof mockOrganizationName).toBe('string');
      expect(mockOrganizationName).toBeTruthy();
    });
  });

  describe('getMockIcon factory', () => {
    it('should return the Home Icon when type is "home"', () => {
      const HomeIconComponent = getMockIcon('home');
      const element = HomeIconComponent({}) as ReactElement<MockIconProps>;

      expect(element.props['data-testid']).toBe('mock-home-icon');
      expect(element.props.children).toBe('Home Icon');
    });

    it('should return the Person Icon when type is "permIdentity"', () => {
      const PersonIconComponent = getMockIcon('permIdentity');
      const element = PersonIconComponent({
        className: 'test-class',
      } as MockIconProps) as ReactElement<MockIconProps>;

      expect(element.props.className).toBe('test-class');
      expect(element.props.children).toBe('Person Icon');
    });

    it('should handle an unrecognized icon type gracefully', () => {
      const FallbackComponent = getMockIcon(
        'unknown' as unknown as Parameters<typeof getMockIcon>[0],
      );
      expect(FallbackComponent).toBeDefined();

      const element = FallbackComponent({}) as ReactElement<MockIconProps>;
      expect(element).toBeNull();
      expect(element.props.children).toBe('Person Icon');
    });
  });

  describe('Navigation Links Mock', () => {
    it('should export an array of navigation links', () => {
      expect(mockNavigationLinksBase).toHaveLength(3);
      expect(mockNavigationLinksBase[0]).toMatchObject({
        id: expect.any(String),
        label: expect.any(String),
        path: expect.any(String),
      });
      expect(mockNavigationLinksBase[1]).toMatchObject({
        id: expect.any(String),
        label: expect.any(String),
        path: expect.any(String),
        translationKey: 'pledges.campaigns',
      });
      expect(mockNavigationLinksBase[2]).toMatchObject({
        id: expect.any(String),
        label: expect.any(String),
        path: expect.any(String),
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
      expect(organizationDataErrorMock.error).toBeDefined();
      expect(organizationDataErrorMock.error?.message).toBe(
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
      expect(logoutErrorMock.error).toBeDefined();
      expect(logoutErrorMock.error?.message).toBe('Failed to logout');
      expect(logoutErrorMock.variableMatcher()).toBe(true);
    });

    it('should export logoutNetworkErrorMock with a query, variableMatcher, and network errors array', () => {
      expect(logoutNetworkErrorMock.request.query).toBeDefined();
      expect(logoutNetworkErrorMock.result).toMatchObject({
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: expect.any(String),
            extensions: expect.objectContaining({ code: expect.any(String) }),
          }),
        ]),
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
