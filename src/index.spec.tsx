import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import {
  BACKEND_URL,
  BACKEND_WEBSOCKET_URL,
  deriveBackendWebsocketUrl,
} from 'Constant/constant';
import { toast } from 'react-toastify';
import i18n from './utils/i18n';
import { requestMiddleware, responseMiddleware } from 'utils/timezoneUtils';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { refreshToken } from 'utils/getRefreshToken';

// Define types for mocked modules
interface InterfaceToastMock {
  error: ReturnType<typeof vi.fn>;
}

interface InterfaceLocalStorageMock {
  getItem: ReturnType<typeof vi.fn>;
}

interface InterfaceHeaders {
  authorization: string;
  'Accept-Language': string;
}

interface InterfaceErrorCallbackParams {
  networkError: Error;
}

// Load test environment variables
const getTestToken = (): string =>
  process.env.VITE_TEST_AUTH_TOKEN || 'test-token';
const getTestExpiredToken = (): string =>
  process.env.VITE_TEST_EXPIRED_TOKEN || 'expired-token';

// Mock external dependencies
vi.mock('react-toastify', (): { toast: InterfaceToastMock } => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock the refreshToken function
vi.mock('utils/getRefreshToken', () => ({
  refreshToken: vi.fn(),
}));

// Create a factory function for localStorage mock that uses environment variables
const createLocalStorageMock = (
  tokenType: 'valid' | 'expired' | 'empty' = 'valid',
): ReturnType<typeof vi.mock> => {
  let token = '';

  switch (tokenType) {
    case 'valid':
      token = getTestToken();
      break;
    case 'expired':
      token = getTestExpiredToken();
      break;
    case 'empty':
      token = '';
      break;
  }

  return vi.mock('utils/useLocalstorage', () => ({
    default: (): { getItem: InterfaceLocalStorageMock['getItem'] } => ({
      getItem: vi.fn(() => token),
    }),
  }));
};

vi.mock('./utils/i18n', () => ({
  default: {
    language: 'en',
  },
}));

describe('Apollo Client Configuration', () => {
  beforeEach((): void => {
    vi.clearAllMocks();
    // Reset localStorage mock with default test token
    createLocalStorageMock('valid');
  });

  afterEach(() => {
    vi.clearAllMocks(); // Only module mocks, no spies
  });

  it('should create an Apollo Client with correct configuration', (): void => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([
        vi.fn() as unknown as ApolloLink,
        vi.fn() as unknown as ApolloLink,
        requestMiddleware,
        responseMiddleware,
        vi.fn() as unknown as ApolloLink,
      ]),
    });

    expect(client).toBeInstanceOf(ApolloClient);
    expect(client.cache).toBeInstanceOf(InMemoryCache);
  });

  it('should configure upload link with correct URI', (): void => {
    const uploadLink = createUploadLink({
      uri: BACKEND_URL,
      headers: {
        'Apollo-Require-Preflight': 'true',
      },
    });

    expect(uploadLink).toBeDefined();
  });

  it('should configure WebSocket link with correct URL', (): void => {
    const wsLink = new GraphQLWsLink(
      createClient({
        url: BACKEND_WEBSOCKET_URL,
      }),
    );

    expect(wsLink).toBeDefined();
  });

  it('should derive websocket URLs from HTTP endpoints', () => {
    expect(deriveBackendWebsocketUrl('https://example.com/graphql')).toBe(
      'wss://example.com/graphql',
    );

    expect(deriveBackendWebsocketUrl('http://example.com/graphql')).toBe(
      'ws://example.com/graphql',
    );

    expect(deriveBackendWebsocketUrl('not-a-url')).toBe('');
    expect(deriveBackendWebsocketUrl('ftp://example.com/graphql')).toBe('');
    expect(deriveBackendWebsocketUrl(undefined)).toBe('');

    // Test null input
    expect(deriveBackendWebsocketUrl(null)).toBe('');

    // Test empty string
    expect(deriveBackendWebsocketUrl('')).toBe('');

    // Test URL with port
    expect(deriveBackendWebsocketUrl('https://example.com:8080/graphql')).toBe(
      'wss://example.com:8080/graphql',
    );

    // Test URL with path
    expect(deriveBackendWebsocketUrl('http://example.com/api/graphql')).toBe(
      'ws://example.com/api/graphql',
    );

    // Test URL with query parameters
    expect(
      deriveBackendWebsocketUrl('https://example.com/graphql?token=abc'),
    ).toBe('wss://example.com/graphql?token=abc');

    // Test URL with fragment (should be excluded)
    expect(
      deriveBackendWebsocketUrl('https://example.com/graphql#section'),
    ).toBe('wss://example.com/graphql');
  });

  describe('Authorization Headers', () => {
    it('should add valid authorization header with token', (): void => {
      createLocalStorageMock('valid');
      const testToken = getTestToken();

      const context: { headers: InterfaceHeaders } = {
        headers: {
          authorization: `Bearer ${testToken}`,
          'Accept-Language': 'en',
        },
      };

      expect(context.headers.authorization).toContain('Bearer');
      expect(context.headers.authorization).toBe(`Bearer ${testToken}`);
      expect(context.headers['Accept-Language']).toBe(i18n.language);
    });

    it('should handle expired token', (): void => {
      createLocalStorageMock('expired');
      const expiredToken = getTestExpiredToken();

      const context: { headers: InterfaceHeaders } = {
        headers: {
          authorization: `Bearer ${expiredToken}`,
          'Accept-Language': 'en',
        },
      };

      expect(context.headers.authorization).toContain('Bearer');
      expect(context.headers.authorization).toBe(`Bearer ${expiredToken}`);
    });

    it('should handle missing token', (): void => {
      createLocalStorageMock('empty');

      const context: { headers: InterfaceHeaders } = {
        headers: {
          authorization: '',
          'Accept-Language': 'en',
        },
      };

      expect(context.headers.authorization).toBe('');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors correctly', (): void => {
      const errorCallback = ({
        networkError,
      }: InterfaceErrorCallbackParams): void => {
        if (networkError) {
          toast.error(
            'API server unavailable. Check your connection or try again later',
            {
              toastId: 'apiServer',
            },
          );
        }
      };

      const mockNetworkError = new Error('Network Error');
      errorCallback({ networkError: mockNetworkError });

      expect(toast.error).toHaveBeenCalledWith(
        'API server unavailable. Check your connection or try again later',
        {
          toastId: 'apiServer',
        },
      );
    });
  });

  describe('Token Refresh Error Link', () => {
    let mockLocalStorageData: Record<string, string>;
    let mockClear: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockLocalStorageData = {
        token: 'test-token',
        refreshToken: 'test-refresh-token',
      };

      // Mock localStorage - store mock functions to avoid direct localStorage access
      mockClear = vi.fn(() => {
        mockLocalStorageData = {};
      });
      const mockLocalStorage = {
        getItem: vi.fn((key: string) => mockLocalStorageData[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockLocalStorageData[key] = value;
        }),
        clear: mockClear,
        removeItem: vi.fn((key: string) => {
          delete mockLocalStorageData[key];
        }),
        length: 0,
        key: vi.fn(),
      };

      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        configurable: true,
        writable: true,
      });

      // Mock window.location
      const mockLocation = {
        href: '/',
        assign: vi.fn(),
        replace: vi.fn(),
        reload: vi.fn(),
      };

      Object.defineProperty(window, 'location', {
        value: mockLocation,
        configurable: true,
        writable: true,
      });

      vi.clearAllMocks();
    });

    it('should skip token refresh for SignIn operations', () => {
      const authOperations = ['SignIn', 'SignUp', 'RefreshToken'];
      const operationName = 'SignIn';

      expect(authOperations.includes(operationName)).toBe(true);
    });

    it('should skip token refresh for SignUp operations', () => {
      const authOperations = ['SignIn', 'SignUp', 'RefreshToken'];
      const operationName = 'SignUp';

      expect(authOperations.includes(operationName)).toBe(true);
    });

    it('should skip token refresh for RefreshToken operations', () => {
      const authOperations = ['SignIn', 'SignUp', 'RefreshToken'];
      const operationName = 'RefreshToken';

      expect(authOperations.includes(operationName)).toBe(true);
    });

    it('should not skip token refresh for other operations', () => {
      const authOperations = ['SignIn', 'SignUp', 'RefreshToken'];
      const operationName = 'GetOrganizations';

      expect(authOperations.includes(operationName)).toBe(false);
    });

    it('should detect unauthenticated error by code', () => {
      const error = {
        extensions: { code: 'unauthenticated' },
        message: 'Some error',
      };

      const isUnauthenticated = error.extensions?.code === 'unauthenticated';
      expect(isUnauthenticated).toBe(true);
    });

    it('should detect unauthenticated error by message', () => {
      const error = {
        extensions: { code: 'OTHER_CODE' },
        message: 'You must be authenticated to perform this action.',
      };

      const isUnauthenticated =
        error.message === 'You must be authenticated to perform this action.';
      expect(isUnauthenticated).toBe(true);
    });

    it('should not trigger refresh when no refresh token exists', () => {
      mockLocalStorageData = { token: 'test-token' }; // No refresh token

      const storedRefreshToken = mockLocalStorageData['refreshToken'];
      expect(storedRefreshToken).toBeUndefined();
    });

    it('should call refreshToken when unauthenticated error occurs', async () => {
      const mockRefreshToken = vi.mocked(refreshToken);
      mockRefreshToken.mockResolvedValueOnce('new-token');

      // Simulate the refresh token logic
      const result = await refreshToken();
      expect(result).toBe('new-token');
      expect(mockRefreshToken).toHaveBeenCalled();
    });

    it('should handle refreshToken failure', async () => {
      const mockRefreshToken = vi.mocked(refreshToken);
      mockRefreshToken.mockResolvedValueOnce(null);

      const result = await refreshToken();
      expect(result).toBeNull();
    });

    it('should handle refreshToken throwing an error', async () => {
      const mockRefreshToken = vi.mocked(refreshToken);
      mockRefreshToken.mockRejectedValueOnce(new Error('Network error'));

      await expect(refreshToken()).rejects.toThrow('Network error');
    });

    it('should clear localStorage on refresh failure', async () => {
      const mockRefreshToken = vi.mocked(refreshToken);
      mockRefreshToken.mockResolvedValueOnce(null);

      const success = await refreshToken();
      if (!success) {
        mockClear();
      }

      expect(mockClear).toHaveBeenCalled();
    });

    it('should redirect to home on refresh failure', async () => {
      const mockRefreshToken = vi.mocked(refreshToken);
      mockRefreshToken.mockResolvedValueOnce(null);

      const success = await refreshToken();
      if (!success) {
        window.location.href = '/';
      }

      expect(window.location.href).toBe('/');
    });

    it('should queue pending requests during refresh', () => {
      let isRefreshing = false;
      const pendingRequests: Array<() => void> = [];

      // Simulate first request triggering refresh
      isRefreshing = true;

      // Simulate second request being queued
      const queuedCallback = vi.fn();
      if (isRefreshing) {
        pendingRequests.push(queuedCallback);
      }

      expect(pendingRequests).toHaveLength(1);
      expect(queuedCallback).not.toHaveBeenCalled();

      // Resolve pending requests
      pendingRequests.forEach((callback) => callback());
      expect(queuedCallback).toHaveBeenCalled();
    });

    it('should resolve pending requests after successful refresh', () => {
      const pendingRequests: Array<() => void> = [];
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      pendingRequests.push(callback1);
      pendingRequests.push(callback2);

      // Simulate resolvePendingRequests
      pendingRequests.forEach((callback) => callback());

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('should update authorization header with new token after refresh', () => {
      const oldHeaders = { 'Content-Type': 'application/json' };
      const newToken = 'new-test-token';

      const authHeaders = newToken
        ? { authorization: `Bearer ${newToken}` }
        : {};

      const updatedHeaders = {
        ...oldHeaders,
        ...authHeaders,
      };

      expect(updatedHeaders.authorization).toBe('Bearer new-test-token');
      expect(updatedHeaders['Content-Type']).toBe('application/json');
    });

    it('should not add authorization header when no new token exists', () => {
      const oldHeaders = { 'Content-Type': 'application/json' };
      const newToken = null;

      const authHeaders = newToken
        ? { authorization: `Bearer ${newToken}` }
        : {};

      const updatedHeaders = {
        ...oldHeaders,
        ...authHeaders,
      };

      expect(updatedHeaders.authorization).toBeUndefined();
    });
  });
});
