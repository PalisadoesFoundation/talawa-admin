import React from 'react';
import { getByTestId, getByText, render, screen } from '@testing-library/react';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';

import type { NormalizedCacheObject } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import AdvertisementEntry from './AdvertisementEntry';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BACKEND_URL } from 'Constant/constant';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';

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
describe('Testing Advertisement Entry Component', () => {
  test('Temporary test for Advertisement Entry', () => {
    const { getByTestId, getByText, getAllByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {
                <AdvertisementEntry
                  endDate={new Date()}
                  startDate={new Date()}
                  id="1"
                  key={1}
                  link="google.com"
                  name="Advert1"
                  orgId="1"
                  type="POPUP"
                />
              }
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    expect(getByTestId('AdEntry')).toBeInTheDocument();
    expect(getAllByText('POPUP')[0]).toBeInTheDocument();
    expect(getAllByText('Advert1')[0]).toBeInTheDocument();
  });
});
