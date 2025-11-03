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
import 'react-toastify/dist/ReactToastify.css'; // Toast notification styles
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import App from './App';
import { store } from './state/store';
import { ToastProvider, ToastContainer } from './components/Toast';
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
  return {
    headers: {
      ...headers,
      authorization: getItem('token') ? `Bearer ${getItem('token')}` : '',
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
    console.error(`[Network error]: ${networkError}`);
    // Note: Toast notifications should be handled in components after ToastProvider is mounted
    // This error link runs at Apollo Client initialization, before React renders
  }
});

const uploadLink = createUploadLink({
  uri: BACKEND_URL,
  headers: { 'Apollo-Require-Preflight': 'true' },
  credentials: 'include',
  useGETForQueries: false,
});

const wsLink = new GraphQLWsLink(
  createClient({ url: REACT_APP_BACKEND_WEBSOCKET_URL }),
);

// const wsLink = new GraphQLWsLink(
//   createClient({
//     url: 'ws://localhost:4000/subscriptions',
//   }),
// );
// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  uploadLink,
);

const combinedLink = ApolloLink.from([
  errorLink,
  authLink,
  requestMiddleware,
  responseMiddleware,
  splitLink,
]);

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
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
              <ToastProvider>
                <App />
                <ToastContainer
                  limit={5}
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={true}
                  closeOnClick={false}
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
              </ToastProvider>
            </Provider>
          </ThemeProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </ApolloProvider>
  </Suspense>,
);
