import React from 'react';
import { describe, test, expect, vi, it } from 'vitest';
import { ApolloProvider } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import Advertisement from './Advertisements';
import {
  client,
  createAdvertisement,
  createAdvertisementError,
  createAdvertisementWithEndDateBeforeStart,
  createAdvertisementWithoutName,
  dateConstants,
  deleteAdvertisementMocks,
  emptyMocks,
  fetchErrorMocks,
  filterActiveAdvertisementData,
  filterCompletedAdvertisementData,
  getActiveAdvertisementMocks,
  getCompletedAdvertisementMocks,
  initialActiveData,
  initialArchivedData,
  updateAdMocks,
  wait,
} from './AdvertisementsMocks';

vi.mock('components/AddOn/support/services/Plugin.helper', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => ({
    fetchInstalled: vi.fn().mockResolvedValue([]),
    fetchStore: vi.fn().mockResolvedValue([]),
  })),
}));

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

let mockID: string | undefined = '1';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useParams: () => ({ orgId: mockID }) };
});

const today = new Date();
const tomorrow = today;
tomorrow.setDate(today.getDate() + 1);

let mockUseMutation: ReturnType<typeof vi.fn>;
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client');
  return {
    ...actual,
    useMutation: () => mockUseMutation(),
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

describe('Testing Advertisement Component', () => {
  beforeEach(() => {
    mockUseMutation = vi.fn();
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue([vi.fn()]);
    Object.defineProperty(window, 'innerHeight', {
      value: 1000,
      writable: true,
    });

    Object.defineProperty(window, 'scrollY', {
      value: 1000,
      writable: true,
    });

    Object.defineProperty(document.body, 'offsetHeight', {
      value: 1500,
      writable: true,
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('render spinner while loading', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={getCompletedAdvertisementMocks}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('switches between tabs', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={getCompletedAdvertisementMocks}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
      /Completed Campaigns/i,
    );

    const activeTab = screen.getByRole('tab', { name: /Active Campaigns/i });
    await userEvent.click(activeTab);

    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
      /Active Campaigns/i,
    );

    const archivedTab = screen.getByRole('tab', {
      name: /Completed Campaigns/i,
    });
    await userEvent.click(archivedTab);

    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
      /Completed Campaigns/i,
    );
  });

  it('render active advertisement after loading', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={getActiveAdvertisementMocks}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await wait();

    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    expect(screen.getByTestId('AdEntry')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toHaveTextContent('banner');
    expect(screen.getByTestId('Ad_name')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_name')).toHaveTextContent('Cookie shop');
    expect(screen.getByTestId('Ad_desc')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_desc')).toHaveTextContent(
      'this is an active advertisement',
    );
    expect(screen.getByTestId('media')).toBeInTheDocument();
    expect(screen.getByTestId('moreiconbtn')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('moreiconbtn'));
    expect(screen.getByTestId('deletebtn')).toBeInTheDocument();
    expect(screen.getByTestId('editBtn')).toBeInTheDocument();
  });

  it('render completed advertisement after loading', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={getCompletedAdvertisementMocks}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await wait();

    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    expect(screen.getByTestId('AdEntry')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toHaveTextContent('banner');
    expect(screen.getByTestId('Ad_name')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_name')).toHaveTextContent('Cookie shop');
    expect(screen.getByTestId('Ad_desc')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_desc')).toHaveTextContent(
      'this is a completed advertisement',
    );
    expect(screen.getByTestId('media')).toBeInTheDocument();
    expect(screen.getByTestId('moreiconbtn')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('moreiconbtn'));
    expect(screen.getByTestId('deletebtn')).toBeInTheDocument();
    expect(screen.getByTestId('editBtn')).toBeInTheDocument();
  });

  it('loads more archived advertisements on scroll', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={initialArchivedData}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await wait();

    expect(screen.getByText('Cookie shop 1')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 2')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 3')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 4')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 5')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 6')).toBeInTheDocument();
    expect(
      screen.queryByText('Cookie shop infinite 1'),
    ).not.toBeInTheDocument();

    await act(async () => {
      const tab = screen.getByText('Completed Campaigns');
      await userEvent.click(tab);
      expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
        'Completed Campaigns',
      );
    });

    window.dispatchEvent(new Event('scroll'));
    await waitFor(() => {
      expect(screen.getByText('Cookie shop infinite 1')).toBeInTheDocument();
      expect(screen.getByText('Cookie shop 1')).toBeInTheDocument();
      expect(screen.getByText('Cookie shop 2')).toBeInTheDocument();
      expect(screen.getByText('Cookie shop 3')).toBeInTheDocument();
      expect(screen.getByText('Cookie shop 4')).toBeInTheDocument();
      expect(screen.getByText('Cookie shop 5')).toBeInTheDocument();
      expect(screen.getByText('Cookie shop 6')).toBeInTheDocument();
    });
  });

  it('loads more active advertisements on scroll', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={initialActiveData}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await wait();

    expect(screen.getByText('Cookie shop 1')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 2')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 3')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 4')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 5')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 6')).toBeInTheDocument();
    expect(
      screen.queryByText('Cookie shop infinite 1'),
    ).not.toBeInTheDocument();

    await act(async () => {
      const tab = screen.getByText('Active Campaigns');
      await userEvent.click(tab);
    });

    await wait();
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
      'Active Campaigns',
    );

    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(screen.getByText('Cookie shop 1')).toBeInTheDocument();
      expect(screen.getByText('Cookie shop 2')).toBeInTheDocument();
      expect(screen.getByText('Cookie shop 3')).toBeInTheDocument();
      expect(screen.getByText('Cookie shop 4')).toBeInTheDocument();
      expect(screen.getByText('Cookie shop 5')).toBeInTheDocument();
      expect(screen.getByText('Cookie shop 6')).toBeInTheDocument();
      expect(screen.getByText('Cookie shop infinite 1')).toBeInTheDocument();
    });
  });

  it('search button renders correctly with placeholder', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={getCompletedAdvertisementMocks}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    expect(screen.getByTestId('searchname')).toBeInTheDocument();
    expect(screen.getByTestId('searchButton')).toBeInTheDocument();

    expect(screen.getByTestId('searchname')).toHaveAttribute(
      'placeholder',
      translations.searchAdvertisements,
    );
  });

  it('filters active advertisement by name (unique)', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={filterActiveAdvertisementData}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await wait();

    expect(screen.getByTestId('searchname')).toBeInTheDocument();
    expect(screen.getByTestId('searchButton')).toBeInTheDocument();
    await userEvent.clear(screen.getByTestId('searchname'));
    await userEvent.type(screen.getByTestId('searchname'), 'Cookie shop 6');
    await userEvent.click(screen.getByTestId('searchButton'));

    await wait();
    expect(screen.getByText('Cookie shop 6')).toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 5')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 4')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 3')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 1')).not.toBeInTheDocument();
  });

  it('filters active advertisement by description (unique)', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={filterActiveAdvertisementData}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await wait();

    expect(screen.getByTestId('searchname')).toBeInTheDocument();
    expect(screen.getByTestId('searchButton')).toBeInTheDocument();

    await userEvent.clear(screen.getByTestId('searchname'));
    await userEvent.type(
      screen.getByTestId('searchname'),
      'this is an active advertisement 6',
    );
    await userEvent.click(screen.getByTestId('searchButton'));

    await wait();
    expect(screen.getByText('Cookie shop 6')).toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 5')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 4')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 3')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 1')).not.toBeInTheDocument();
  });

  it('filter completed advertisement by name', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={filterCompletedAdvertisementData}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await wait();

    expect(screen.getByTestId('searchname')).toBeInTheDocument();
    expect(screen.getByTestId('searchButton')).toBeInTheDocument();
    await userEvent.clear(screen.getByTestId('searchname'));
    await userEvent.type(screen.getByTestId('searchname'), 'Cookie shop 6');
    await userEvent.click(screen.getByTestId('searchButton'));

    await wait();
    expect(screen.getByText('Cookie shop 6')).toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 5')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 4')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 3')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 1')).not.toBeInTheDocument();
  });

  it('filter completed advertisement by description', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={filterCompletedAdvertisementData}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await wait();

    expect(screen.getByTestId('searchname')).toBeInTheDocument();
    expect(screen.getByTestId('searchButton')).toBeInTheDocument();
    await userEvent.clear(screen.getByTestId('searchname'));
    await userEvent.type(
      screen.getByTestId('searchname'),
      'this is a completed advertisement 6',
    );
    await userEvent.click(screen.getByTestId('searchButton'));

    await wait();
    expect(screen.getByText('Cookie shop 6')).toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 5')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 4')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 3')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 1')).not.toBeInTheDocument();
  });

  it('search for not existing advertisement', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={getCompletedAdvertisementMocks}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await wait();

    expect(screen.getByTestId('searchname')).toBeInTheDocument();
    expect(screen.getByTestId('searchButton')).toBeInTheDocument();
    await userEvent.clear(screen.getByTestId('searchname'));
    await userEvent.type(screen.getByTestId('searchname'), 'BandhanSearchedIt');
    await userEvent.click(screen.getByTestId('searchButton'));
    expect(
      screen.getAllByText('Ads not present for this campaign.'),
    ).toHaveLength(2); // both completed and active tab
  });

  it('create advertisement', async () => {
    const createAdMock = vi.fn();
    mockUseMutation.mockReturnValue([createAdMock]);
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={createAdvertisement}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument(),
    );

    expect(
      screen.getByText(translations.createAdvertisement),
    ).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(screen.getByText(translations.createAdvertisement));
    });

    expect(screen.queryByText(translations.addNew)).toBeInTheDocument();

    await userEvent.clear(screen.getByTestId('advertisementNameInput'));
    await userEvent.type(screen.getByTestId('advertisementNameInput'), 'Ad1');

    await userEvent.selectOptions(
      screen.getByTestId('advertisementTypeSelect'),
      'banner',
    );

    await userEvent.clear(screen.getByTestId('advertisementStartDate'));
    await userEvent.type(
      screen.getByTestId('advertisementStartDate'),
      dateConstants.create.startAtISO.split('T')[0],
    );

    await userEvent.clear(screen.getByTestId('advertisementEndDate'));
    await userEvent.type(
      screen.getByTestId('advertisementEndDate'),
      dateConstants.create.endAtISO.split('T')[0],
    );

    expect(screen.getByTestId('advertisementNameInput')).toHaveValue('Ad1');
    expect(screen.getByTestId('advertisementTypeSelect')).toHaveValue('banner');
    expect(screen.getByTestId('advertisementStartDate')).toHaveValue(
      dateConstants.create.startAtISO.split('T')[0],
    );
    expect(screen.getByTestId('advertisementEndDate')).toHaveValue(
      dateConstants.create.endAtISO.split('T')[0],
    );

    await act(async () => {
      await userEvent.click(screen.getByText(translations.register));
    });

    await waitFor(() => {
      const mockCall = createAdMock.mock.calls[0][0];
      expect(mockCall.variables).toMatchObject({
        organizationId: '1',
        name: 'Ad1',
        type: 'banner',
        attachments: [],
      });
      expect(new Date(mockCall.variables.startAt)).toBeInstanceOf(Date);
      expect(new Date(mockCall.variables.endAt)).toBeInstanceOf(Date);
      const creationFailedText = screen.queryByText((_, element) => {
        return (
          element?.textContent === 'Creation Failed' &&
          element.tagName.toLowerCase() === 'div'
        );
      });
      expect(creationFailedText).toBeNull();
    });
    vi.useRealTimers();
  });

  it('creating advertisement without name should throw an error', async () => {
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={createAdvertisementWithoutName}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument(),
    );

    expect(
      screen.getByText(translations.createAdvertisement),
    ).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(screen.getByText(translations.createAdvertisement));
    });

    expect(screen.queryByText(translations.addNew)).toBeInTheDocument();

    await userEvent.selectOptions(
      screen.getByTestId('advertisementTypeSelect'),
      'banner',
    );

    await userEvent.clear(screen.getByTestId('advertisementStartDate'));
    await userEvent.type(
      screen.getByTestId('advertisementStartDate'),
      dateConstants.create.startAtISO.split('T')[0],
    );

    await userEvent.clear(screen.getByTestId('advertisementEndDate'));
    await userEvent.type(
      screen.getByTestId('advertisementEndDate'),
      dateConstants.create.endAtISO.split('T')[0],
    );

    expect(screen.getByTestId('advertisementNameInput')).not.toHaveValue();
    expect(screen.getByTestId('advertisementTypeSelect')).toHaveValue('banner');
    expect(screen.getByTestId('advertisementStartDate')).toHaveValue(
      dateConstants.create.startAtISO.split('T')[0],
    );
    expect(screen.getByTestId('advertisementEndDate')).toHaveValue(
      dateConstants.create.endAtISO.split('T')[0],
    );

    await act(async () => {
      await userEvent.click(screen.getByText(translations.register));
    });

    expect(toastErrorSpy).toHaveBeenCalledWith(
      'Invalid arguments for this action.',
    );
  });

  it('creating advertisement with end date before than start date should throw an error', async () => {
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={createAdvertisementWithEndDateBeforeStart}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument(),
    );

    expect(
      screen.getByText(translations.createAdvertisement),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByText(translations.createAdvertisement));

    expect(screen.queryByText(translations.addNew)).toBeInTheDocument();

    await userEvent.clear(screen.getByTestId('advertisementNameInput'));
    await userEvent.type(screen.getByTestId('advertisementNameInput'), 'Ad1');

    await userEvent.selectOptions(
      screen.getByTestId('advertisementTypeSelect'),
      'banner',
    );

    await userEvent.clear(screen.getByTestId('advertisementStartDate'));
    await userEvent.type(
      screen.getByTestId('advertisementStartDate'),
      dateConstants.create.startAtISO.split('T')[0],
    );

    await userEvent.clear(screen.getByTestId('advertisementEndDate'));
    await userEvent.type(
      screen.getByTestId('advertisementEndDate'),
      dateConstants.create.endBeforeStartISO.split('T')[0],
    );

    expect(screen.getByTestId('advertisementNameInput')).toHaveValue('Ad1');
    expect(screen.getByTestId('advertisementTypeSelect')).toHaveValue('banner');
    expect(screen.getByTestId('advertisementStartDate')).toHaveValue(
      dateConstants.create.startAtISO.split('T')[0],
    );
    expect(screen.getByTestId('advertisementEndDate')).toHaveValue(
      dateConstants.create.endBeforeStartISO.split('T')[0],
    );

    await act(async () => {
      await userEvent.click(screen.getByText(translations.register));
    });

    expect(toastErrorSpy).toHaveBeenCalledWith(
      'End Date should be greater than Start Date',
    );
  });

  it('should handle unknown errors', async () => {
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={createAdvertisementError}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument(),
    );

    expect(
      screen.getByText(translations.createAdvertisement),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByText(translations.createAdvertisement));

    expect(screen.queryByText(translations.addNew)).toBeInTheDocument();

    await userEvent.clear(screen.getByTestId('advertisementNameInput'));
    await userEvent.type(screen.getByTestId('advertisementNameInput'), 'Ad1');

    await userEvent.selectOptions(
      screen.getByTestId('advertisementTypeSelect'),
      'banner',
    );

    await userEvent.clear(screen.getByTestId('advertisementStartDate'));
    await userEvent.type(
      screen.getByTestId('advertisementStartDate'),
      dateConstants.create.startAtISO.split('T')[0],
    );

    await userEvent.clear(screen.getByTestId('advertisementEndDate'));
    await userEvent.type(
      screen.getByTestId('advertisementEndDate'),
      dateConstants.create.endAtISO.split('T')[0],
    );

    expect(screen.getByTestId('advertisementNameInput')).toHaveValue('Ad1');
    expect(screen.getByTestId('advertisementTypeSelect')).toHaveValue('banner');
    expect(screen.getByTestId('advertisementStartDate')).toHaveValue(
      dateConstants.create.startAtISO.split('T')[0],
    );
    expect(screen.getByTestId('advertisementEndDate')).toHaveValue(
      dateConstants.create.endAtISO.split('T')[0],
    );

    await act(async () => {
      await userEvent.click(screen.getByText(translations.register));
    });

    expect(toastErrorSpy).toHaveBeenCalledWith(
      "An error occurred. Couldn't create advertisement",
    );
  });

  it('update advertisement', async () => {
    const updateMock = vi.fn();
    mockUseMutation.mockReturnValue([updateMock]);
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={updateAdMocks}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await wait();

    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    expect(screen.getByTestId('AdEntry')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toHaveTextContent('banner');
    expect(screen.getByTestId('Ad_name')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_name')).toHaveTextContent('Ad1');
    expect(screen.getByTestId('Ad_desc')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_desc')).toHaveTextContent(
      'This is a new advertisement created for testing.',
    );
    expect(screen.getByTestId('media')).toBeInTheDocument();
    expect(screen.getByTestId('moreiconbtn')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('moreiconbtn'));
    expect(screen.getByTestId('editBtn')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('editBtn'));

    const descriptionField = screen.getByTestId(
      'advertisementDescriptionInput',
    );

    await userEvent.clear(descriptionField);
    await userEvent.type(descriptionField, 'This is an updated advertisement');

    await userEvent.clear(screen.getByTestId('advertisementStartDate'));
    await userEvent.type(
      screen.getByTestId('advertisementStartDate'),
      dateConstants.update.startAtISO.split('T')[0],
    );

    await userEvent.clear(screen.getByTestId('advertisementEndDate'));
    await userEvent.type(
      screen.getByTestId('advertisementEndDate'),
      dateConstants.update.endAtISO.split('T')[0],
    );

    await userEvent.click(screen.getByTestId('addonupdate'));

    await waitFor(() => {
      const mockCall = updateMock.mock.calls[0][0];
      expect(mockCall.variables).toMatchObject({
        id: '1',
        description: 'This is an updated advertisement',
      });
      expect(new Date(mockCall.variables.startAt)).toBeInstanceOf(Date);
      expect(new Date(mockCall.variables.endAt)).toBeInstanceOf(Date);
      const updateFailedText = screen.queryByText((_, element) => {
        return (
          element?.textContent === 'Update Failed' &&
          element.tagName.toLowerCase() === 'div'
        );
      });
      expect(updateFailedText).toBeNull();
    });
  });

  it('cancels advertisement update when close button is clicked', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={getActiveAdvertisementMocks}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('moreiconbtn'));
    await userEvent.click(screen.getByTestId('editBtn'));

    expect(screen.getByTestId('addonupdate')).toBeInTheDocument();
    expect(screen.getByTestId('addonclose')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('addonclose'));

    await waitFor(() => {
      expect(screen.queryByTestId('addonupdate')).not.toBeInTheDocument();
    });
  });

  it('validates advertisement update form properly', async () => {
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');
    const updateMock = vi.fn();
    mockUseMutation.mockReturnValue([updateMock]);

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={getActiveAdvertisementMocks}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('moreiconbtn'));

    await userEvent.click(screen.getByTestId('editBtn'));

    const startDateInput = screen.getByTestId('advertisementStartDate');
    const endDateInput = screen.getByTestId('advertisementEndDate');

    await userEvent.clear(startDateInput);
    await userEvent.type(
      startDateInput,
      dateConstants.update.startAtISO.split('T')[0],
    );

    await userEvent.clear(endDateInput);
    await userEvent.type(
      endDateInput,
      dateConstants.update.endBeforeStartISO.split('T')[0],
    );

    await act(async () => {
      await userEvent.click(screen.getByTestId('addonupdate'));
    });

    expect(toastErrorSpy).toHaveBeenCalledWith(
      'End Date should be greater than Start Date',
    );

    expect(updateMock).not.toHaveBeenCalled();
  });

  it('cancelling delete advertisement should close the modal', async () => {
    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={deleteAdvertisementMocks}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    await wait();
    expect(getByTestId('moreiconbtn')).toBeInTheDocument();
    await userEvent.click(getByTestId('moreiconbtn'));
    expect(getByTestId('deletebtn')).toBeInTheDocument();
    await userEvent.click(getByTestId('deletebtn'));
    await waitFor(() => {
      expect(
        screen.getByText(translations.deleteAdvertisement),
      ).toBeInTheDocument();
      expect(getByTestId('delete_body')).toBeInTheDocument();
    });

    await userEvent.click(getByTestId('delete_no'));

    await wait();
    expect(
      screen.queryByText(translations.deleteAdvertisement),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete_body')).not.toBeInTheDocument();

    expect(getByTestId('moreiconbtn')).toBeInTheDocument();
  });

  it('delete advertisement', async () => {
    const toastSuccessSpy = vi.spyOn(NotificationToast, 'success');
    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={deleteAdvertisementMocks}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    await wait();
    expect(getByTestId('moreiconbtn')).toBeInTheDocument();
    await userEvent.click(getByTestId('moreiconbtn'));
    expect(getByTestId('deletebtn')).toBeInTheDocument();
    await userEvent.click(getByTestId('deletebtn'));
    await waitFor(() => {
      expect(
        screen.getByText(translations.deleteAdvertisement),
      ).toBeInTheDocument();
      expect(getByTestId('delete_body')).toBeInTheDocument();
    });
    await userEvent.click(getByTestId('delete_yes'));
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        'Advertisement deleted successfully.',
      );
    });
  });

  it('handles GraphQL errors when fetching advertisements', async () => {
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={fetchErrorMocks}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    // Should show error messages
    expect(toastErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch advertisements',
    );
  });

  test('skips queries when organization ID is missing', async () => {
    mockID = undefined;

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={[]}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    expect(screen.getByTestId('advertisements')).toBeInTheDocument();
    expect(screen.queryByTestId('Ad_name')).not.toBeInTheDocument();

    mockID = '1'; // restore the mock id
  });

  test('title is set correctly', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={getCompletedAdvertisementMocks}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    const translations = JSON.parse(
      JSON.stringify(
        i18nForTest.getDataByLanguage('en')?.translation.advertisement ?? {},
      ),
    );

    expect(document.title).toBe(translations.title);
  });

  test('both empty advertisement array should render ad not availabe text correctly', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={emptyMocks}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    const emptyTextElements = screen.queryAllByText(
      'Ads not present for this campaign.',
    );
    expect(emptyTextElements).toHaveLength(2);
    emptyTextElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });

  it('cancels advertisement creation when cancel button is clicked', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={getCompletedAdvertisementMocks}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    await userEvent.click(screen.getByText(translations.createAdvertisement));
    expect(screen.queryByText(translations.addNew)).toBeInTheDocument();

    await userEvent.clear(screen.getByTestId('advertisementNameInput'));
    await userEvent.type(
      screen.getByTestId('advertisementNameInput'),
      'Test Ad',
    );

    await userEvent.click(screen.getByTestId('addonclose'));

    await waitFor(() => {
      expect(screen.queryByText(translations.addNew)).not.toBeInTheDocument();
    });
  });

  it('authLink adds authorization header when token exists in localStorage', async () => {
    const mockToken = 'test-token-123';

    // Spy on the mock's getItem function directly
    const getItemSpy = vi
      .spyOn(localStorage, 'getItem')
      .mockImplementation((key: string) => {
        if (key === 'Talawa-admin_token') return mockToken;
        return null;
      });

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <Advertisement />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    expect(getItemSpy).toHaveBeenCalledWith('Talawa-admin_token');
    expect(getItemSpy).toHaveReturnedWith(mockToken);
  });

  it('authLink does not add authorization header when token is null in localStorage', async () => {
    // Spy on the mock's getItem function directly
    const getItemSpy = vi.spyOn(localStorage, 'getItem').mockReturnValue(null);

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <Advertisement />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    expect(getItemSpy).toHaveBeenCalledWith('Talawa-admin_token');
    expect(getItemSpy).toHaveReturnedWith(null);
  });
});
