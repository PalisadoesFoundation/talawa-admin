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
import userEvent from '@testing-library/user-event';
import AdvertisementEntry from '../AdvertisementEntry/AdvertisementEntry';

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
        organizationId: '1',
        name: 'Test Advertisement',
        type: 'BANNER',
        startDate: '2023-01-01',
        endDate: '2023-02-01',
        file: 'data:image/png;base64,bWVkaWEgY29udGVudA==',
      },
    },
    result: {
      data: {
        createAdvertisement: {
          _id: '1',
          advertisement: null,
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
              <AdvertisementRegister
                endDate={new Date()}
                startDate={new Date()}
                type="BANNER"
                name="Advert1"
                organizationId="1"
                advertisementMedia="test.png"
              />
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
              <AdvertisementRegister
                endDate={new Date()}
                startDate={new Date()}
                type="BANNER"
                name="Advert1"
                organizationId="1"
                advertisementMedia="google.com"
                formStatus="edit"
              />
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
              <AdvertisementRegister
                endDate={new Date()}
                startDate={new Date()}
                type="BANNER"
                name="Advert1"
                organizationId="1"
                advertisementMedia="test.png"
              />
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
              <AdvertisementRegister
                endDate={new Date()}
                startDate={new Date()}
                type="BANNER"
                name="Advert1"
                organizationId="undefined"
                advertisementMedia="data:image/png;base64,bWVkaWEgY29udGVudA=="
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await waitFor(async () => {
      fireEvent.click(getByText(translations.addNew));
      expect(queryByText(translations.RClose)).toBeInTheDocument();

      fireEvent.change(getByLabelText(translations.Rname), {
        target: { value: 'Test Advertisement' },
      });
      expect(getByLabelText(translations.Rname)).toHaveValue(
        'Test Advertisement'
      );

      const mediaFile = new File(['media content'], 'test.png', {
        type: 'image/png',
      });

      const mediaInput = getByLabelText(translations.Rmedia);
      fireEvent.change(mediaInput, {
        target: {
          files: [mediaFile],
        },
      });

      const mediaPreview = await screen.findByTestId('mediaPreview');
      expect(mediaPreview).toBeInTheDocument();

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

      expect(toast.success).toBeCalledWith(
        'Advertisement created successfully'
      );
      expect(setTimeoutSpy).toHaveBeenCalled();
    });

    expect(queryByText(translations.close)).not.toBeInTheDocument();
  });

  test('advertisement update', async () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    const { getByLabelText, queryByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <AdvertisementEntry
                endDate={new Date()}
                startDate={new Date()}
                type="POPUP"
                name="Advert1"
                organizationId="1"
                mediaUrl=""
                id="1"
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await waitFor(async () => {
      const optionsButton = screen.getByTestId('moreiconbtn');
      fireEvent.click(optionsButton);
      fireEvent.click(screen.getByTestId('editBtn'));

      fireEvent.change(screen.getByLabelText('Enter name of Advertisement'), {
        target: { value: 'Updated Advertisement' },
      });

      expect(getByLabelText(translations.Rname)).toHaveValue(
        'Updated Advertisement'
      );

      const mediaFile = new File(['media content'], 'test.png', {
        type: 'image/png',
      });

      const mediaInput = getByLabelText(translations.Rmedia);
      fireEvent.change(mediaInput, {
        target: {
          files: [mediaFile],
        },
      });

      const mediaPreview = await screen.findByTestId('mediaPreview');
      expect(mediaPreview).toBeInTheDocument();

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

      fireEvent.click(screen.getByTestId('addonupdate'));

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
              <AdvertisementRegister
                endDateEdit={new Date()}
                startDateEdit={new Date()}
                typeEdit="BANNER"
                nameEdit="Advert1"
                orgIdEdit="1"
                advertisementMediaEdit="google.com"
              />
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

  test('Media preview renders correctly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <AdvertisementRegister
                endDate={new Date()}
                startDate={new Date()}
                type="BANNER"
                name="Advert1"
                organizationId="1"
                advertisementMedia="test.mp4"
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    fireEvent.click(screen.getByText(translations.addNew));
    await waitFor(() => screen.getByText(translations.RClose));

    const mediaFile = new File(['video content'], 'test.mp4', {
      type: 'video/mp4',
    });
    const mediaInput = screen.getByTestId('advertisementMedia');
    userEvent.upload(mediaInput, mediaFile);

    const mediaPreview = await screen.findByTestId('mediaPreview');
    expect(mediaPreview).toBeInTheDocument();

    const closeButton = await screen.findByTestId('closePreview');
    fireEvent.click(closeButton);
    expect(mediaPreview).not.toBeInTheDocument();
  });
});
