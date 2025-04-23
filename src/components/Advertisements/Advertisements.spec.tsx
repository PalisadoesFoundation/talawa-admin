import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { ApolloProvider } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { toast } from 'react-toastify';
import { store } from '../../state/store';
import i18nForTest from '../../utils/i18nForTest';
import Advertisement from './Advertisements';
import {
  wait,
  client,
  getCompletedAdvertisementMocks,
  getActiveAdvertisementMocks,
  deleteAdvertisementMocks,
  emptyMocks,
  initialArchivedData,
  initialActiveData,
  filterActiveAdvertisementData,
  filterCompletedAdvertisementData,
  dateConstants,
  createAdvertisement,
  createAdvertisementWithoutName,
  createAdvertisementWithEndDateBeforeStart,
  createAdvertisementError,
  updateAdMocks,
  fetchErrorMocks,
} from './AdvertisementsMocks';
import i18n from '../../utils/i18nForTest';

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
      i18n.getDataByLanguage('en')?.translation.advertisement ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

let mockID: string | undefined = '1';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useParams: () => ({ orgId: mockID }) };
});

const today = new Date();
const tomorrow = today;
tomorrow.setDate(today.getDate() + 1);

const mockUseMutation = vi.fn();
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client');
  return {
    ...actual,
    useMutation: () => mockUseMutation(),
  };
});

