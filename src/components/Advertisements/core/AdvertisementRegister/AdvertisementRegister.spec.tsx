/**
 * Testing Advertisement Register Component
 * * Rectified to resolve Apollo Error #104 and TimeoutNaNWarning.
 * * Updated to remove deprecated Apollo Cache options.
 */
import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from '@testing-library/react';
import {
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
  HttpLink,
} from '@apollo/client';
import AdvertisementRegister from './AdvertisementRegister';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import { MockedProvider } from '@apollo/client/testing';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import i18nForTest from 'utils/i18nForTest';
import * as router from 'react-router';
import { dateConstants } from './AdvertisementRegisterMocks';

// Create a local clean client for tests to avoid global cache pollution.
const testClient = new ApolloClient({
  link: new HttpLink({ uri: '/graphql' }),
  cache: new InMemoryCache(), // Deprecated option 'addTypename: false' removed
});

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: '1' }),
    useNavigate: vi.fn(),
  };
});

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

let mockUseMutation: ReturnType<typeof vi.fn>;
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client');
  return {
    ...actual,
    useMutation: () => mockUseMutation(),
    ApolloProvider: actual.ApolloProvider,
    InMemoryCache: actual.InMemoryCache,
    ApolloClient: actual.ApolloClient,
    HttpLink: actual.HttpLink,
  };
});

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18nForTest.getDataByLanguage('en')?.translation.advertisement ?? {},
    ),
  ),
  ...JSON.parse(
    JSON.stringify(i18nForTest.getDataByLanguage('en')?.common ?? {}),
  ),
  ...JSON.parse(
    JSON.stringify(i18nForTest.getDataByLanguage('en')?.errors ?? {}),
  ),
};

describe('Testing Advertisement Register Component', () => {
  beforeEach(() => {
    mockUseMutation = vi.fn();
    vi.clearAllMocks();
    vi.useRealTimers();
    mockUseMutation.mockReturnValue([vi.fn(), { loading: false }]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('AdvertismentRegister component loads correctly in register mode', async () => {
    render(
      <ApolloProvider client={testClient}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="register"
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    await waitFor(() => {
      expect(
        screen.getByText(translations.createAdvertisement),
      ).toBeInTheDocument();
    });
  });

  test('Throws error at creation when the end date is less than the start date', async () => {
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');
    render(
      <MockedProvider cache={new InMemoryCache()}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    fireEvent.click(screen.getByText(translations.createAdvertisement));

    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: 'Ad1' },
    });

    fireEvent.change(screen.getByLabelText(translations.RstartDate), {
      target: { value: dateConstants.create.startAtISO.split('T')[0] },
    });

    fireEvent.change(screen.getByLabelText(translations.RendDate), {
      target: { value: dateConstants.create.endBeforeStartISO.split('T')[0] },
    });

    fireEvent.click(screen.getByText(translations.register));

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        'End Date should be greater than Start Date',
      );
    });
  });

  test('Successfully creates advertisement and omits attachments variable', async () => {
    const createAdMock = vi.fn().mockResolvedValue({
      data: { createAdvertisement: { id: '123' } },
    });
    mockUseMutation.mockReturnValue([createAdMock, { loading: false }]);

    render(
      <ApolloProvider client={testClient}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    fireEvent.click(screen.getByText(translations.createAdvertisement));

    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: 'Ad1' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    await waitFor(() => {
      expect(createAdMock).toHaveBeenCalled();
      const mockCall = createAdMock.mock.calls[0][0];
      expect(mockCall.variables.attachments).toBeUndefined();
    });
  });
});
