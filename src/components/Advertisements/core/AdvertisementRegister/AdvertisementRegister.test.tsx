import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';

import type { NormalizedCacheObject } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import AdvertisementRegister from './AdvertisementRegister';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BACKEND_URL } from 'Constant/constant';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18nForTest';

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

const translations = JSON.parse(
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
  JSON.stringify(i18n.getDataByLanguage('en')?.translation.advertisement!)
);

describe('Testing Advertisement Register Component', () => {
  test('AdvertismentRegister component loads correctly', async () => {
    const { getByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {
                <AdvertisementRegister
                  endDate={new Date()}
                  startDate={new Date()}
                  type="BANNER"
                  name="Advert1"
                  orgId="1"
                  link="google.com"
                />
              }
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    await waitFor(() => {
      expect(getByText(translations.addNew)).toBeInTheDocument();
    });
  });
  test('opens and closes modals on button click', async () => {
    const { getByText, queryByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {
                <AdvertisementRegister
                  endDate={new Date()}
                  startDate={new Date()}
                  type="BANNER"
                  name="Advert1"
                  orgId="1"
                  link="google.com"
                />
              }
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    await waitFor(() => {
      fireEvent.click(getByText(translations.addNew));
      expect(queryByText(translations.RClose)).toBeInTheDocument();

      fireEvent.click(getByText(translations.RClose));
      expect(queryByText(translations.close)).not.toBeInTheDocument();
    });
  });
  test('submits the form and shows success toast on successful advertisement creation', async () => {
    const { getByText, getByLabelText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {
                <AdvertisementRegister
                  endDate={new Date()}
                  startDate={new Date()}
                  type="BANNER"
                  name="Advert1"
                  orgId="1"
                  link="google.com"
                />
              }
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    await waitFor(() => {
      fireEvent.click(getByText(translations.addNew));

      fireEvent.change(getByLabelText(translations.Rname), {
        target: { value: 'Test Advertisement' },
      });
      fireEvent.change(getByLabelText(translations.Rlink), {
        target: { value: 'http://example.com' },
      });
      fireEvent.change(getByLabelText(translations.Rtype), {
        target: { value: 'BANNER' },
      });
      fireEvent.change(getByLabelText(translations.RstartDate), {
        target: { value: '2023-01-01' },
      });
      fireEvent.change(getByLabelText(translations.RendDate), {
        target: { value: '2023-02-01' },
      });

      fireEvent.click(getByText(translations.register));
    });
  });
});
