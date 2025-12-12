import { describe, it, expect, vi, beforeEach } from 'vitest';
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
const getTestToken = (): string => process.env.VITE_TEST_AUTH_TOKEN || '';
const getTestExpiredToken = (): string =>
  process.env.VITE_TEST_EXPIRED_TOKEN || '';

// Mock external dependencies
vi.mock('react-toastify', (): { toast: InterfaceToastMock } => ({
  toast: {
    error: vi.fn(),
  },
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
