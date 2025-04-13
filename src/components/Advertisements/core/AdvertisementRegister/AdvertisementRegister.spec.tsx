import React, { act } from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
  getByTestId,
} from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import AdvertisementRegister from './AdvertisementRegister';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import i18n from 'utils/i18nForTest';
import { toast } from 'react-toastify';
import { StaticMockLink } from 'utils/StaticMockLink';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import {
  client,
  REGISTER_MOCKS,
} from 'components/Advertisements/AdvertisementsMocks';
import {
  ADD_ADVERTISEMENT_MUTATION,
  UPDATE_ADVERTISEMENT_MUTATION,
} from 'GraphQl/Mutations/mutations';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orgId: '1' }),
    useNavigate: vi.fn(),
  };
});

global.URL.createObjectURL = vi.fn(() => 'mocked-url');

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

const link = new StaticMockLink(REGISTER_MOCKS, true);

const mockFile = new File(['dummy content'], 'test.jpg', {
  type: 'image/jpeg',
});
const createAdSuccessMock: MockedResponse = {
  request: {
    query: ADD_ADVERTISEMENT_MUTATION,
    variables: {
      organizationId: '1',
      name: 'Ad1',
      type: 'banner',
      startAt: '2022-12-31T18:30:00.000Z',
      endAt: '2023-01-31T18:30:00.000Z',
      description: 'advertisement',
      attachments: [mockFile],
    },
  },
  result: {
    data: {
      createAdvertisement: {
        id: '0196',
      },
    },
  },
};

const updateAdSuccessMock: MockedResponse = {
  request: {
    query: UPDATE_ADVERTISEMENT_MUTATION,
    variables: {
      id: '1',
      name: 'Ad1',
      type: 'banner',
      startAt: '2022-12-31T18:30:00.000Z',
      endAt: '2023-01-31T18:30:00.000Z',
      description: 'advertisement',
      attachments: [],
    },
  },
  result: {
    data: {
      updateAdvertisement: {
        id: '0196',
      },
    },
  },
};

const createAdFailMock: MockedResponse = {
  request: {
    query: ADD_ADVERTISEMENT_MUTATION,
    variables: {
      organizationId: '1',
      name: 'Ad1',
      type: 'banner',
      startAt: '2022-12-31T18:30:00.000Z',
      endAt: '2023-01-31T18:30:00.000Z',
      description: 'advertisement',
      attachments: [mockFile],
    },
  },
  error: new Error('Invalid arguments for this action.'),
};

const updateAdFailMock: MockedResponse = {
  request: {
    query: UPDATE_ADVERTISEMENT_MUTATION,
    variables: {
      id: '1',
      name: 'Ad1',
      type: 'banner',
      startAt: '2022-01-31T18:30:00.000Z',
      endAt: '2023-12-31T18:30:00.000Z',
      description: 'advertisement',
      attachments: [],
    },
  },
  error: new Error('Invalid arguments for this action.'),
};

vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: vi.fn().mockReturnValue('token'),
  }),
}));

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
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });
  test('AdvertismentRegister component loads correctly in register mode', async () => {
    const { getByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <AdvertisementRegister
                formStatus="register"
                nameEdit=""
                typeEdit="banner"
                descriptionEdit=""
                endAtEdit={
                  new Date(new Date().setDate(new Date().getDate() + 1))
                }
                startAtEdit={new Date()}
                idEdit="1"
                setAfter={() => {}}
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
        <MockedProvider addTypename={false} mocks={[createAdSuccessMock]}>
          <Provider store={store}>
            <BrowserRouter>
              <I18nextProvider i18n={i18n}>
                <AdvertisementRegister
                  formStatus="register"
                  nameEdit=""
                  typeEdit="banner"
                  descriptionEdit=""
                  endAtEdit={
                    new Date(new Date().setDate(new Date().getDate() + 1))
                  }
                  startAtEdit={new Date()}
                  idEdit="1"
                  setAfter={() => {}}
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

      fireEvent.change(screen.getByLabelText(translations.Rdesc), {
        target: { value: 'advertisement' },
      });

      fireEvent.change(screen.getByLabelText(translations.Rmedia), {
        target: {
          files: [mockFile],
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rtype), {
        target: { value: 'banner' },
      });

      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: '2023-01-01' },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: '2023-02-01' },
      });
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue('Ad1');
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      '2023-01-01',
    );
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      '2023-02-01',
    );

    expect(screen.getByText(translations.register)).toBeInTheDocument();

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
    const toastSuccessMock = vi.spyOn(toast, 'success');
    await act(async () => {
      render(
        <MockedProvider addTypename={false} mocks={[updateAdSuccessMock]}>
          <Provider store={store}>
            <BrowserRouter>
              <I18nextProvider i18n={i18n}>
                <AdvertisementRegister
                  endAtEdit={new Date()}
                  startAtEdit={new Date()}
                  typeEdit="menu"
                  nameEdit="Ad"
                  idEdit="1"
                  advertisementMedia=""
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
      fireEvent.change(screen.getByLabelText(translations.Rdesc), {
        target: { value: 'advertisement' },
      });
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rtype), {
        target: { value: 'banner' },
      });

      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: '2023-01-01' },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: '2023-02-01' },
      });
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue('Ad1');
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      '2023-01-01',
    );
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      '2023-02-01',
    );

    await act(async () => {
      expect(screen.getByTestId('addonupdate')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('addonupdate'));
    });

    await waitFor(() => {
      expect(toastSuccessMock).toHaveBeenCalledWith(
        'Advertisement updated Successfully',
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
        <MockedProvider addTypename={false} mocks={[createAdFailMock]}>
          <Provider store={store}>
            <BrowserRouter>
              <I18nextProvider i18n={i18n}>
                <AdvertisementRegister
                  endAtEdit={new Date()}
                  startAtEdit={new Date()}
                  typeEdit="banner"
                  nameEdit="Ad1"
                  idEdit="1"
                  advertisementMedia=""
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
        `Invalid arguments for this action.`,
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
                endAtEdit={new Date()}
                startAtEdit={new Date()}
                typeEdit="banner"
                nameEdit="Ad1"
                idEdit="1"
                advertisementMedia=""
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
      target: { value: 'banner' },
    });
    expect(getByLabelText(translations.Rtype)).toHaveValue('banner');

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
      'End Date should be greater than Start Date',
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
                endAtEdit={new Date()}
                startAtEdit={new Date()}
                typeEdit="banner"
                nameEdit="Advert1"
                idEdit="1"
                advertisementMedia="google.com"
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
                endAtEdit={new Date()}
                startAtEdit={new Date()}
                typeEdit="banner"
                nameEdit="Advert1"
                idEdit="1"
                advertisementMedia=""
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
    const toastErrorSpy = vi.spyOn(toast, 'error');
    const { getByText, getByLabelText, queryByText } = render(
      <MockedProvider addTypename={false} mocks={[updateAdFailMock]}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              {
                <AdvertisementRegister
                  formStatus="edit"
                  endAtEdit={new Date()}
                  startAtEdit={new Date()}
                  typeEdit="banner"
                  nameEdit="Advert1"
                  idEdit="1"
                  advertisementMedia=""
                  setAfter={vi.fn()}
                />
              }
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('editBtn'));
    });
    expect(queryByText(translations.editAdvertisement)).toBeInTheDocument();
    fireEvent.change(getByLabelText(translations.Rname), {
      target: { value: 'Test Advertisement' },
    });
    expect(getByLabelText(translations.Rname)).toHaveValue(
      'Test Advertisement',
    );

    fireEvent.change(getByLabelText(translations.Rtype), {
      target: { value: 'banner' },
    });
    expect(getByLabelText(translations.Rtype)).toHaveValue('banner');

    expect(getByLabelText(translations.RstartDate)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(translations.RstartDate), {
      target: { value: '2023-02-01' },
    });

    expect(getByLabelText(translations.RstartDate)).toHaveValue('2023-02-01');

    fireEvent.change(screen.getByLabelText(translations.RendDate), {
      target: { value: '2023-01-01' },
    });

    expect(getByLabelText(translations.RendDate)).toHaveValue('2023-01-01');

    fireEvent.click(getByText(translations.saveChanges));
    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        'End Date should be greater than Start Date',
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
                endAtEdit={new Date()}
                startAtEdit={new Date()}
                typeEdit="banner"
                nameEdit="Advert1"
                idEdit="1"
                advertisementMedia="test.mp4"
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
    await userEvent.upload(mediaInput, mediaFile);

    const mediaPreview = await screen.findByTestId('mediaPreview');
    expect(mediaPreview).toBeInTheDocument();

    const closeButton = await screen.findByTestId('closePreview');
    fireEvent.click(closeButton);
    expect(mediaPreview).not.toBeInTheDocument();
  });

  vi.useRealTimers();
});
