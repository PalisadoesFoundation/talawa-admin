import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddOnEntry from './AddOnEntry';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';

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

const link = new StaticMockLink(ADD_ON_ENTRY_MOCK, true);

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + localStorage.getItem('token') || '',
  },
});
console.error = jest.fn();
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

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
              {<AddOnEntry uninstalledOrgs={[]} {...props} />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    expect(getByTestId('AddOnEntry')).toBeInTheDocument();
  });

  it('renders correctly', () => {
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
              {<AddOnEntry {...props} />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    expect(getByText('Test Addon')).toBeInTheDocument();
    expect(getByText('Test addon description')).toBeInTheDocument();
    expect(getByText('Test User')).toBeInTheDocument();
  });
  it('Uninstall Button works correctly', async () => {
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

    const { findByText, getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              {<AddOnEntry {...props} />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );
    await wait(100);
    const btn = getByTestId('AddOnEntry_btn_install');
    await userEvent.click(btn);
    await wait(100);
    expect(btn.innerHTML).toMatch(/Install/i);
    expect(
      await findByText('This feature is now removed from your organization')
    ).toBeInTheDocument();
    await userEvent.click(btn);
    await wait(100);

    expect(btn.innerHTML).toMatch(/Uninstall/i);
    expect(
      await findByText('This feature is now enabled in your organization')
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
      </MockedProvider>
    );
    await wait(100);
    const btn = getByTestId('AddOnEntry_btn_install');
    expect(btn.innerHTML).toMatch(/install/i);
  });
});
