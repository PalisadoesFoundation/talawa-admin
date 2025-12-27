import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import type { NormalizedCacheObject } from '@apollo/client';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  split,
  Observable,
  fromPromise,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { onError } from '@apollo/link-error';
import './assets/css/app.css';
import 'bootstrap/dist/js/bootstrap.min.js'; // Bootstrap JS (ensure Bootstrap is installed)
import 'react-datepicker/dist/react-datepicker.css'; // React Datepicker Styles
import 'flag-icons/css/flag-icons.min.css'; // Flag Icons Styles
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { Provider } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import App from './App';
import { store } from './state/store';
import { BACKEND_URL, BACKEND_WEBSOCKET_URL } from 'Constant/constant';
import { ThemeProvider, createTheme } from '@mui/material';
import { ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import './assets/css/scrollStyles.css';
import './style/app-fixed.module.css';
const theme = createTheme({
  palette: {
    primary: {
      main: getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-theme-color')
        .trim(),
    },
  },
});
import useLocalStorage from 'utils/useLocalstorage';
import i18n from './utils/i18n';
import { requestMiddleware, responseMiddleware } from 'utils/timezoneUtils';
import { refreshToken } from 'utils/getRefreshToken';

const { getItem, clearAllItems } = useLocalStorage();
const BEARER_PREFIX = 'Bearer ';

// In-memory access token for WebSockets (HTTP requests use cookies)
let accessToken: string | null = null;

// Track if we're currently refreshing to avoid multiple simultaneous refresh attempts
let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

const resolvePendingRequests = (): void => {
  pendingRequests.forEach((callback) => callback());
  pendingRequests = [];
};

// Language header link - auth is handled via HTTP-Only cookies (credentials: 'include')
const languageLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'Accept-Language': i18n.language,
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        const errorCode = error.extensions?.code;

        // Skip token refresh logic for authentication operations (login/signup)
        const operationName = operation.operationName;
        const authOperations = ['SignIn', 'SignUp', 'RefreshToken'];
        if (authOperations.includes(operationName)) {
          continue;
        }

        // Check for unauthenticated error (token expired)
        if (
          errorCode === 'unauthenticated' ||
          error.message === 'You must be authenticated to perform this action.'
        ) {
          // For cookie-based auth, we can attempt refresh without checking localStorage
          // The refresh token is in an HTTP-Only cookie that the browser sends automatically
          const isLoggedIn = getItem('IsLoggedIn');
          if (isLoggedIn !== 'TRUE') {
            // User is not logged in, don't try to refresh
            return;
          }

          // If already refreshing, queue this request
          if (isRefreshing) {
            return new Observable((observer) => {
              pendingRequests.push(() => {
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };
                forward(operation).subscribe(subscriber);
              });
            });
          }

          isRefreshing = true;

          return fromPromise(
            refreshToken()
              .then((token) => {
                if (token) {
                  accessToken = token;
                  resolvePendingRequests();
                  return true;
                } else {
                  // Refresh failed, clear storage and redirect
                  clearAllItems();
                  window.location.href = '/';
                  return false;
                }
              })
              .catch(() => {
                clearAllItems();
                window.location.href = '/';
                return false;
              })
              .finally(() => {
                isRefreshing = false;
              }),
          ).flatMap((success) => {
            if (success) {
              // Retry the original request - cookies are already updated by the API
              // No need to manually attach token header
              return forward(operation);
            }
            return new Observable((observer) => {
              observer.error(error);
            });
          });
        }
      }
    }

    if (networkError) {
      toast.error(
        'API server unavailable. Check your connection or try again later',
        { toastId: 'apiServer' },
      );
    }
  },
);

const uploadLink = createUploadLink({
  uri: BACKEND_URL,
  headers: { 'Apollo-Require-Preflight': 'true' },
  credentials: 'include',
  useGETForQueries: false,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: BACKEND_WEBSOCKET_URL,
    connectionParams: async () => {
      // If we don't have a token but are logged in, try to get one
      if (!accessToken && getItem('IsLoggedIn') === 'TRUE') {
        try {
          accessToken = await refreshToken();
        } catch (e) {
          console.error(
            'Failed to fetch initial access token for WebSocket',
            e,
          );
        }
      }

      const authParams = accessToken
        ? { authorization: BEARER_PREFIX + accessToken }
        : {};
      return {
        ...authParams,
        'Accept-Language': i18n.language,
      };
    },
    on: {
      // WebSocket connection events - debug logs removed for production
    },
  }),
);

// Create HTTP link with language header
// Auth is handled via HTTP-Only cookies (credentials: 'include' in uploadLink)
const httpLink = ApolloLink.from([
  languageLink,
  requestMiddleware,
  responseMiddleware,
  uploadLink,
]);

// The split function routes operations correctly
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, // WebSocket for subscriptions (auth via connectionParams)
  httpLink, // HTTP with auth headers for queries/mutations
);

// Simplified combined link
const combinedLink = ApolloLink.from([errorLink, splitLink]);

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          organization: {
            // Cache organization separately by ID
            keyArgs: ['input.id'],
            merge(existing, incoming) {
              // Merge organization fields, keeping both old and new event queries
              return {
                ...existing,
                ...incoming,
              };
            },
          },
        },
      },
      Organization: {
        fields: {
          events: {
            // Cache by date range and recurring flag only
            keyArgs: ['startDate', 'endDate', 'includeRecurring'],
            merge(_existing, incoming) {
              // Always replace with incoming data to avoid cache conflicts
              return incoming;
            },
          },
        },
      },
      // Normalize chat entities for stable references (non-breaking)
      Chat: {
        keyFields: ['id'],
      },
      ChatMessage: {
        keyFields: ['id'],
      },
    },
  }),
  link: combinedLink,
});
const fallbackLoader = <div className="loader"></div>;

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container missing in the DOM');
}
const root = createRoot(container);

root.render(
  <Suspense fallback={fallbackLoader}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <App />
              <ToastContainer limit={5} />
            </Provider>
          </ThemeProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </ApolloProvider>
  </Suspense>,
);
