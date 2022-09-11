import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AddOnEntry from './AddOnEntry';
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import { Provider } from 'react-redux';
import { store } from 'state/store';
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

describe('Testing AddOnEntry', () => {
  const props = {
    id: 'string',
    enabled: true,
    title: 'string',
    description: 'string',
    createdBy: 'string',
    component: 'string',
    installed: true,
    configurable: true,
    modified: true,
    isInstalled: true,
    getInstalledPlugins: () => {
      return { sample: 'sample' };
    },
  };

  test('should render modal and take info to add plugin for registered organization', () => {
    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>{<AddOnEntry {...props} />}</BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    expect(getByTestId('AddOnEntry')).toBeInTheDocument();
  });
});
