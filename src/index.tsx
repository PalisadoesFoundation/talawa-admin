import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import { onError } from '@apollo/link-error';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'react-datepicker/dist/react-datepicker.css';
import 'flag-icon-css/css/flag-icons.min.css';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';
import { store } from './state/store';
import './utils/i18n';
import { BACKEND_URL } from 'Constant/constant';

onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + localStorage.getItem('token') || '',
  },
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

const fallbackLoader = <div className="loader"></div>;

ReactDOM.render(
  <Suspense fallback={fallbackLoader}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
          <ToastContainer />
        </Provider>
      </BrowserRouter>
    </ApolloProvider>
  </Suspense>,
  document.getElementById('root')
);
