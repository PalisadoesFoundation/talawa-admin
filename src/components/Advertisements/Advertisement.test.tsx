import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';

import type { NormalizedCacheObject } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import Advertisement from './Advertisements';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BACKEND_URL } from 'Constant/constant';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import { ADVERTISEMENTS_GET } from 'GraphQl/Queries/Queries';

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
describe('Testing Advertisement   Component', () => {
  test('Temporary test for Advertisement', () => {
    expect(true).toBe(true);
    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<Advertisement />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    expect(getByTestId('AdEntryStore')).toBeInTheDocument();
  });

  test('renders advertisement data', async () => {
    const mocks = [
      {
        request: {
          query: ADVERTISEMENTS_GET,
          variables: {
            name: 'Test',
          },
        },
        result: {
          data: {
            getAdvertisements: [
              {
                _id: '1',
                name: 'Advertisement',
                type: 'POPUP',
                orgId: 'org1',
                link: 'http://example.com',
                endDate: new Date(),
                startDate: new Date(),
              },
              // Add more mock data if needed
            ],
          },
          loading: false,
        },
      },
    ];

    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    expect(getByTestId('AdEntryStore')).toBeInTheDocument();
  });
});
