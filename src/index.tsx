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
  HttpLink,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { onError } from '@apollo/link-error';
import './assets/css/app.css';
import './style/tokens/index.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'react-datepicker/dist/react-datepicker.css';
import 'flag-icons/css/flag-icons.min.css';

/**
 * Rationale for Apollo Client Link Migration:
 * Previously, this application used `apollo-upload-client` (createUploadLink) to handle multipart/form-data
 * for file uploads. This approach is being phased out in favor of a MinIO-based architecture.
 *
 * Current Strategy:
 * 1. `apollo-upload-client` has been replaced with the standard `HttpLink`.
 * 2. File uploads are now handled by converting files to base64-encoded strings on the client side
 * and passing them as standard GraphQL variables, or by using direct MinIO upload paths.
 *
 * Considerations:
 * - Size Limits: Base64 encoding increases payload size by ~33%. Ensure server-side body limits are adjusted.
 * - Performance: Large files may impact client-side UI responsiveness during encoding.
 * - Security: Standardize decoding and sanitization on the server for base64 inputs.
 */

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
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
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
        const operationName = operation.operationName;
        const authOperations = ['SignIn', 'SignUp', 'RefreshToken', 'Logout'];
        if (authOperations.includes(operationName)) {
          continue;
        }

        if (
          errorCode === 'unauthenticated' ||
          error.message === 'You must be authenticated to perform this action.'
        ) {
          const isLoggedIn = getItem('IsLoggedIn');
          if (isLoggedIn !== 'TRUE') {
            return;
          }

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

/**
 * Migrated from createUploadLink to HttpLink.
 * Multipart file uploads via GraphQL are no longer supported.
 */
const httpLinkInstance = new HttpLink({
  uri: BACKEND_URL,
  credentials: 'include',
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
    on: {},
  }),
);

const httpLink = ApolloLink.from([
  authLink,
  requestMiddleware,
  responseMiddleware,
  httpLinkInstance,
]);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const combinedLink = ApolloLink.from([errorLink, splitLink]);

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          organization: {
            keyArgs: ['input.id'],
            merge(existing, incoming) {
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
            keyArgs: ['startDate', 'endDate', 'includeRecurring'],
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
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
