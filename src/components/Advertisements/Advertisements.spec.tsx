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
  getAdvertisementMocks,
  deleteAdvertisementMocks,
  updateAddSuccess,
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

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.advertisement ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

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
              <MockedProvider mocks={getAdvertisementMocks} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
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

  it('render advertisement screen and delete button', async () => {
    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={getAdvertisementMocks} addTypename={false}>
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
    expect(getByTestId('AdEntry')).toBeInTheDocument();
    expect(getByTestId('Ad_type')).toBeInTheDocument();
    expect(getByTestId('Ad_type')).toHaveTextContent('banner');
    expect(getByTestId('Ad_name')).toBeInTheDocument();
    expect(getByTestId('Ad_name')).toHaveTextContent('Cookie shop');
    expect(getByTestId('Ad_desc')).toBeInTheDocument();
    expect(getByTestId('Ad_desc')).toHaveTextContent(
      'this advertisement is created by admin',
    );
    expect(getByTestId('media')).toBeInTheDocument();
    expect(getByTestId('moreiconbtn')).toBeInTheDocument();
    fireEvent.click(getByTestId('moreiconbtn'));
    expect(getByTestId('deletebtn')).toBeInTheDocument();
  });

  test('update advertisement', async () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    const toastSuccessSpy = vi.spyOn(toast, 'success');
    await act(async () => {
      render(
        <MockedProvider addTypename={false} mocks={updateAddSuccess}>
          <Provider store={store}>
            <BrowserRouter>
              <I18nextProvider i18n={i18n}>
                <Advertisement />
              </I18nextProvider>
            </BrowserRouter>
          </Provider>
        </MockedProvider>,
      );
    });

    await wait(); // wait for the loading spinner to disappear

    //Testing rendering
    expect(screen.getByTestId('MoreVertIcon')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('MoreVertIcon'));

    await wait();

    expect(screen.getByTestId('editBtn')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('editBtn'));

    await wait();

    expect(screen.getByTestId('Ad_desc')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(translations.Rdesc), {
      target: { value: 'this advertisement is edited by admin' },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('addonupdate'));
    });

    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        'Advertisement updated Successfully',
      );
      expect(setTimeoutSpy).toHaveBeenCalled();
    });
    vi.useRealTimers();
  });
});
