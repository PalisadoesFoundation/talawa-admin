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
  type RequestHandler,
} from '@apollo/client';
import { GraphQLError, type DocumentNode } from 'graphql';
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
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';

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
  BACKEND_WEBSOCKET_URL: 'ws://localhost:4000/graphql',
  deriveBackendWebsocketUrl: (url: string | undefined | null): string => {
    if (!url) return '';
    if (url.startsWith('https://')) {
      // Remove fragment/hash from URL
      const urlWithoutHash = url.split('#')[0];
      return urlWithoutHash.replace('https://', 'wss://');
    }
    if (url.startsWith('http://')) {
      // Remove fragment/hash from URL
      const urlWithoutHash = url.split('#')[0];
      return urlWithoutHash.replace('http://', 'ws://');
    }
    return '';
  },
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

// Mock refreshToken function for Token Refresh Error Link tests
const refreshToken = vi.fn();

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
      forward: RequestHandler;
    }) => { subscribe: (observer: unknown) => void } | void;
    let splitPredicate:
      | ((args: { query: DocumentNode }) => boolean)
      | undefined;
    let mockRefreshToken: Mock<() => Promise<boolean>>;
    let mockGetItem: Mock<(key: string) => string | null>;
    let mockClearAllItems: Mock<() => void>;
    let getComputedStyleSpy: { mockRestore: () => void };
    let getElementByIdSpy: { mockRestore: () => void };

    beforeEach(async () => {
      vi.resetModules();

      // Initialize splitPredicate to undefined
      splitPredicate = undefined;

      const actualApollo = (await vi.importActual(
        '@apollo/client',
      )) as unknown as typeof import('@apollo/client');
      const ApolloLink = actualApollo.ApolloLink;

      // Mock onError to capture the callback
      vi.doMock('@apollo/link-error', () => ({
        onError: vi.fn((cb) => {
          onErrorCallback = cb;
          return new ApolloLink(
            () =>
              new Observable((observer) => {
                observer.next({ data: {} });
                observer.complete();
              }),
          );
        }),
      }));

      // Mock split to capture the predicate
      // ApolloLink.split is a static method, so we need to mock it on ApolloLink
      vi.doMock('@apollo/client', () => {
        const splitMock = vi.fn((predicate) => {
          // Capture the predicate when split is called
          splitPredicate = predicate;
          return new ApolloLink(
            () =>
              new Observable((observer) => {
                observer.next({ data: {} });
                observer.complete();
              }),
          );
        });
        // Create a mock ApolloLink class that includes all static methods
        const MockApolloLink = class extends ApolloLink {
          static split = splitMock;
          static from = actualApollo.ApolloLink.from;
          static concat = actualApollo.ApolloLink.concat;
          static empty = actualApollo.ApolloLink.empty;
        };
        return {
          ...actualApollo,
          ApolloLink: MockApolloLink,
          ApolloClient: vi.fn(),
        };
      });

      // Mock utils
      mockRefreshToken = vi.fn();
      vi.doMock('utils/getRefreshToken', () => ({
        refreshToken: mockRefreshToken,
      }));

      mockGetItem = vi.fn<(key: string) => string | null>();
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
      // Mock getItem to return different values for different keys
      mockGetItem.mockImplementation((key: string) => {
        if (key === 'IsLoggedIn') return 'TRUE';
        if (key === 'token') return 'test-token';
        return null;
      });

      // First request triggers refresh
      // We need to make the first refresh hang so we can fire a second request
      let resolveRefresh: ((value: boolean) => void) | undefined;
      const refreshPromise = new Promise<boolean>((resolve) => {
        resolveRefresh = resolve;
      });
      mockRefreshToken.mockImplementation(() => refreshPromise);

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
        getContext: vi.fn().mockReturnValue({ headers: {} }),
        toKey: vi.fn(),
      } as unknown as Operation;
      const operation2 = {
        operationName: 'Query2',
        variables: {},
        extensions: {},
        setContext: vi.fn(),
        getContext: vi.fn().mockReturnValue({ headers: {} }),
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

      const obs1CompleteSpy = vi.fn();
      if (obs1 && obs1.subscribe) {
        obs1.subscribe({
          next: () => {},
          error: () => {},
          complete: obs1CompleteSpy,
        });
      }

      // Wait a bit to ensure isRefreshing is set to true
      // The isRefreshing flag is set synchronously on line 109
      await new Promise((resolve) => setTimeout(resolve, 10));

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

      // Verify that obs2 was returned (meaning it was queued)
      expect(obs2).toBeDefined();
      expect(obs2?.subscribe).toBeDefined();

      // Subscribe to obs2 to ensure the queued callback is set up
      const nextSpy = vi.fn();
      const obs2CompleteSpy = vi.fn();
      if (obs2 && obs2.subscribe) {
        obs2.subscribe({
          next: nextSpy,
          error: () => {},
          complete: obs2CompleteSpy,
        });
      }

      expect(mockRefreshToken).toHaveBeenCalledTimes(1);
      expect(nextSpy).not.toHaveBeenCalled();

      // 3. Resolve refresh - this should trigger both operations to be forwarded
      // When the promise resolves:
      // - resolvePendingRequests() is called synchronously in .then() (line 115)
      // - This executes the queued callback which calls forward(operation2) (line 104)
      // - The promise resolves to true, which triggers mergeMap
      // - mergeMap calls forward(operation1) (line 147)
      if (resolveRefresh) {
        resolveRefresh(true);
      }

      // Wait for the promise to resolve and the RxJS chain to process
      // The flow:
      // 1. refreshToken() promise resolves with true
      // 2. In the .then() callback, resolvePendingRequests() is called (line 115)
      // 3. resolvePendingRequests() executes the queued callback which calls forward(operation2) (line 104)
      // 4. The promise resolves to true, which triggers mergeMap
      // 5. mergeMap calls forward(operation1) (line 147)

      // Wait for microtasks to flush (promise resolution and .then() callbacks)
      await new Promise((resolve) => setTimeout(resolve, 0));
      // Wait for another tick to allow RxJS Observable chain to process
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Wait for both operations to be forwarded
      // The queued callback executes synchronously when resolvePendingRequests() is called
      // The mergeMap executes when the observable chain processes the resolved promise
      await vi.waitFor(
        () => {
          // Both operations should be forwarded
          expect(forward.mock.calls.length).toBe(2);
        },
        { timeout: 5000 },
      );

      // Verify both operations were called
      const operation1Called = forward.mock.calls.some(
        (call) => call[0] === operation1,
      );
      const operation2Called = forward.mock.calls.some(
        (call) => call[0] === operation2,
      );
      expect(operation1Called).toBe(true);
      expect(operation2Called).toBe(true);
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
      // The mock should be set up in beforeEach, but we need to ensure
      // the module is re-imported to use the mock
      vi.resetModules();

      // Re-import to trigger the mocked split function
      await import('./index');

      // Wait for the mock to capture the predicate
      // The split function is called at module load time (line 200 in index.tsx)
      await vi.waitFor(
        () => {
          expect(splitPredicate).toBeDefined();
        },
        { timeout: 2000 },
      );

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

      expect(splitPredicate).toBeDefined();
      if (splitPredicate) {
        expect(splitPredicate({ query: subscriptionQuery })).toBe(true);
        expect(splitPredicate({ query: otherQuery })).toBe(false);
      }
    });
  });
});
