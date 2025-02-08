import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { ApolloProvider } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { store } from '../../state/store';
import i18nForTest from '../../utils/i18nForTest';
import Advertisement from './Advertisements';
import {
  wait,
  client,
  ADVERTISEMENTS_LIST_MOCK,
  PLUGIN_GET_MOCK,
  ADD_ADVERTISEMENT_MUTATION_MOCK,
  ORGANIZATIONS_LIST_MOCK,
} from './mocks';

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
  return {
    ...actual,
    useParams: () => ({ orgId: mockID }),
  };
});

describe('Testing Advertisement Component', () => {
  test('for creating new Advertisements', async () => {
    const mocks = [
      ORGANIZATIONS_LIST_MOCK,
      PLUGIN_GET_MOCK,
      ADD_ADVERTISEMENT_MUTATION_MOCK,
      ...ADVERTISEMENTS_LIST_MOCK,
    ];

    render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Advertisement />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByText('Create Advertisement'));
    userEvent.type(
      screen.getByLabelText('Enter name of Advertisement'),
      'Cookie Shop',
    );
    const mediaFile = new File(['media content'], 'test.png', {
      type: 'image/png',
    });

    const mediaInput = screen.getByTestId('advertisementMedia');
    fireEvent.change(mediaInput, {
      target: {
        files: [mediaFile],
      },
    });

    const mediaPreview = await screen.findByTestId('mediaPreview');
    expect(mediaPreview).toBeInTheDocument();

    userEvent.selectOptions(
      screen.getByLabelText('Select type of Advertisement'),
      'POPUP',
    );
    userEvent.type(screen.getByLabelText('Select Start Date'), '2023-01-01');
    userEvent.type(screen.getByLabelText('Select End Date'), '2023-02-02');

    userEvent.click(screen.getByTestId('addonregister'));
    expect(
      await screen.findByText('Advertisement created successfully.'),
    ).toBeInTheDocument();
  });

  test('for the working of the tabs', async () => {
    const mocks = [
      ORGANIZATIONS_LIST_MOCK,
      PLUGIN_GET_MOCK,
      ADD_ADVERTISEMENT_MUTATION_MOCK,
      ...ADVERTISEMENTS_LIST_MOCK,
    ];

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    await wait();
    const activeTab = await screen.findByRole('tab', {
      name: /Active Campaigns/i,
    });
    expect(activeTab).toBeInTheDocument(); // Ensure the tab exists
    userEvent.click(activeTab);

    await wait();

    userEvent.click(screen.getByText(/Completed Campaigns/i));
  });

  test('if the component renders correctly and ads are correctly categorized date-wise', async () => {
    mockID = '1';
    const mocks = [...ADVERTISEMENTS_LIST_MOCK];

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    const ads = await screen.findAllByTestId('Ad_end_date');
    expect(ads.length).toBeGreaterThan(0);

    const activeAds = ads.filter((ad) => {
      const dateText = ad.textContent || '';
      const match = dateText.match(/Ends on\s+(.+)/);
      if (!match) return false;
      const adDate = new Date(match[1].trim());
      return !isNaN(adDate.getTime()) && adDate > new Date();
    });
    expect(activeAds.length).toBeGreaterThan(0);

    const archivedAds = ads.filter((ad) => new Date(ad.innerHTML) < new Date());

    expect(activeAds.length + archivedAds.length).toBe(ads.length);
  });

  test('delete ad', async () => {
    mockID = '1';
    const mocks = [...ADVERTISEMENTS_LIST_MOCK];

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    const moreiconbtn = await screen.findAllByTestId('moreiconbtn');
    fireEvent.click(moreiconbtn[1]);

    const deleteBtn = await screen.findByTestId('deletebtn');
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);
  });

  test('infinite scroll', async () => {
    mockID = '1';
    const mocks = [...ADVERTISEMENTS_LIST_MOCK];

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    let moreiconbtn = await screen.findAllByTestId('moreiconbtn');
    expect(moreiconbtn.length).toBeGreaterThan(0);

    fireEvent.scroll(window, { target: { scrollY: 500 } });

    moreiconbtn = await screen.findAllByTestId('moreiconbtn');
    expect(moreiconbtn.length).toBeGreaterThan(0);
  });
});
