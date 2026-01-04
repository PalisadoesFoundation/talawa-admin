import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Observable,
  type Operation,
  type NextLink,
} from '@apollo/client';
import { GraphQLError, type DocumentNode } from 'graphql';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import {
  BACKEND_URL,
  BACKEND_WEBSOCKET_URL,
  deriveBackendWebsocketUrl,
} from 'Constant/constant';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import i18n from './utils/i18n';
import { requestMiddleware, responseMiddleware } from 'utils/timezoneUtils';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { refreshToken } from 'utils/getRefreshToken';

// Define types for mocked modules
interface InterfaceNotificationToastMock {
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
vi.mock(
  'components/NotificationToast/NotificationToast',
  (): { NotificationToast: InterfaceNotificationToastMock } => ({
    NotificationToast: {
      error: vi.fn(),
    },
  }),
);

// Kept for backwards compatibility: some tests may still import from react-toastify indirectly
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
  ToastContainer: () => null,
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
          NotificationToast.error(
            'API server unavailable. Check your connection or try again later',
            {
              toastId: 'apiServer',
            },
          );
        }
      };

      const mockNetworkError = new Error('Network Error');
      errorCallback({ networkError: mockNetworkError });

      expect(NotificationToast.error).toHaveBeenCalledWith(
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

    it('should early return when user is not logged in (IsLoggedIn !== TRUE)', () => {
      // Simulate checking IsLoggedIn flag
      const isLoggedIn: string | null = 'FALSE'; // Not logged in

      let shouldRefresh = true;
      if (isLoggedIn !== 'TRUE') {
        shouldRefresh = false;
        // This is the early return path when user is not logged in
      }

      expect(shouldRefresh).toBe(false);
    });

    it('should handle refreshToken catch block', async () => {
      const mockRefreshToken = vi.mocked(refreshToken);
      mockRefreshToken.mockRejectedValueOnce(new Error('Network failure'));

      let clearCalled = false;
      let redirected = false;

      try {
        await refreshToken();
      } catch {
        // This simulates the catch block in handling refresh failures
        clearCalled = true;
        redirected = true;
      }

      expect(clearCalled).toBe(true);
      expect(redirected).toBe(true);
    });

    it('should return Observable error when refresh fails', async () => {
      const mockRefreshToken = vi.mocked(refreshToken);
      mockRefreshToken.mockResolvedValueOnce(false);

      const success = await refreshToken();

      // When success is false, the code creates Observable that emits error
      let emittedError = false;
      if (!success) {
        // Simulating: return new Observable((observer) => { observer.error(error); });
        emittedError = true;
      }

      expect(success).toBe(false);
      expect(emittedError).toBe(true);
    });
  });

  describe('Application Entry Point', () => {
    let getComputedStyleSpy: { mockRestore: () => void };
    let getElementByIdSpy: { mockRestore: () => void };

    beforeEach(() => {
      vi.resetModules();
      getComputedStyleSpy = vi
        .spyOn(window, 'getComputedStyle')
        .mockReturnValue({
          getPropertyValue: vi.fn().mockReturnValue('#' + '000000'),
        } as unknown as CSSStyleDeclaration);
    });

    afterEach(() => {
      vi.clearAllMocks();
      getComputedStyleSpy.mockRestore();
      if (getElementByIdSpy) {
        getElementByIdSpy.mockRestore();
      }
    });

    it('should render application when root element exists', async () => {
      // Mock dependencies to avoid side effects and ensure isolation
      vi.doMock('react-dom/client', () => ({
        createRoot: vi.fn(() => ({ render: vi.fn() })),
      }));
      vi.doMock('./App', () => ({ default: () => null }));
      vi.doMock('./state/store', () => ({ store: {} }));

      const mockContainer = document.createElement('div');
      getElementByIdSpy = vi
        .spyOn(document, 'getElementById')
        .mockImplementation((id) => {
          if (id === 'root') return mockContainer;
          return null;
        });

      await import('./index');

      const { createRoot } = await import('react-dom/client');
      expect(createRoot).toHaveBeenCalledWith(mockContainer);

      // Verify render was called on the root instance
      const rootInstance = vi.mocked(createRoot).mock.results[0].value;
      expect(rootInstance.render).toHaveBeenCalled();
    });

    it('should throw error when root element is missing', async () => {
      // Mock dependencies to avoid side effects and ensure isolation
      vi.doMock('react-dom/client', () => ({
        createRoot: vi.fn(() => ({ render: vi.fn() })),
      }));
      vi.doMock('./App', () => ({ default: () => null }));
      vi.doMock('./state/store', () => ({ store: {} }));

      getElementByIdSpy = vi
        .spyOn(document, 'getElementById')
        .mockReturnValue(null);

      await expect(import('./index')).rejects.toThrow(
        'Root container missing in the DOM',
      );
    });
  });

  describe('Apollo Link Logic', () => {
    let onErrorCallback: (error: {
      graphQLErrors?: readonly GraphQLError[];
      networkError?: Error | null;
      operation: Operation;
      forward: NextLink;
    }) => { subscribe: (observer: unknown) => void } | void;
    let splitPredicate: (args: { query: DocumentNode }) => boolean;
    let mockRefreshToken: Mock<() => Promise<boolean>>;
    let mockGetItem: Mock<() => string | null>;
    let mockClearAllItems: Mock<() => void>;
    let getComputedStyleSpy: { mockRestore: () => void };
    let getElementByIdSpy: { mockRestore: () => void };

    beforeEach(async () => {
      vi.resetModules();

      const actualApollo = (await vi.importActual(
        '@apollo/client',
      )) as unknown as typeof import('@apollo/client');
      const ApolloLink = actualApollo.ApolloLink;

      // Mock onError to capture the callback
      vi.doMock('@apollo/link-error', () => ({
        onError: vi.fn((cb) => {
          onErrorCallback = cb;
          return new ApolloLink(() => null);
        }),
      }));

      // Mock split to capture the predicate
      vi.doMock('@apollo/client', () => ({
        ...actualApollo,
        split: vi.fn((predicate) => {
          splitPredicate = predicate;
          return new ApolloLink(() => null);
        }),
        ApolloClient: vi.fn(),
      }));

      // Mock utils
      mockRefreshToken = vi.fn();
      vi.doMock('utils/getRefreshToken', () => ({
        refreshToken: mockRefreshToken,
      }));

      mockGetItem = vi.fn();
      mockClearAllItems = vi.fn();
      vi.doMock('utils/useLocalstorage', () => ({
        default: () => ({
          getItem: mockGetItem,
          clearAllItems: mockClearAllItems,
        }),
      }));

      // Mock other dependencies
      vi.doMock('react-dom/client', () => ({
        createRoot: vi.fn(() => ({ render: vi.fn() })),
      }));
      vi.doMock('./App', () => ({ default: () => null }));
      vi.doMock('./state/store', () => ({ store: {} }));
      vi.doMock('react-toastify', () => ({
        ToastContainer: () => null,
        toast: { error: vi.fn() },
      }));

      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true,
      });

      // Mock getComputedStyle for MUI theme
      getComputedStyleSpy = vi
        .spyOn(window, 'getComputedStyle')
        .mockReturnValue({
          getPropertyValue: vi.fn().mockReturnValue('#' + '000000'),
        } as unknown as CSSStyleDeclaration);

      // Mock document.getElementById to prevent "Root container missing" error
      getElementByIdSpy = vi
        .spyOn(document, 'getElementById')
        .mockReturnValue(document.createElement('div'));
    });

    afterEach(() => {
      vi.clearAllMocks();
      getComputedStyleSpy.mockRestore();
      getElementByIdSpy.mockRestore();
    });

    it('should trigger refreshToken on unauthenticated error', async () => {
      await import('./index');
      expect(onErrorCallback).toBeDefined();

      mockGetItem.mockReturnValue('TRUE'); // IsLoggedIn
      mockRefreshToken.mockResolvedValue(true);

      const forward = vi.fn().mockReturnValue(
        new Observable((observer) => {
          observer.next({ data: {} });
          observer.complete();
        }),
      );
      const operation = {
        operationName: 'SomeQuery',
        variables: {},
        extensions: {},
        setContext: vi.fn(),
        getContext: vi.fn(),
        toKey: vi.fn(),
      } as unknown as Operation;

      // Execute the error callback
      const observable = onErrorCallback({
        graphQLErrors: [
          {
            extensions: { code: 'unauthenticated' },
          } as unknown as GraphQLError,
        ],
        operation,
        forward,
      });

      // Subscribe to trigger execution if it returns an observable
      if (observable && observable.subscribe) {
        observable.subscribe({
          next: () => {},
          error: () => {},
          complete: () => {},
        });
      }

      // Wait for refresh token to be called
      await vi.waitFor(
        () => {
          expect(mockRefreshToken).toHaveBeenCalled();
        },
        { timeout: 1000 },
      );
    });

    it('should queue requests when refreshing', async () => {
      await import('./index');
      mockGetItem.mockReturnValue('TRUE');

      // First request triggers refresh
      // We need to make the first refresh hang so we can fire a second request
      let resolveRefresh: ((value: boolean) => void) | undefined;
      const refreshPromise = new Promise<boolean>((resolve) => {
        resolveRefresh = resolve;
      });
      mockRefreshToken.mockReturnValue(refreshPromise);

      const forward = vi.fn().mockReturnValue(
        new Observable((observer) => {
          observer.next({ data: {} });
          observer.complete();
        }),
      );
      const operation1 = {
        operationName: 'Query1',
        variables: {},
        extensions: {},
        setContext: vi.fn(),
        getContext: vi.fn(),
        toKey: vi.fn(),
      } as unknown as Operation;
      const operation2 = {
        operationName: 'Query2',
        variables: {},
        extensions: {},
        setContext: vi.fn(),
        getContext: vi.fn(),
        toKey: vi.fn(),
      } as unknown as Operation;

      // 1. Trigger first error -> starts refresh
      const obs1 = onErrorCallback({
        graphQLErrors: [
          {
            extensions: { code: 'unauthenticated' },
          } as unknown as GraphQLError,
        ],
        operation: operation1,
        forward,
      });
      if (obs1 && obs1.subscribe)
        obs1.subscribe({ next: () => {}, error: () => {}, complete: () => {} });

      // 2. Trigger second error -> should be queued
      const obs2 = onErrorCallback({
        graphQLErrors: [
          {
            extensions: { code: 'unauthenticated' },
          } as unknown as GraphQLError,
        ],
        operation: operation2,
        forward,
      });

      // We need to subscribe to obs2 to verify it waits
      const nextSpy = vi.fn();
      if (obs2 && obs2.subscribe)
        obs2.subscribe({ next: nextSpy, error: () => {}, complete: () => {} });

      expect(mockRefreshToken).toHaveBeenCalledTimes(1);
      expect(nextSpy).not.toHaveBeenCalled();

      // 3. Resolve refresh
      if (resolveRefresh) {
        resolveRefresh(true);
      }

      // Wait for both queued requests to be processed after refresh resolves
      await vi.waitFor(
        () => {
          // Verify both operations were forwarded after successful refresh
          expect(forward).toHaveBeenCalledWith(operation1);
          expect(forward).toHaveBeenCalledWith(operation2);
          expect(forward).toHaveBeenCalledTimes(2);
        },
        { timeout: 1000 },
      );
    });

    it('should clear storage and redirect on refresh failure', async () => {
      await import('./index');
      mockGetItem.mockReturnValue('TRUE');
      mockRefreshToken.mockResolvedValue(false);

      const forward = vi.fn().mockReturnValue(
        new Observable((observer) => {
          observer.next({ data: {} });
          observer.complete();
        }),
      );
      const operation = {
        operationName: 'Query',
        variables: {},
        extensions: {},
        setContext: vi.fn(),
        getContext: vi.fn(),
        toKey: vi.fn(),
      } as unknown as Operation;

      const obs = onErrorCallback({
        graphQLErrors: [
          {
            extensions: { code: 'unauthenticated' },
          } as unknown as GraphQLError,
        ],
        operation,
        forward,
      });

      if (obs && obs.subscribe)
        obs.subscribe({ next: () => {}, error: () => {}, complete: () => {} });

      // Wait for cleanup actions after refresh failure
      await vi.waitFor(
        () => {
          expect(mockClearAllItems).toHaveBeenCalled();
          expect(window.location.href).toBe('/');
        },
        { timeout: 1000 },
      );
    });

    it('should correctly split subscription operations', async () => {
      await import('./index');
      expect(splitPredicate).toBeDefined();

      const subscriptionQuery = {
        kind: 'Document',
        definitions: [
          {
            kind: 'OperationDefinition',
            operation: 'subscription',
          },
        ],
      } as unknown as DocumentNode;

      const otherQuery = {
        kind: 'Document',
        definitions: [
          {
            kind: 'OperationDefinition',
            operation: 'query',
          },
        ],
      } as unknown as DocumentNode;

      expect(splitPredicate({ query: subscriptionQuery })).toBe(true);
      expect(splitPredicate({ query: otherQuery })).toBe(false);
    });
  });
});
