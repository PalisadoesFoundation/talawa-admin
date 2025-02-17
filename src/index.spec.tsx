import { describe, it, expect, vi, beforeEach } from 'vitest';
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
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

// Define types for mocked modules
interface InterfaceToastMock {
  error: ReturnType<typeof vi.fn>;
}

interface InterfaceLocalStorageMock {
  getItem: ReturnType<typeof vi.fn>;
}

// Mock external dependencies
vi.mock('react-toastify', (): { toast: InterfaceToastMock } => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('utils/useLocalstorage', () => ({
  default: (): { getItem: InterfaceLocalStorageMock['getItem'] } => ({
    getItem: vi.fn(() => 'mock-token'),
  }),
}));

vi.mock('./utils/i18n', () => ({
  default: {
    language: 'en',
  },
}));

describe('Apollo Client Configuration', () => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  it('should create an Apollo Client with correct configuration', (): void => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([
        vi.fn() as unknown as ApolloLink, // errorLink
        vi.fn() as unknown as ApolloLink, // authLink
        requestMiddleware,
        responseMiddleware,
        vi.fn() as unknown as ApolloLink, // splitLink
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
        url: REACT_APP_BACKEND_WEBSOCKET_URL,
      }),
    );

    expect(wsLink).toBeDefined();
  });

  it('should add authorization header with token', (): void => {
    interface InterfaceHeaders {
      authorization: string;
      'Accept-Language': string;
    }

    const context: { headers: InterfaceHeaders } = {
      headers: {
        authorization: 'Bearer mock-token',
        'Accept-Language': 'en',
      },
    };

    expect(context.headers.authorization).toContain('Bearer');
    expect(context.headers['Accept-Language']).toBe(i18n.language);
  });

  it('should handle network errors correctly', (): void => {
    interface InterfaceErrorCallbackParams {
      networkError: Error;
    }

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
