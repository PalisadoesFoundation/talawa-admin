import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

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
// import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import { MockedProvider } from '@apollo/client/testing';
import i18n from 'utils/i18nForTest';
import { toast } from 'react-toastify';
import { ADD_ADVERTISEMENT_MUTATION } from 'GraphQl/Mutations/mutations';
import dayjs from 'dayjs';
import { StaticMockLink } from 'utils/StaticMockLink';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const MOCKS = [
  {
    request: {
      query: ADD_ADVERTISEMENT_MUTATION,
      variables: {
        orgId: '1',
        name: 'Test Advertisement',
        link: 'http://example.com',
        type: 'BANNER',
        startDate: dayjs(new Date('2023-01-01')).format('YYYY-MM-DD'),
        endDate: dayjs(new Date('2023-02-01')).format('YYYY-MM-DD'),
      },
    },
    result: {
      data: {
        createAdvertisement: {
          _id: '1',
          __typename: 'Advertisement',
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

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
  const originalLocation = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        reload: jest.fn(),
        href: 'https://example.com/page/id=1',
      },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  test('AdvertismentRegister component loads correctly in register mode', async () => {
    const { getByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
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

  test('AdvertismentRegister component loads correctly in edit mode', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              {
                <AdvertisementRegister
                  endDate={new Date()}
                  startDate={new Date()}
                  type="BANNER"
                  name="Advert1"
                  orgId="1"
                  link="google.com"
                  formStatus="edit"
                />
              }
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('editBtn')).toBeInTheDocument();
    });
  });

  test('Opens and closes modals on button click', async () => {
    const { getByText, queryByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
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

  test('Submits the form and shows success toast on successful advertisement creation', async () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    const { getByText, getByLabelText, queryByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
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
      </MockedProvider>
    );

    fireEvent.click(getByText(translations.addNew));
    expect(queryByText(translations.RClose)).toBeInTheDocument();

    fireEvent.change(getByLabelText(translations.Rname), {
      target: { value: 'Test Advertisement' },
    });
    expect(getByLabelText(translations.Rname)).toHaveValue(
      'Test Advertisement'
    );

    fireEvent.change(getByLabelText(translations.Rlink), {
      target: { value: 'http://example.com' },
    });
    expect(getByLabelText(translations.Rlink)).toHaveValue(
      'http://example.com'
    );

    fireEvent.change(getByLabelText(translations.Rtype), {
      target: { value: 'BANNER' },
    });
    expect(getByLabelText(translations.Rtype)).toHaveValue('BANNER');

    fireEvent.change(getByLabelText(translations.RstartDate), {
      target: { value: '2023-01-01' },
    });
    expect(getByLabelText(translations.RstartDate)).toHaveValue('2023-01-01');

    fireEvent.change(getByLabelText(translations.RendDate), {
      target: { value: '2023-02-01' },
    });
    expect(getByLabelText(translations.RendDate)).toHaveValue('2023-02-01');

    fireEvent.click(getByText(translations.register));
    await waitFor(() => {
      // Assert the success toast and setTimeout
      expect(toast.success).toBeCalledWith(
        'Advertisement created successfully'
      );
      expect(setTimeoutSpy).toHaveBeenCalled();
    });

    expect(queryByText(translations.close)).not.toBeInTheDocument();
  });

  test('Logs error to the console and shows error toast when advertisement creation fails', async () => {
    const { getByText, queryByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              {
                <AdvertisementRegister
                  endDateEdit={new Date()}
                  startDateEdit={new Date()}
                  typeEdit="BANNER"
                  nameEdit="Advert1"
                  orgIdEdit="1"
                  linkEdit="google.com"
                />
              }
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    fireEvent.click(getByText(translations.addNew));
    expect(queryByText(translations.RClose)).toBeInTheDocument();

    fireEvent.click(getByText(translations.register));
    await waitFor(() => {
      expect(toast.error).toBeCalledWith(
        'An error occured, could not create new advertisement'
      );
    });
  });
});
