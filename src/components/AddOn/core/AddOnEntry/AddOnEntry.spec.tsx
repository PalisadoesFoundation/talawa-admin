/**
 * Unit tests for the AddOnEntry component.
 *
 * This file contains tests for the AddOnEntry component to ensure it behaves as expected
 * under various scenarios.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import AddOnEntry from './AddOnEntry';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import { describe, test, vi, expect } from 'vitest';
import type { NormalizedCacheObject } from '@apollo/client';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BACKEND_URL } from 'Constant/constant';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import { MockedProvider, wait } from '@apollo/react-testing';
import { StaticMockLink } from 'utils/StaticMockLink';
import { ADD_ON_ENTRY_MOCK } from './AddOnEntryMocks';
import { ToastContainer } from 'react-toastify';
import useLocalStorage from 'utils/useLocalstorage';

const { getItem } = useLocalStorage();

const link = new StaticMockLink(ADD_ON_ENTRY_MOCK, true);

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + getItem('token') || '',
  },
});
console.error = vi.fn();
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});
let mockID: string | undefined = '1';

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useParams: () => ({ orgId: mockID }),
}));

describe('Testing AddOnEntry', () => {
  const props = {
    id: 'string',
    enabled: true,
    title: 'string',
    description: 'string',
    createdBy: 'string',
    component: 'string',
    installed: true,
    configurable: true,
    modified: true,
    isInstalled: true,
    getInstalledPlugins: (): { sample: string } => {
      return { sample: 'sample' };
    },
  };

  test('should render modal and take info to add plugin for registered organization', () => {
    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnEntry uninstalledOrgs={[]} {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    expect(getByTestId('AddOnEntry')).toBeInTheDocument();
  });

  test('uses default values for title and description when not provided', () => {
    const mockGetInstalledPlugins = vi.fn();
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnEntry
                id="123"
                createdBy="user1"
                uninstalledOrgs={['Org1']}
                getInstalledPlugins={mockGetInstalledPlugins}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    const titleElement = screen.getByText('No title provided');
    const descriptionElement = screen.getByText('Description not available');
    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  test('renders correctly', () => {
    const props = {
      id: '1',
      title: 'Test Addon',
      description: 'Test addon description',
      createdBy: 'Test User',
      component: 'string',
      installed: true,
      configurable: true,
      modified: true,
      isInstalled: true,
      uninstalledOrgs: [],
      enabled: true,
      getInstalledPlugins: (): { sample: string } => {
        return { sample: 'sample' };
      },
    };

    const { getByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnEntry {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(getByText('Test Addon')).toBeInTheDocument();
    expect(getByText('Test addon description')).toBeInTheDocument();
    expect(getByText('Test User')).toBeInTheDocument();
  });

  test('Uninstall Button works correctly', async () => {
    const props = {
      id: '1',
      title: 'Test Addon',
      description: 'Test addon description',
      createdBy: 'Test User',
      component: 'string',
      installed: true,
      configurable: true,
      modified: true,
      isInstalled: true,
      uninstalledOrgs: [],
      enabled: true,
      getInstalledPlugins: (): { sample: string } => {
        return { sample: 'sample' };
      },
    };
    mockID = 'undefined';
    const { findByText, getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <AddOnEntry {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    const btn = await getByTestId('AddOnEntry_btn_install');
    await userEvent.click(btn);
    expect(btn.innerHTML).toMatch(/Install/i);
    expect(
      await findByText('This feature is now removed from your organization'),
    ).toBeInTheDocument();

    await userEvent.click(btn);
    expect(btn.innerHTML).toMatch(/Uninstall/i);
    expect(
      await findByText('This feature is now enabled in your organization'),
    ).toBeInTheDocument();
  });

  it('Check if uninstalled orgs includes current org', async () => {
    const props = {
      id: '1',
      title: 'Test Addon',
      description: 'Test addon description',
      createdBy: 'Test User',
      component: 'string',
      installed: true,
      configurable: true,
      modified: true,
      isInstalled: true,
      uninstalledOrgs: ['undefined'],
      enabled: true,
      getInstalledPlugins: (): { sample: string } => {
        return { sample: 'sample' };
      },
    };

    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<AddOnEntry {...props} />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait(100);
    const btn = getByTestId('AddOnEntry_btn_install');
    expect(btn.innerHTML).toMatch(/install/i);
  });

  test('should redirect to /orglist if orgId is undefined', async () => {
    mockID = undefined;
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnEntry uninstalledOrgs={[]} {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    expect(window.location.pathname).toEqual('/orglist');
  });
});
