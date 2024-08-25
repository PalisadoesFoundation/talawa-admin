import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import type { NormalizedCacheObject } from '@apollo/client';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { onError } from '@apollo/link-error';
import './assets/css/app.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'react-datepicker/dist/react-datepicker.css';
import 'flag-icons/css/flag-icons.min.css';
import { Provider } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import App from './App';
import { store } from './state/store';
import {
  BACKEND_URL,
  REACT_APP_BACKEND_WEBSOCKET_URL,
} from 'Constant/constant';
import { refreshToken } from 'utils/getRefreshToken';
import { ThemeProvider, createTheme } from '@mui/material';
import { ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import '../src/assets/css/scrollStyles.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#31bb6b',
    },
  },
});
import useLocalStorage from 'utils/useLocalstorage';
import i18n from './utils/i18n';

const { getItem } = useLocalStorage();
const authLink = setContext((_, { headers }) => {
  const lng = i18n.language;
  return {
    headers: {
      ...headers,
      authorization: 'Bearer ' + getItem('token') || '',
      'Accept-Language': lng,
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message }) => {
        if (message === 'User is not authenticated') {
          refreshToken().then((success) => {
            if (success) {
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: 'Bearer ' + getItem('token'),
                },
              });
              return forward(operation);
            } else {
              localStorage.clear();
            }
          });
        }
      });
    } else if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      toast.error(
        'API server unavailable. Check your connection or try again later',
        {
          toastId: 'apiServer',
        },
      );
    }
  },
);

const httpLink = new HttpLink({
  uri: BACKEND_URL,
});

// if didnt work use /subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: REACT_APP_BACKEND_WEBSOCKET_URL,
  }),
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
  httpLink,
);

const combinedLink = ApolloLink.from([errorLink, authLink, splitLink]);

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: combinedLink,
});
const fallbackLoader = <div className="loader"></div>;

ReactDOM.render(
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
  document.getElementById('root'),
);
