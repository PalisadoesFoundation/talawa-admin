import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
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
import 'react-datepicker/dist/react-datepicker.css';
const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});
import { Provider } from 'react-redux';
import { store } from './state/store';

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_BACKEND_ENDPOINT,
  headers: {
    authorization: 'Bearer ' + localStorage.getItem('token') || '',
  },
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
);
