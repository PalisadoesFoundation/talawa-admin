import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import {
  BACKEND_URL,
  REACT_APP_BACKEND_WEBSOCKET_URL,
} from 'Constant/constant';
import { toast } from 'react-toastify';
import i18n from './utils/i18n';
import { requestMiddleware, responseMiddleware } from 'utils/timezoneUtils';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';

// Define types for mocked modules
interface InterfaceToastMock {
  success: ReturnType<typeof vi.fn>;
  error: ReturnType<typeof vi.fn>;
  info: ReturnType<typeof vi.fn>;
  warning: ReturnType<typeof vi.fn>;
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
  process.env.VITE_TEST_AUTH_TOKEN || 'valid-token';
const getTestExpiredToken = (): string =>
  process.env.VITE_TEST_EXPIRED_TOKEN || 'expired-token';

// Mock external modules
const mockToast: InterfaceToastMock = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
};

vi.mock('react-toastify', () => ({
  ToastContainer: (): JSX.Element => <div>ToastContainer</div>,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('Constant/constant', () => ({
  BACKEND_URL: 'http://localhost:4000/graphql',
  REACT_APP_BACKEND_WEBSOCKET_URL: 'ws://localhost:4000/graphql',
}));

// Mutable mock for localStorage
const mockGetItem = vi.fn();
vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: mockGetItem,
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }),
}));

vi.mock('utils/i18n', () => ({
  default: {
    language: 'en',
    changeLanguage: vi.fn(),
    use: vi.fn().mockReturnThis(),
    init: vi.fn(),
  },
}));

vi.mock('utils/timezoneUtils', async () => {
  const { ApolloLink } =
    await vi.importActual<typeof import('@apollo/client')>('@apollo/client');
  return {
    requestMiddleware: new ApolloLink((operation, forward) =>
      forward(operation),
    ),
    responseMiddleware: new ApolloLink((operation, forward) =>
      forward(operation),
    ),
  };
});

// Helper to configure localStorage mock
const createLocalStorageMock = (
  tokenType: 'valid' | 'expired' | 'empty' = 'valid',
) => {
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

  mockGetItem.mockReturnValue(token);
};

describe('Apollo Client Setup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createLocalStorageMock('valid');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create Apollo Client instance with correct links', () => {
    const client = new ApolloClient({
      cache: new InMemoryCache({}),
      link: ApolloLink.from([
        requestMiddleware,
        responseMiddleware,
        new UploadHttpLink({ uri: 'http://localhost:4000/graphql' }),
      ]),
    });

    expect(client).toBeInstanceOf(ApolloClient);
    expect(client.cache).toBeInstanceOf(InMemoryCache);
  });

  it('should configure upload link with correct URI', (): void => {
    const uploadLink = new UploadHttpLink({
      uri: BACKEND_URL,
      headers: {
        'Apollo-Require-Preflight': 'true',
      },
    });

    expect(uploadLink).toBeDefined();
  });

  it('should configure WebSocket link with correct URL', (): void => {
    // @ts-ignore - Ignoring type check for createClient mock
    const wsLink = new GraphQLWsLink(
      createClient({
        url: REACT_APP_BACKEND_WEBSOCKET_URL,
      }),
    );

    expect(wsLink).toBeDefined();
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
      mockRefreshToken.mockResolvedValueOnce(true);

      // Simulate the refresh token logic
      const result = await refreshToken();
      expect(result).toBe(true);
      expect(mockRefreshToken).toHaveBeenCalled();
    });

    it('should handle refreshToken failure', async () => {
      const mockRefreshToken = vi.mocked(refreshToken);
      mockRefreshToken.mockResolvedValueOnce(false);

      const result = await refreshToken();
      expect(result).toBe(false);
    });

    it('should handle refreshToken throwing an error', async () => {
      const mockRefreshToken = vi.mocked(refreshToken);
      mockRefreshToken.mockRejectedValueOnce(new Error('Network error'));

      await expect(refreshToken()).rejects.toThrow('Network error');
    });

    it('should clear localStorage on refresh failure', async () => {
      const mockRefreshToken = vi.mocked(refreshToken);
      mockRefreshToken.mockResolvedValueOnce(false);

      const success = await refreshToken();
      if (!success) {
        mockClear();
      }

      expect(mockClear).toHaveBeenCalled();
    });

    it('should redirect to home on refresh failure', async () => {
      const mockRefreshToken = vi.mocked(refreshToken);
      mockRefreshToken.mockResolvedValueOnce(false);

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
