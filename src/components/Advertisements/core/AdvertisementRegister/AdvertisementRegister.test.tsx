import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from '@testing-library/react';

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
import { StaticMockLink } from 'utils/StaticMockLink';
import userEvent from '@testing-library/user-event';
import useLocalStorage from 'utils/useLocalstorage';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';

const { getItem } = useLocalStorage();

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const MOCKS = [
  {
    request: {
      query: ADD_ADVERTISEMENT_MUTATION,
      variables: {
        organizationId: '1',
        name: 'Ad1',
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
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        first: 6,
        after: null,
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
            advertisements: {
              edges: [
                {
                  node: {
                    _id: '1',
                    name: 'Advertisement1',
                    startDate: '2022-01-01',
                    endDate: '2023-01-01',
                    mediaUrl: 'http://example1.com',
                  },
                  cursor: '5rdiyr3iwfhwaify',
                },
                {
                  node: {
                    _id: '2',
                    name: 'Advertisement2',
                    startDate: '2024-02-01',
                    endDate: '2025-02-01',
                    mediaUrl: 'http://example2.com',
                  },
                  cursor: '5rdiyr3iwfhwaify',
                },
              ],
              pageInfo: {
                startCursor: 'erdftgyhujkerty',
                endCursor: 'edrftgyhujikl',
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 2,
            },
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + getItem('token') || '',
  },
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

const translations = JSON.parse(
  JSON.stringify(
    i18n.getDataByLanguage('en')?.translation?.advertisement ?? null,
  ),
);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: '1' }),
}));
describe('Testing Advertisement Register Component', () => {
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
                setAfter={jest.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    await waitFor(() => {
      expect(getByText(translations.addNew)).toBeInTheDocument();
    });
  });

  test('create advertisement', async () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const { getByText, queryByText, getByLabelText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <AdvertisementRegister
                endDate={new Date()}
                startDate={new Date()}
                type="BANNER"
                name="Ad1"
                organizationId="1"
                advertisementMedia=""
                setAfter={jest.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    expect(getByText(translations.addNew)).toBeInTheDocument();

    fireEvent.click(getByText(translations.addNew));
    expect(queryByText(translations.RClose)).toBeInTheDocument();

    fireEvent.change(getByLabelText(translations.Rname), {
      target: { value: 'Ad1' },
    });
    expect(getByLabelText(translations.Rname)).toHaveValue('Ad1');

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

    await waitFor(() => {
      fireEvent.click(getByText(translations.register));
    });
    expect(toast.success).toBeCalledWith('Advertisement created successfully');
    expect(setTimeoutSpy).toHaveBeenCalled();
  });

  test('update advertisement', async () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const { getByText, queryByText, getByLabelText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <AdvertisementRegister
                endDate={new Date()}
                startDate={new Date()}
                type="BANNER"
                name="Ad1"
                organizationId="1"
                advertisementMedia=""
                setAfter={jest.fn()}
                formStatus="edit"
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    fireEvent.click(getByText(translations.edit));

    fireEvent.change(getByLabelText(translations.Rname), {
      target: { value: 'Ad1' },
    });
    expect(getByLabelText(translations.Rname)).toHaveValue('Ad1');

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

    await waitFor(() => {
      fireEvent.click(getByText(translations.saveChanges));
    });
    expect(toast.success).toBeCalledWith('Advertisement created successfully');
    expect(setTimeoutSpy).toHaveBeenCalled();
  });

  test('Logs error to the console and shows error toast when advertisement creation fails', async () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const { getByText, queryByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <AdvertisementRegister
                endDate={new Date()}
                startDate={new Date()}
                type="BANNER"
                name="Ad1"
                organizationId="1"
                advertisementMedia=""
                setAfter={jest.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    expect(getByText(translations.addNew)).toBeInTheDocument();

    fireEvent.click(getByText(translations.addNew));
    expect(queryByText(translations.RClose)).toBeInTheDocument();

    await waitFor(() => {
      fireEvent.click(getByText(translations.register));
    });
    expect(toast.error).toBeCalledWith(
      'An error occured, could not create new advertisement',
    );
    expect(setTimeoutSpy).toHaveBeenCalled();
  });

  test('Throws error when the end date is less than the start date', async () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const { getByText, queryByText, getByLabelText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <AdvertisementRegister
                endDate={new Date()}
                startDate={new Date()}
                type="BANNER"
                name="Ad1"
                organizationId="1"
                advertisementMedia=""
                setAfter={jest.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    expect(getByText(translations.addNew)).toBeInTheDocument();

    fireEvent.click(getByText(translations.addNew));
    expect(queryByText(translations.RClose)).toBeInTheDocument();

    fireEvent.change(getByLabelText(translations.Rname), {
      target: { value: 'Ad1' },
    });
    expect(getByLabelText(translations.Rname)).toHaveValue('Ad1');

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
      target: { value: '2022-02-01' },
    });
    expect(getByLabelText(translations.RendDate)).toHaveValue('2022-02-01');

    await waitFor(() => {
      fireEvent.click(getByText(translations.register));
    });
    expect(toast.error).toBeCalledWith(
      'End date must be greater than or equal to start date',
    );
    expect(setTimeoutSpy).toHaveBeenCalled();
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
                setAfter={jest.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
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
                setAfter={jest.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    await waitFor(() => {
      fireEvent.click(getByText(translations.addNew));
      expect(queryByText(translations.RClose)).toBeInTheDocument();

      fireEvent.click(getByText(translations.RClose));
      expect(queryByText(translations.close)).not.toBeInTheDocument();
    });
  });

  test('Throws error when the end date is less than the start date while editing the advertisement', async () => {
    const { getByText, getByLabelText, queryByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              {
                <AdvertisementRegister
                  formStatus="edit"
                  endDate={new Date()}
                  startDate={new Date()}
                  type="BANNER"
                  name="Advert1"
                  organizationId="1"
                  advertisementMedia="google.com"
                  setAfter={jest.fn()}
                />
              }
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    fireEvent.click(getByText(translations.edit));
    expect(queryByText(translations.editAdvertisement)).toBeInTheDocument();
    fireEvent.change(getByLabelText(translations.Rname), {
      target: { value: 'Test Advertisement' },
    });
    expect(getByLabelText(translations.Rname)).toHaveValue(
      'Test Advertisement',
    );

    const mediaFile = new File(['video content'], 'test.mp4', {
      type: 'video/mp4',
    });
    const mediaInput = screen.getByTestId('advertisementMedia');
    userEvent.upload(mediaInput, mediaFile);

    const mediaPreview = await screen.findByTestId('mediaPreview');
    expect(mediaPreview).toBeInTheDocument();

    fireEvent.change(getByLabelText(translations.Rtype), {
      target: { value: 'BANNER' },
    });
    expect(getByLabelText(translations.Rtype)).toHaveValue('BANNER');

    fireEvent.change(getByLabelText(translations.RstartDate), {
      target: { value: '2023-02-02' },
    });
    expect(getByLabelText(translations.RstartDate)).toHaveValue('2023-02-02');

    fireEvent.change(getByLabelText(translations.RendDate), {
      target: { value: '2023-01-01' },
    });
    expect(getByLabelText(translations.RendDate)).toHaveValue('2023-01-01');

    fireEvent.click(getByText(translations.saveChanges));
    await waitFor(() => {
      expect(toast.error).toBeCalledWith(
        'End date must be greater than or equal to start date',
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
                setAfter={jest.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    fireEvent.click(screen.getByText(translations.addNew));
    await screen.findByText(translations.RClose);

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
