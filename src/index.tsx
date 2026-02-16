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
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import './assets/css/app.css';
import './style/tokens/index.css';
import 'bootstrap/dist/js/bootstrap.min.js'; // Bootstrap JS (ensure Bootstrap is installed)
import 'react-datepicker/dist/react-datepicker.css'; // React Datepicker Styles
import 'flag-icons/css/flag-icons.min.css'; // Flag Icons Styles
import 'react-toastify/dist/ReactToastify.css'; // React Toastify Styles
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import App from './App';
import { store } from './state/store';
import { BACKEND_URL, BACKEND_WEBSOCKET_URL } from 'Constant/constant';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import './assets/css/scrollStyles.css';
import './style/app-fixed.module.css';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
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

if (import.meta.env.DEV) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

// Track if we're currently refreshing to avoid multiple simultaneous refresh attempts
let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

const resolvePendingRequests = (): void => {
  pendingRequests.forEach((callback) => callback());
  pendingRequests = [];
};

const authLink = setContext((_, { headers }) => {
  const lng = i18n.language;
  const token = getItem('token');
  const authHeaders = token ? { authorization: BEARER_PREFIX + token } : {};

  return {
    headers: {
      ...headers,
      ...authHeaders,
      'Accept-Language': lng,
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        const errorCode = error.extensions?.code;

        // Skip token refresh logic for authentication operations (login/signup/logout)
        const operationName = operation.operationName;
        const authOperations = ['SignIn', 'SignUp', 'RefreshToken', 'Logout'];
        if (authOperations.includes(operationName)) {
          continue;
        }

        // Check for unauthenticated error (token expired)
        if (
          errorCode === 'unauthenticated' ||
          error.message === 'You must be authenticated to perform this action.'
        ) {
          // Check if user is logged in via localStorage flag
          // (actual tokens are in HTTP-Only cookies)
          const isLoggedIn = getItem('IsLoggedIn');
          if (isLoggedIn !== 'TRUE') {
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
              .then((success) => {
                if (success) {
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
              // Retry the original request
              // No need to set headers - HTTP-Only cookies are automatically included
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
      NotificationToast.error(
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
    connectionParams: () => {
      const token = getItem('token');
      const authParams = token ? { authorization: BEARER_PREFIX + token } : {};
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

// Create HTTP link with authentication
const httpLink = ApolloLink.from([
  authLink, // Only apply to HTTP operations
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

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
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
            </Provider>
          </ThemeProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </ApolloProvider>
  </Suspense>,
);
