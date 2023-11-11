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
  ApolloLink,
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import App from './App';
import { store } from './state/store';
import './utils/i18n';
import {
  BACKEND_URL,
  REACT_APP_BACKEND_WEBSOCKET_URL,
} from 'Constant/constant';
import { refreshToken } from 'utils/getRefreshToken';

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => {
      if (message === 'User is not authenticated') {
        refreshToken().then((success) => {
          if (success === false) {
            alert('index');
            // localStorage.clear();
          } else {
            forward(operation);
          }
        });
      }
    });
  }
});

// const authLink = new ApolloLink((operation, forward) => {
//   const token = localStorage.getItem('token');

//   // If the token is expired or about to expire, refresh it
//   if (token) {
//     const decodedToken: any = jwtDecode(token);
//     const currentTime = Date.now().valueOf() / 1000;

//     if (decodedToken.exp < currentTime) {
//       refreshToken().then((success) => {
//         if (success) {
//           operation.setContext({
//             headers: {
//               authorization: 'Bearer ' + localStorage.getItem('token') || '',
//             },
//           });
//         } else {
//           localStorage.clear();
//         }
//       });
//     }
//   }

//   return forward(operation);
// });

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + localStorage.getItem('token') || '',
  },
});

// if didnt work use /subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: REACT_APP_BACKEND_WEBSOCKET_URL,
  })
);
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
  httpLink
);
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: errorLink.concat(splitLink),
});
const fallbackLoader = <div className="loader"></div>;

ReactDOM.render(
  <Suspense fallback={fallbackLoader}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Provider store={store}>
            <App />
            <ToastContainer limit={5} />
          </Provider>
        </LocalizationProvider>
      </BrowserRouter>
    </ApolloProvider>
  </Suspense>,
  document.getElementById('root')
);
