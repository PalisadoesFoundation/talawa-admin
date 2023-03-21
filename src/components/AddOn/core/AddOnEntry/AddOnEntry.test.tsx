import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
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
import { BACKEND_URL } from 'Constant/constant';

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

describe('Testing AddOnEntry', () => {
  const props = {
    id: 'string',
    enabled: true,
    title: 'title',
    description: 'description',
    createdBy: 'created',
    component: 'string',
    installed: true,
    configurable: true,
    modified: true,
    isInstalled: true,
    getInstalledPlugins: () => {
      return { sample: 'sample' };
    },
  };

  test('should render plugin info and button', () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>{<AddOnEntry {...props} />}</BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    expect(screen.getByTestId('AddOnEntry')).toBeInTheDocument();
    expect(screen.getByLabelText('enable')).toBeEnabled();
    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();
    expect(screen.getByText(props.createdBy)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText(/uninstall/i)).toBeInTheDocument();
    expect(screen.getByText(/install/i)).toBeInTheDocument();


  });
});
