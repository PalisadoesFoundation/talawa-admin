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
import { BrowserRouter } from 'react-router-dom';
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
} from './AdvertisementsMocks';
import i18n from '../../utils/i18nForTest';

vi.mock('components/AddOn/support/services/Plugin.helper', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => ({
    fetchInstalled: vi.fn().mockResolvedValue([]),
    fetchStore: vi.fn().mockResolvedValue([]),
  })),
}));
let mockID: string | undefined = '1';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useParams: () => ({ orgId: mockID }) };
});

const today = new Date();
const tomorrow = today;
tomorrow.setDate(today.getDate() + 1);

global.URL.createObjectURL = vi.fn(() => 'mocked-url');

describe('Testing Advertisement Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  test('switches between active and archived tabs', async () => {
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

    const archivedTab = screen.getByRole('tab', { name: /Active Campaigns/i });
    fireEvent.click(archivedTab);

    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
      /Active Campaigns/i,
    );
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
    await wait(); // wait for the loading spinner to disappear
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
    await wait(); // wait for the loading spinner to disappear
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

    await wait(); // wait for the loading spinner to disappear

    //Testing rendering
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

    // Get translation
    const translations = JSON.parse(
      JSON.stringify(
        i18n.getDataByLanguage('en')?.translation.advertisement ?? {},
      ),
    );

    // Verify document title is set correctly
    expect(document.title).toBe(translations.title);
  });
});
