import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ApolloError, ApolloClient } from '@apollo/client';
import { handleOAuthLogin, handleOAuthLink } from './oauthFlowHandler';
import {
  SIGN_IN_WITH_OAUTH,
  LINK_OAUTH_ACCOUNT,
} from '../../GraphQl/Mutations/mutations';
import {
  InterfaceAuthenticationPayload,
  InterfaceOAuthLinkResponse,
  OAuthProviderKey,
} from 'types/Auth/auth';
import { Iso3166Alpha2CountryCode, UserRole } from 'utils/interfaces';
import dayjs from 'dayjs';

// Mock the mutations
vi.mock('../../GraphQl/Mutations/mutations', () => ({
  SIGN_IN_WITH_OAUTH: 'SIGN_IN_WITH_OAUTH',
  LINK_OAUTH_ACCOUNT: 'LINK_OAUTH_ACCOUNT',
}));

interface InterfaceMockApolloClient {
  mutate: ReturnType<typeof vi.fn>;
}

describe('oauthFlowHandler', () => {
  let mockClient: InterfaceMockApolloClient;

  beforeEach(() => {
    mockClient = {
      mutate: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('handleOAuthLogin', () => {
    const mockProvider: OAuthProviderKey = 'GOOGLE';
    const mockAuthCode = 'mock-auth-code';
    const mockRedirectUri = 'http://localhost:3000/callback';
    const mockPayload: InterfaceAuthenticationPayload = {
      user: {
        id: '123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        role: UserRole.Regular,
        countryCode: Iso3166Alpha2CountryCode.us,
        avatarURL: 'http://example.com/avatar.jpg',
        isEmailAddressVerified: true,
      },
      authenticationToken: 'mock-authentication-token',
      refreshToken: 'mock-refresh-token',
    };

    it('should successfully handle OAuth login', async () => {
      // Arrange
      mockClient.mutate.mockResolvedValueOnce({
        data: {
          signInWithOAuth: mockPayload,
        },
        errors: undefined,
      });

      // Act
      const result = await handleOAuthLogin(
        mockClient as unknown as ApolloClient<unknown>,
        mockProvider,
        mockAuthCode,
        mockRedirectUri,
      );

      // Assert
      expect(mockClient.mutate).toHaveBeenCalledWith({
        mutation: SIGN_IN_WITH_OAUTH,
        variables: {
          input: {
            provider: mockProvider,
            authorizationCode: mockAuthCode,
            redirectUri: mockRedirectUri,
          },
        },
      });
      expect(result).toEqual(mockPayload);
    });

    it('should throw error when GraphQL errors are returned', async () => {
      // Arrange
      const mockError = new Error('Authentication failed');
      mockClient.mutate.mockResolvedValueOnce({
        data: null,
        errors: [mockError],
      });

      // Act & Assert
      await expect(
        handleOAuthLogin(
          mockClient as unknown as ApolloClient<unknown>,
          mockProvider,
          mockAuthCode,
          mockRedirectUri,
        ),
      ).rejects.toThrow('Authentication failed');

      expect(mockClient.mutate).toHaveBeenCalledWith({
        mutation: SIGN_IN_WITH_OAUTH,
        variables: {
          input: {
            provider: mockProvider,
            authorizationCode: mockAuthCode,
            redirectUri: mockRedirectUri,
          },
        },
      });
    });

    it('should throw the first error when multiple errors are returned', async () => {
      // Arrange
      const firstError = new Error('First error');
      const secondError = new Error('Second error');
      mockClient.mutate.mockResolvedValueOnce({
        data: null,
        errors: [firstError, secondError],
      });

      // Act & Assert
      await expect(
        handleOAuthLogin(
          mockClient as unknown as ApolloClient<unknown>,
          mockProvider,
          mockAuthCode,
          mockRedirectUri,
        ),
      ).rejects.toThrow('First error');
    });

    it('should handle empty errors array', async () => {
      // Arrange
      mockClient.mutate.mockResolvedValueOnce({
        data: {
          signInWithOAuth: mockPayload,
        },
        errors: [],
      });

      // Act
      const result = await handleOAuthLogin(
        mockClient as unknown as ApolloClient<unknown>,
        mockProvider,
        mockAuthCode,
        mockRedirectUri,
      );

      // Assert
      expect(result).toEqual(mockPayload);
    });

    it('should handle network errors', async () => {
      // Arrange
      const networkError = new ApolloError({
        networkError: new Error('Network error'),
      });
      mockClient.mutate.mockRejectedValueOnce(networkError);

      // Act & Assert
      await expect(
        handleOAuthLogin(
          mockClient as unknown as ApolloClient<unknown>,
          mockProvider,
          mockAuthCode,
          mockRedirectUri,
        ),
      ).rejects.toThrow(networkError);
    });

    it('should throw error when data is undefined', async () => {
      // Arrange
      mockClient.mutate.mockResolvedValueOnce({
        data: undefined,
        errors: undefined,
      });

      // Act & Assert
      await expect(
        handleOAuthLogin(
          mockClient as unknown as ApolloClient<unknown>,
          mockProvider,
          mockAuthCode,
          mockRedirectUri,
        ),
      ).rejects.toThrow(
        'OAuth login failed: No authentication data received from server',
      );
    });

    it('should throw error when signInWithOAuth is null', async () => {
      // Arrange
      mockClient.mutate.mockResolvedValueOnce({
        data: {
          signInWithOAuth: null,
        },
        errors: undefined,
      });

      // Act & Assert
      await expect(
        handleOAuthLogin(
          mockClient as unknown as ApolloClient<unknown>,
          mockProvider,
          mockAuthCode,
          mockRedirectUri,
        ),
      ).rejects.toThrow(
        'OAuth login failed: No authentication data received from server',
      );
    });
  });

  describe('handleOAuthLink', () => {
    const mockProvider: OAuthProviderKey = 'GOOGLE';
    const mockAuthCode = 'mock-auth-code';
    const mockRedirectUri = 'http://localhost:3000/callback';
    const mockLinkResponse: InterfaceOAuthLinkResponse = {
      id: '123',
      name: 'John Doe',
      emailAddress: 'john@example.com',
      isEmailAddressVerified: true,
      role: UserRole.Regular,
      oauthAccounts: [
        {
          provider: 'GOOGLE',
          email: 'john@example.com',
          linkedAt: dayjs().subtract(1, 'day').toISOString(),
          lastUsedAt: dayjs().toISOString(),
        },
      ],
    };

    it('should successfully handle OAuth account linking', async () => {
      // Arrange
      mockClient.mutate.mockResolvedValueOnce({
        data: {
          linkOAuthAccount: mockLinkResponse,
        },
        errors: undefined,
      });

      // Act
      const result = await handleOAuthLink(
        mockClient as unknown as ApolloClient<unknown>,
        mockProvider,
        mockAuthCode,
        mockRedirectUri,
      );

      // Assert
      expect(mockClient.mutate).toHaveBeenCalledWith({
        mutation: LINK_OAUTH_ACCOUNT,
        variables: {
          input: {
            provider: mockProvider,
            authorizationCode: mockAuthCode,
            redirectUri: mockRedirectUri,
          },
        },
      });
      expect(result).toEqual(mockLinkResponse);
    });

    it('should handle OAuth linking with different provider', async () => {
      // Arrange
      const githubProvider: OAuthProviderKey = 'GITHUB';
      mockClient.mutate.mockResolvedValueOnce({
        data: {
          linkOAuthAccount: mockLinkResponse,
        },
        errors: undefined,
      });

      // Act
      const result = await handleOAuthLink(
        mockClient as unknown as ApolloClient<unknown>,
        githubProvider,
        mockAuthCode,
        mockRedirectUri,
      );

      // Assert
      expect(mockClient.mutate).toHaveBeenCalledWith({
        mutation: LINK_OAUTH_ACCOUNT,
        variables: {
          input: {
            provider: githubProvider,
            authorizationCode: mockAuthCode,
            redirectUri: mockRedirectUri,
          },
        },
      });
      expect(result).toEqual(mockLinkResponse);
    });

    it('should throw error when GraphQL errors are returned', async () => {
      // Arrange
      const mockError = new Error('Account linking failed');
      mockClient.mutate.mockResolvedValueOnce({
        data: null,
        errors: [mockError],
      });

      // Act & Assert
      await expect(
        handleOAuthLink(
          mockClient as unknown as ApolloClient<unknown>,
          mockProvider,
          mockAuthCode,
          mockRedirectUri,
        ),
      ).rejects.toThrow('Account linking failed');

      expect(mockClient.mutate).toHaveBeenCalledWith({
        mutation: LINK_OAUTH_ACCOUNT,
        variables: {
          input: {
            provider: mockProvider,
            authorizationCode: mockAuthCode,
            redirectUri: mockRedirectUri,
          },
        },
      });
    });

    it('should throw the first error when multiple errors are returned', async () => {
      // Arrange
      const firstError = new Error('First linking error');
      const secondError = new Error('Second linking error');
      mockClient.mutate.mockResolvedValueOnce({
        data: null,
        errors: [firstError, secondError],
      });

      // Act & Assert
      await expect(
        handleOAuthLink(
          mockClient as unknown as ApolloClient<unknown>,
          mockProvider,
          mockAuthCode,
          mockRedirectUri,
        ),
      ).rejects.toThrow('First linking error');
    });

    it('should handle empty errors array', async () => {
      // Arrange
      mockClient.mutate.mockResolvedValueOnce({
        data: {
          linkOAuthAccount: mockLinkResponse,
        },
        errors: [],
      });

      // Act
      const result = await handleOAuthLink(
        mockClient as unknown as ApolloClient<unknown>,
        mockProvider,
        mockAuthCode,
        mockRedirectUri,
      );

      // Assert
      expect(result).toEqual(mockLinkResponse);
    });

    it('should handle network errors', async () => {
      // Arrange
      const networkError = new ApolloError({
        networkError: new Error('Network error'),
      });
      mockClient.mutate.mockRejectedValueOnce(networkError);

      // Act & Assert
      await expect(
        handleOAuthLink(
          mockClient as unknown as ApolloClient<unknown>,
          mockProvider,
          mockAuthCode,
          mockRedirectUri,
        ),
      ).rejects.toThrow(networkError);
    });

    it('should handle undefined data response', async () => {
      // Arrange
      mockClient.mutate.mockResolvedValueOnce({
        data: undefined,
        errors: undefined,
      });

      // Act & Assert
      await expect(
        handleOAuthLink(
          mockClient as unknown as ApolloClient<unknown>,
          mockProvider,
          mockAuthCode,
          mockRedirectUri,
        ),
      ).rejects.toThrow(
        'OAuth account linking failed: No response data received from server',
      );
    });

    it('should throw error when data is null', async () => {
      // Arrange
      mockClient.mutate.mockResolvedValueOnce({
        data: null,
        errors: [],
      });

      // Act & Assert
      await expect(
        handleOAuthLink(
          mockClient as unknown as ApolloClient<unknown>,
          mockProvider,
          mockAuthCode,
          mockRedirectUri,
        ),
      ).rejects.toThrow(
        'OAuth account linking failed: No response data received from server',
      );
    });
    it('should throw error when linkOAuthAccount is null', async () => {
      mockClient.mutate.mockResolvedValueOnce({
        data: { linkOAuthAccount: null },
        errors: undefined,
      });

      await expect(
        handleOAuthLink(
          mockClient as unknown as ApolloClient<unknown>,
          mockProvider,
          mockAuthCode,
          mockRedirectUri,
        ),
      ).rejects.toThrow(
        'OAuth account linking failed: No response data received from server',
      );
    });
  });
});
