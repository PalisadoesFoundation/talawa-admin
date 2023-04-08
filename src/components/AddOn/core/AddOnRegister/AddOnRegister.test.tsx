import React from 'react';
import { act, render, screen } from '@testing-library/react';
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
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + localStorage.getItem('token') || '',
  },
});

async function wait(ms = 500) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});
describe('Testing AddOnRegister', () => {
  const props = {
    id: '6234d8bf6ud937ddk70ecc5c9',
  };

  test('should render modal and take info to add plugin for registered organization', async () => {
    await act(async () => {
      render(
        <ApolloProvider client={client}>
          <Provider store={store}>
            <BrowserRouter>
              <I18nextProvider i18n={i18nForTest}>
                {<AddOnRegister {...props} />}
              </I18nextProvider>
            </BrowserRouter>
          </Provider>
        </ApolloProvider>
      );

      await wait(100);

      userEvent.click(screen.getByRole('button', { name: /Add New/i }));
      userEvent.type(screen.getByPlaceholderText(/Ex: Donations/i), 'myplugin');
      userEvent.type(
        screen.getByPlaceholderText(/This Plugin enables UI for/i),
        'test description'
      );
      userEvent.type(
        screen.getByPlaceholderText(/Ex: john Doe/i),
        'test creator'
      );
    });
  });
});