describe('Testing Advertisement Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue([vi.fn()]);
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
              <MockedProvider
                mocks={getCompletedAdvertisementMocks}
                addTypename={false}
              >
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
              <MockedProvider
                mocks={getCompletedAdvertisementMocks}
                addTypename={false}
              >
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
    fireEvent.click(activeTab);

    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
      /Active Campaigns/i,
    );

    const archivedTab = screen.getByRole('tab', {
      name: /Completed Campaigns/i,
    });
    fireEvent.click(archivedTab);

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
              <MockedProvider
                mocks={getActiveAdvertisementMocks}
                addTypename={false}
              >
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
    fireEvent.click(screen.getByTestId('moreiconbtn'));
    expect(screen.getByTestId('deletebtn')).toBeInTheDocument();
    expect(screen.getByTestId('editBtn')).toBeInTheDocument();
  });

  it('filter active advertisement by name', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={getActiveAdvertisementMocks}
                addTypename={false}
              >
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

    fireEvent.change(screen.getByTestId('searchname'), {
      target: { value: 'Cookie' },
    });
    fireEvent.click(screen.getByTestId('searchButton'));

    expect(screen.getByText('Cookie shop')).toBeInTheDocument();
  });

  it('filter active advertisement by description', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={getActiveAdvertisementMocks}
                addTypename={false}
              >
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

    fireEvent.change(screen.getByTestId('searchname'), {
      target: { value: 'this is an active advertisement' },
    });
    fireEvent.click(screen.getByTestId('searchButton'));

    expect(screen.getByText('Cookie shop')).toBeInTheDocument();
  });

  it('render completed advertisement after loading', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={getCompletedAdvertisementMocks}
                addTypename={false}
              >
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
    fireEvent.click(screen.getByTestId('moreiconbtn'));
    expect(screen.getByTestId('deletebtn')).toBeInTheDocument();
    expect(screen.getByTestId('editBtn')).toBeInTheDocument();
  });

  it('loads more archived advertisements on scroll', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={initialArchivedData} addTypename={false}>
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

    await act(() => {
      const tab = screen.getByText('Completed Campaigns');
      fireEvent.click(tab);
      expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
        'Completed Campaigns',
      );
    });

    await act(() => {
      fireEvent.scroll(window, { target: { scrollY: 500 } });
    });

    expect(screen.getByText('Cookie shop infinite 1')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 1')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 2')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 3')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 4')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 5')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 6')).toBeInTheDocument();
  });

  it('loads more active advertisements on scroll', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={initialActiveData} addTypename={false}>
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

    await act(() => {
      const tab = screen.getByText('Active Campaigns');
      fireEvent.click(tab);
    });

    await wait();
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
      'Active Campaigns',
    );

    await act(() => {
      fireEvent.scroll(window, { target: { scrollY: 500 } });
    });

    await wait();

    expect(screen.getByText('Cookie shop 1')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 2')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 3')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 4')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 5')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop 6')).toBeInTheDocument();
    expect(screen.getByText('Cookie shop infinite 1')).toBeInTheDocument();
  });

  it('search button renders correctly with placeholder', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={getCompletedAdvertisementMocks}
                addTypename={false}
              >
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
      'Search..',
    );
  });

  it('filter active advertisement by name', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={filterActiveAdvertisementData}
                addTypename={false}
              >
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

    fireEvent.change(screen.getByTestId('searchname'), {
      target: { value: 'Cookie shop 6' },
    });
    fireEvent.click(screen.getByTestId('searchButton'));

    await wait();
    expect(screen.getByText('Cookie shop 6')).toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 5')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 4')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 3')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie shop 1')).not.toBeInTheDocument();
  });

  it('filter active advertisement by description', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={filterActiveAdvertisementData}
                addTypename={false}
              >
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

    fireEvent.change(screen.getByTestId('searchname'), {
      target: { value: 'this is an active advertisement 6' },
    });
    fireEvent.click(screen.getByTestId('searchButton'));

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
              <MockedProvider
                mocks={filterCompletedAdvertisementData}
                addTypename={false}
              >
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

    fireEvent.change(screen.getByTestId('searchname'), {
      target: { value: 'Cookie shop 6' },
    });
    fireEvent.click(screen.getByTestId('searchButton'));

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
              <MockedProvider
                mocks={filterCompletedAdvertisementData}
                addTypename={false}
              >
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

    fireEvent.change(screen.getByTestId('searchname'), {
      target: { value: 'this is a completed advertisement 6' },
    });
    fireEvent.click(screen.getByTestId('searchButton'));

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
              <MockedProvider
                mocks={getCompletedAdvertisementMocks}
                addTypename={false}
              >
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

    fireEvent.change(screen.getByTestId('searchname'), {
      target: { value: 'BandhanSearchedIt' },
    });
    fireEvent.click(screen.getByTestId('searchButton'));
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
              <MockedProvider mocks={createAdvertisement} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

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
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rtype), {
        target: { value: 'banner' },
      });

      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: dateConstants.create.startAtISO.split('T')[0] },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: dateConstants.create.endAtISO.split('T')[0] },
      });
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue('Ad1');
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      dateConstants.create.startAtISO.split('T')[0],
    );
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      dateConstants.create.endAtISO.split('T')[0],
    );

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    await waitFor(() => {
      expect(createAdMock).toHaveBeenCalledWith({
        variables: {
          organizationId: '1',
          name: 'Ad1',
          type: 'banner',
          attachments: undefined,
          startAt: dateConstants.create.startAtCalledWith,
          endAt: dateConstants.create.endAtCalledWith,
        },
      });
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
    const toastErrorSpy = vi.spyOn(toast, 'error');
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={createAdvertisementWithoutName}
                addTypename={false}
              >
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(
      screen.getByText(translations.createAdvertisement),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(translations.createAdvertisement));
    });

    expect(screen.queryByText(translations.addNew)).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rtype), {
        target: { value: 'banner' },
      });

      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: dateConstants.create.startAtISO.split('T')[0] },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: dateConstants.create.endAtISO.split('T')[0] },
      });
    });

    expect(screen.getByLabelText(translations.Rname)).not.toHaveValue();
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      dateConstants.create.startAtISO.split('T')[0],
    );
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      dateConstants.create.endAtISO.split('T')[0],
    );

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    expect(toastErrorSpy).toHaveBeenCalledWith(
      'Invalid arguments for this action.',
    );
  });

  it('creating advertisement with end date before than start date should throw an error', async () => {
    const toastErrorSpy = vi.spyOn(toast, 'error');
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={createAdvertisementWithEndDateBeforeStart}
                addTypename={false}
              >
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

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
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rtype), {
        target: { value: 'banner' },
      });

      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: dateConstants.create.startAtISO.split('T')[0] },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: dateConstants.create.endBeforeStartISO.split('T')[0] },
      });
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue('Ad1');
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      dateConstants.create.startAtISO.split('T')[0],
    );
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      dateConstants.create.endBeforeStartISO.split('T')[0],
    );

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    expect(toastErrorSpy).toHaveBeenCalledWith(
      'End Date should be greater than Start Date',
    );
  });

  it('should handle unknown errors', async () => {
    const toastErrorSpy = vi.spyOn(toast, 'error');
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={createAdvertisementError}
                addTypename={false}
              >
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

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
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rtype), {
        target: { value: 'banner' },
      });

      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: dateConstants.create.startAtISO.split('T')[0] },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: dateConstants.create.endAtISO.split('T')[0] },
      });
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue('Ad1');
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      dateConstants.create.startAtISO.split('T')[0],
    );
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      dateConstants.create.endAtISO.split('T')[0],
    );

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
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
              <MockedProvider mocks={updateAdMocks} addTypename={false}>
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
    fireEvent.click(screen.getByTestId('moreiconbtn'));
    expect(screen.getByTestId('editBtn')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('editBtn'));

    const descriptionField = screen.getByLabelText(
      'Enter description of Advertisement (optional)',
    );
    fireEvent.change(descriptionField, {
      target: { value: 'This is an updated advertisement' },
    });
    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: dateConstants.update.startAtISO.split('T')[0] },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: dateConstants.update.endAtISO.split('T')[0] },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('addonupdate'));
    });

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith({
        variables: {
          id: '1',
          description: 'This is an updated advertisement',
          startAt: dateConstants.update.startAtCalledWith,
          endAt: dateConstants.update.endAtCalledWith,
        },
      });
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
              <MockedProvider
                mocks={getActiveAdvertisementMocks}
                addTypename={false}
              >
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    fireEvent.click(screen.getByTestId('moreiconbtn'));
    fireEvent.click(screen.getByTestId('editBtn'));

    expect(screen.getByTestId('addonupdate')).toBeInTheDocument();
    expect(screen.getByTestId('addonclose')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('addonclose'));

    await waitFor(() => {
      expect(screen.queryByTestId('addonupdate')).not.toBeInTheDocument();
    });
  });

  it('validates advertisement update form properly', async () => {
    const toastErrorSpy = vi.spyOn(toast, 'error');
    const updateMock = vi.fn();
    mockUseMutation.mockReturnValue([updateMock]);

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={getActiveAdvertisementMocks}
                addTypename={false}
              >
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    fireEvent.click(screen.getByTestId('moreiconbtn'));

    fireEvent.click(screen.getByTestId('editBtn'));

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: dateConstants.update.startAtISO.split('T')[0] },
      });
    });
    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: dateConstants.update.endBeforeStartISO.split('T')[0] },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('addonupdate'));
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
              <MockedProvider
                mocks={deleteAdvertisementMocks}
                addTypename={false}
              >
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
    fireEvent.click(getByTestId('moreiconbtn'));
    expect(getByTestId('deletebtn')).toBeInTheDocument();
    fireEvent.click(getByTestId('deletebtn'));
    await waitFor(() => {
      expect(getByTestId('delete_title')).toBeInTheDocument();
      expect(getByTestId('delete_body')).toBeInTheDocument();
    });
    await act(() => {
      fireEvent.click(getByTestId('delete_no'));
    });

    await wait();
    expect(screen.queryByTestId('delete_title')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete_body')).not.toBeInTheDocument();

    expect(getByTestId('moreiconbtn')).toBeInTheDocument();
  });

  it('delete advertisement', async () => {
    const toastSuccessSpy = vi.spyOn(toast, 'success');
    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={deleteAdvertisementMocks}
                addTypename={false}
              >
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
    fireEvent.click(getByTestId('moreiconbtn'));
    expect(getByTestId('deletebtn')).toBeInTheDocument();
    fireEvent.click(getByTestId('deletebtn'));
    await waitFor(() => {
      expect(getByTestId('delete_title')).toBeInTheDocument();
      expect(getByTestId('delete_body')).toBeInTheDocument();
    });
    await act(() => {
      fireEvent.click(getByTestId('delete_yes'));
    });
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        'Advertisement deleted successfully.',
      );
    });
  });

  it('handles GraphQL errors when fetching advertisements', async () => {
    const toastErrorSpy = vi.spyOn(toast, 'error');

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={fetchErrorMocks} addTypename={false}>
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
              <MockedProvider mocks={[]} addTypename={false}>
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
              <MockedProvider
                mocks={getCompletedAdvertisementMocks}
                addTypename={false}
              >
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
        i18n.getDataByLanguage('en')?.translation.advertisement ?? {},
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
              <MockedProvider mocks={emptyMocks} addTypename={false}>
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
              <MockedProvider
                mocks={getCompletedAdvertisementMocks}
                addTypename={false}
              >
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    fireEvent.click(screen.getByText(translations.createAdvertisement));
    expect(screen.queryByText(translations.addNew)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: 'Test Ad' },
    });

    fireEvent.click(screen.getByTestId('addonclose'));

    await waitFor(() => {
      expect(screen.queryByText(translations.addNew)).not.toBeInTheDocument();
    });
  });
});
