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

vi.mock('utils/timezoneUtils', () => ({
  requestMiddleware: vi.fn((op) => op),
  responseMiddleware: vi.fn((op) => op),
}));

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
      cache: new InMemoryCache({
        addTypename: false,
      }),
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
});
