import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import type { NormalizedCacheObject } from '@apollo/client';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  split,
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
import {
  BACKEND_URL,
  REACT_APP_BACKEND_WEBSOCKET_URL,
} from 'Constant/constant';
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

const { getItem } = useLocalStorage();
const authLink = setContext((_, { headers }) => {
  const lng = i18n.language;
  const token = getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'Accept-Language': lng,
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => {
      if (message === 'You must be authenticated to perform this action.') {
        localStorage.clear();
      }
    });
  } else if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    toast.error(
      'API server unavailable. Check your connection or try again later',
      { toastId: 'apiServer' },
    );
  }
});

const uploadLink = createUploadLink({
  uri: BACKEND_URL,
  headers: { 'Apollo-Require-Preflight': 'true' },
  credentials: 'include',
  useGETForQueries: false,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: REACT_APP_BACKEND_WEBSOCKET_URL,
    connectionParams: () => {
      const token = getItem('token');
      return {
        authorization: token ? `Bearer ${token}` : '',
        'Accept-Language': i18n.language,
      };
    },
    on: {
      connected: () => console.log('WebSocket connected'),
      error: (error) => console.log('WebSocket error:', error),
      closed: (event) => console.log('WebSocket closed:', event),
      connecting: () => console.log('WebSocket connecting...'),
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
