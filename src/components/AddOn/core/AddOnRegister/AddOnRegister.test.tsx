import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddOnRegister from './AddOnRegister';
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
import { BrowserRouter } from 'react-router-dom';
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
describe('Testing AddOnRegister', () => {
  const props = {
    id: '6234d8bf6ud937ddk70ecc5c9',
  };

  test('should render modal and take info to add plugin for registered organization', () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>{<AddOnRegister {...props} />}</BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    userEvent.click(screen.getByRole('button', { name: /add new/i }));
    userEvent.type(screen.getByPlaceholderText('Ex. Donations'), 'myplugin');
    userEvent.type(
      screen.getByPlaceholderText('Ex. This plugin provides UI for ....'),
      'test description'
    );
    userEvent.type(
      screen.getByPlaceholderText('Ex. Mr John Doe'),
      'test creator'
    );
    userEvent.click(screen.getByTestId('addonregister'));
    userEvent.click(screen.getByTestId('addonclose'));

    expect(screen.getByPlaceholderText('Ex. Donations')).toHaveValue(
      'myplugin'
    );
    expect(
      screen.getByPlaceholderText('Ex. This plugin provides UI for ....')
    ).toHaveValue('test description');
    expect(screen.getByPlaceholderText('Ex. Mr John Doe')).toHaveValue(
      'test creator'
    );
  });
});
