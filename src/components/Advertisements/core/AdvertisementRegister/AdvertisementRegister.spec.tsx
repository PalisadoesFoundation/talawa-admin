import React, { act } from 'react';
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
import { StaticMockLink } from 'utils/StaticMockLink';
import userEvent from '@testing-library/user-event';
import useLocalStorage from 'utils/useLocalstorage';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import { vi } from 'vitest';

const { getItem } = useLocalStorage();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orgId: '1' }),
    useNavigate: vi.fn(),
  };
});

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
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

vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: vi.fn().mockReturnValue('token'),
  }),
}));

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

// const client: ApolloClient<any> = new ApolloClient({
//   cache: new InMemoryCache(),
//   link,
// });

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.advertisement ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

describe('Testing Advertisement Register Component', () => {
  test('AdvertismentRegister component loads correctly in register mode', async () => {
    const { getByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <AdvertisementRegister
                endDateEdit={new Date()}
                startDateEdit={new Date()}
                typeEdit="BANNER"
                nameEdit="Advert1"
                orgIdEdit="1"
                advertisementMediaEdit=""
                setAfter={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    await waitFor(() => {
      expect(getByText(translations.createAdvertisement)).toBeInTheDocument();
    });
  });

  test('create advertisement', async () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <Provider store={store}>
            <BrowserRouter>
              <I18nextProvider i18n={i18n}>
                <AdvertisementRegister
                  endDateEdit={new Date()}
                  startDateEdit={new Date()}
                  typeEdit="BANNER"
                  nameEdit="Ad1"
                  orgIdEdit="1"
                  advertisementMediaEdit=""
                  setAfter={vi.fn()}
                />
              </I18nextProvider>
            </BrowserRouter>
          </Provider>
        </MockedProvider>,
      );
    });

    expect(
      screen.getByText(translations.createAdvertisement),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(translations.createAdvertisement));
    });

    expect(screen.queryByText(translations.addNew)).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rname), {
        target: { value: 'Ad1' },
      });

      const mediaFile = new File(['media content'], 'test.png', {
        type: 'image/png',
      });

      fireEvent.change(screen.getByLabelText(translations.Rmedia), {
        target: {
          files: [mediaFile],
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rtype), {
        target: { value: 'BANNER' },
      });

      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: '2023-01-01' },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: '2023-02-01' },
      });
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue('Ad1');
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('BANNER');
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      '2023-01-01',
    );
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      '2023-02-01',
    );

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Advertisement created successfully.',
      );
      expect(setTimeoutSpy).toHaveBeenCalled();
    });
    vi.useRealTimers();
  });

  test('update advertisement', async () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <Provider store={store}>
            <BrowserRouter>
              <I18nextProvider i18n={i18n}>
                <AdvertisementRegister
                  endDateEdit={new Date()}
                  startDateEdit={new Date()}
                  typeEdit="BANNER"
                  nameEdit="Ad1"
                  orgIdEdit="1"
                  advertisementMediaEdit=""
                  setAfter={vi.fn()}
                  formStatus="edit"
                />
              </I18nextProvider>
            </BrowserRouter>
          </Provider>
        </MockedProvider>,
      );
    });

    await waitFor(() => {
      expect(screen.getByText(translations.edit)).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText(translations.edit));
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rname), {
        target: { value: 'Ad1' },
      });

      const mediaFile = new File(['media content'], 'test.png', {
        type: 'image/png',
      });

      fireEvent.change(screen.getByLabelText(translations.Rmedia), {
        target: {
          files: [mediaFile],
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rtype), {
        target: { value: 'BANNER' },
      });

      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: '2023-01-01' },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: '2023-02-01' },
      });
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue('Ad1');
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('BANNER');
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      '2023-01-01',
    );
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      '2023-02-01',
    );

    await act(async () => {
      fireEvent.click(screen.getByText(translations.saveChanges));
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Advertisement created successfully.',
      );
      expect(setTimeoutSpy).toHaveBeenCalled();
    });

    vi.useRealTimers();
  });

  test('Logs error to the console and shows error toast when advertisement creation fails', async () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    const toastErrorSpy = vi.spyOn(toast, 'error');

    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <Provider store={store}>
            <BrowserRouter>
              <I18nextProvider i18n={i18n}>
                <AdvertisementRegister
                  endDateEdit={new Date()}
                  startDateEdit={new Date()}
                  typeEdit="BANNER"
                  nameEdit="Ad1"
                  orgIdEdit="1"
                  advertisementMediaEdit=""
                  setAfter={vi.fn()}
                />
              </I18nextProvider>
            </BrowserRouter>
          </Provider>
        </MockedProvider>,
      );
    });

    expect(
      screen.getByText(translations.createAdvertisement),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(translations.createAdvertisement));
    });

    expect(screen.queryByText(translations.addNew)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        `An error occurred. Couldn't create advertisement`,
      );
    });

    expect(setTimeoutSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });

  test('Throws error when the end date is less than the start date', async () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    const { getByText, queryByText, getByLabelText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <AdvertisementRegister
                endDateEdit={new Date()}
                startDateEdit={new Date()}
                typeEdit="BANNER"
                nameEdit="Ad1"
                orgIdEdit="1"
                advertisementMediaEdit=""
                setAfter={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    expect(getByText(translations.createAdvertisement)).toBeInTheDocument();

    fireEvent.click(getByText(translations.createAdvertisement));
    expect(queryByText(translations.addNew)).toBeInTheDocument();

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
    expect(toast.error).toHaveBeenCalledWith(
      'End Date should be greater than or equal to Start Date',
    );
    expect(setTimeoutSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });

  test('AdvertismentRegister component loads correctly in edit mode', async () => {
    render(
      <ApolloProvider client={client}>
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
                formStatus="edit"
                setAfter={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('editBtn')).toBeInTheDocument();
    });
    vi.useRealTimers();
  });

  test('Opens and closes modals on button click', async () => {
    const { getByText, queryByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <AdvertisementRegister
                endDateEdit={new Date()}
                startDateEdit={new Date()}
                typeEdit="BANNER"
                nameEdit="Advert1"
                orgIdEdit="1"
                advertisementMediaEdit=""
                setAfter={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    fireEvent.click(getByText(translations.createAdvertisement));
    await waitFor(() => {
      expect(queryByText(translations.addNew)).toBeInTheDocument();
    });
    fireEvent.click(getByText(translations.close));
    await waitFor(() => {
      expect(queryByText(translations.close)).not.toBeInTheDocument();
    });
    vi.useRealTimers();
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
                  endDateEdit={new Date()}
                  startDateEdit={new Date()}
                  typeEdit="BANNER"
                  nameEdit="Advert1"
                  orgIdEdit="1"
                  advertisementMediaEdit="google.com"
                  setAfter={vi.fn()}
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
      expect(toast.error).toHaveBeenCalledWith(
        'End Date should be greater than or equal to Start Date',
      );
    });
    vi.useRealTimers();
  });

  test('Media preview renders correctly', async () => {
    render(
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
                advertisementMediaEdit="test.mp4"
                setAfter={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    fireEvent.click(screen.getByText(translations.createAdvertisement));
    await screen.findByText(translations.addNew);

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
  vi.useRealTimers();

  test('shows success toast on successful update', async () => {
    const setAfterMock = vi.fn();

    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <AdvertisementRegister
                formStatus="edit"
                idEdit="123"
                nameEdit="Test Ad"
                typeEdit="BANNER"
                startDateEdit={new Date('2024-01-01')}
                endDateEdit={new Date('2024-12-31')}
                orgIdEdit="1"
                advertisementMediaEdit=""
                setAfter={setAfterMock}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    const editButton = screen.getByTestId('editBtn');
    fireEvent.click(editButton);

    const nameInput = screen.getByLabelText('Enter name of Advertisement');
    fireEvent.change(nameInput, { target: { value: 'Updated Ad' } });

    const saveButton = screen.getByTestId('addonupdate');
    fireEvent.click(saveButton);

    await waitFor(() => {
      // Verify success toast was shown
      expect(toast.success).toHaveBeenCalledWith(
        'Advertisement created successfully.',
      );
    });
  });
});
