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
    userEvent.click(screen.getByRole('button', { name: /addnew/i }));
    userEvent.type(screen.getByPlaceholderText(/pName/i), 'myplugin');
    userEvent.type(screen.getByPlaceholderText(/pDesc/i), 'test description');
    userEvent.type(screen.getByPlaceholderText(/cName/i), 'test creator');
    userEvent.click(screen.getByTestId('addonregister'));
    userEvent.click(screen.getByTestId('addonclose'));

    expect(screen.getByPlaceholderText(/pName/i)).toHaveValue('myplugin');
    expect(screen.getByPlaceholderText(/pDesc/i)).toHaveValue(
      'test description'
    );
    expect(screen.getByPlaceholderText(/cName/i)).toHaveValue('test creator');
  });
});
